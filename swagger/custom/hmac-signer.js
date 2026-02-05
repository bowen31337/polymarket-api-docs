/**
 * HMAC-SHA256 Signing Implementation for Polymarket L2 Authentication
 * Used for authenticated API requests after obtaining API credentials
 */
class HMACSigner {
  /**
   * Create HMAC-SHA256 signature for L2 authentication
   * @param {string} secret - Base64-encoded API secret
   * @param {string} timestamp - UNIX timestamp string
   * @param {string} method - HTTP method (GET, POST, DELETE)
   * @param {string} requestPath - Request path (e.g., /order)
   * @param {string} body - Request body (empty string for GET requests)
   * @returns {Promise<string>} Base64-encoded HMAC signature
   */
  async sign(secret, timestamp, method, requestPath, body = '') {
    // Construct the message to sign: timestamp + method + path + body
    const message = timestamp + method.toUpperCase() + requestPath + body;

    // Decode base64 secret to bytes
    const secretBytes = Uint8Array.from(atob(secret), c => c.charCodeAt(0));

    // Import key for HMAC
    const key = await crypto.subtle.importKey(
      'raw',
      secretBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Create signature
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, data);

    // Convert to base64
    const signatureArray = new Uint8Array(signatureBuffer);
    return btoa(String.fromCharCode.apply(null, signatureArray));
  }

  /**
   * Build L2 authentication headers for API requests
   * @param {Object} credentials - API credentials {apiKey, secret, passphrase}
   * @param {string} address - Wallet address
   * @param {string} method - HTTP method
   * @param {string} requestPath - Request path
   * @param {string} body - Request body
   * @returns {Promise<Object>} Headers object with all L2 auth headers
   */
  async buildL2Headers(credentials, address, method, requestPath, body = '') {
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const signature = await this.sign(
      credentials.secret,
      timestamp,
      method,
      requestPath,
      body
    );

    return {
      'POLY_ADDRESS': address,
      'POLY_SIGNATURE': signature,
      'POLY_TIMESTAMP': timestamp,
      'POLY_API_KEY': credentials.apiKey,
      'POLY_PASSPHRASE': credentials.passphrase
    };
  }

  /**
   * Verify that credentials are valid (has all required fields)
   * @param {Object} credentials - API credentials to verify
   * @returns {boolean} True if credentials are valid
   */
  verifyCredentials(credentials) {
    if (!credentials) {
      return false;
    }
    const { apiKey, secret, passphrase } = credentials;
    return Boolean(apiKey && secret && passphrase);
  }
}

// Create global instance
window.hmacSigner = new HMACSigner();
