/**
 * EIP-712 Signing Implementation for Polymarket L1 Authentication
 * Used to create and derive API credentials
 */
class EIP712Signer {
  constructor(chainId = 137) {
    this.chainId = chainId;

    // EIP-712 Domain for Polymarket CLOB Auth
    this.domain = {
      name: "ClobAuthDomain",
      version: "1",
      chainId: chainId
    };

    // EIP-712 Types for authentication message
    this.types = {
      ClobAuth: [
        { name: "address", type: "address" },
        { name: "timestamp", type: "string" },
        { name: "nonce", type: "uint256" },
        { name: "message", type: "string" }
      ]
    };

    // Standard authentication message
    this.authMessage = "This message attests that I control the given wallet";
  }

  /**
   * Sign L1 authentication message using EIP-712
   * @param {ethers.Signer} signer - Ethers signer instance
   * @param {number} nonce - Nonce value (default 0)
   * @returns {Promise<{signature: string, timestamp: string, address: string, nonce: string}>}
   */
  async signL1Auth(signer, nonce = 0) {
    const address = await signer.getAddress();
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const value = {
      address: address,
      timestamp: timestamp,
      nonce: nonce,
      message: this.authMessage
    };

    // Sign using EIP-712 typed data
    const signature = await signer._signTypedData(
      this.domain,
      this.types,
      value
    );

    return {
      signature,
      timestamp,
      address,
      nonce: nonce.toString()
    };
  }

  /**
   * Build L1 authentication headers for API requests
   * @param {ethers.Signer} signer - Ethers signer
   * @param {number} nonce - Nonce value
   * @returns {Promise<Object>} Headers object
   */
  async buildL1Headers(signer, nonce = 0) {
    const authData = await this.signL1Auth(signer, nonce);

    return {
      'POLY_ADDRESS': authData.address,
      'POLY_SIGNATURE': authData.signature,
      'POLY_TIMESTAMP': authData.timestamp,
      'POLY_NONCE': authData.nonce
    };
  }

  /**
   * Make an authenticated API request with L1 headers
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @param {string} errorContext - Error message context
   * @returns {Promise<Object>} Response JSON
   */
  async _authenticatedRequest(url, options, errorContext) {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = errorContext;
      try {
        const error = await response.json();
        errorMessage = error.error || error.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Create new API key using L1 authentication
   * @param {ethers.Signer} signer - Ethers signer
   * @param {number} nonce - Optional nonce (default 0)
   * @returns {Promise<{apiKey: string, secret: string, passphrase: string}>}
   */
  async createApiKey(signer, nonce = 0) {
    const headers = await this.buildL1Headers(signer, nonce);

    return this._authenticatedRequest(
      'https://clob.polymarket.com/auth/api-key',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers }
      },
      'Failed to create API key'
    );
  }

  /**
   * Derive existing API key using L1 authentication
   * @param {ethers.Signer} signer - Ethers signer
   * @param {number} nonce - Nonce used when creating the key
   * @returns {Promise<{apiKey: string, secret: string, passphrase: string}>}
   */
  async deriveApiKey(signer, nonce = 0) {
    const headers = await this.buildL1Headers(signer, nonce);

    return this._authenticatedRequest(
      'https://clob.polymarket.com/auth/derive-api-key',
      { method: 'GET', headers },
      'Failed to derive API key'
    );
  }

  /**
   * Create or derive API key (convenience method)
   * Tries to derive first, creates if not found
   * @param {ethers.Signer} signer - Ethers signer
   * @param {number} nonce - Nonce value
   * @returns {Promise<{apiKey: string, secret: string, passphrase: string}>}
   */
  async createOrDeriveApiKey(signer, nonce = 0) {
    try {
      return await this.deriveApiKey(signer, nonce);
    } catch (error) {
      // If derive fails, try to create
      return await this.createApiKey(signer, nonce);
    }
  }
}

// Create global instance
window.eip712Signer = new EIP712Signer(137);
