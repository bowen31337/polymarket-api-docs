/**
 * MetaMask Wallet Connection Manager for Polymarket API Docs
 * Handles wallet connection, network switching, and state management
 */
class WalletConnector {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.chainId = 137; // Polygon mainnet
    this.apiCredentials = null;
    this.funderAddress = null;
    this.signatureType = 2; // Default to GNOSIS_SAFE
  }

  /**
   * Connect to MetaMask wallet
   */
  async connect() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed. Please install MetaMask to use wallet features.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.address = accounts[0];

      // Check and switch to Polygon if needed
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (parseInt(currentChainId, 16) !== this.chainId) {
        await this.switchToPolygon();
      }

      // Load stored credentials if available
      this.loadStoredCredentials();

      // Setup event listeners
      this.setupEventListeners();

      // Update UI
      this.updateUI();

      return this.address;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  /**
   * Switch network to Polygon
   */
  async switchToPolygon() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // 137 in hex
      });
    } catch (switchError) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
            rpcUrls: ['https://polygon-rpc.com'],
            blockExplorerUrls: ['https://polygonscan.com']
          }]
        });
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Setup MetaMask event listeners
   */
  setupEventListeners() {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.address = accounts[0];
        this.clearStoredCredentials();
        this.updateUI();
        if (window.showToast) {
          window.showToast('Account changed. Please re-create API credentials.', 'info');
        }
      }
    });

    window.ethereum.on('chainChanged', (chainId) => {
      const numericChainId = parseInt(chainId, 16);
      if (numericChainId !== this.chainId) {
        if (window.showToast) {
          window.showToast('Please switch to Polygon network', 'warning');
        }
      }
      this.updateUI();
    });
  }

  /**
   * Disconnect wallet
   */
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.apiCredentials = null;
    this.clearStoredCredentials();
    this.updateUI();
  }

  /**
   * Update UI based on connection state
   */
  updateUI() {
    const statusEl = document.getElementById('wallet-status');
    const addressEl = document.getElementById('wallet-address');
    const connectBtn = document.getElementById('connect-wallet');
    const disconnectBtn = document.getElementById('disconnect-wallet');
    const credentialsPanel = document.getElementById('credentials-panel');
    const networkBadge = document.getElementById('network-badge');
    const funderInput = document.getElementById('funder-address');
    const sigTypeSelect = document.getElementById('signature-type');

    if (this.address) {
      statusEl.className = 'wallet-status connected';
      addressEl.textContent = `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
      connectBtn.style.display = 'none';
      disconnectBtn.style.display = 'inline-block';
      credentialsPanel.style.display = 'grid';
      networkBadge.style.display = 'flex';

      // Set funder address to connected address if not set
      if (!funderInput.value) {
        funderInput.value = this.address;
        this.funderAddress = this.address;
      }

      // Update credentials display if available
      if (this.apiCredentials) {
        document.getElementById('credentials-display').style.display = 'block';
        document.getElementById('display-api-key').textContent = this.apiCredentials.apiKey;
      }
    } else {
      statusEl.className = 'wallet-status disconnected';
      addressEl.textContent = 'Not Connected';
      connectBtn.style.display = 'inline-block';
      disconnectBtn.style.display = 'none';
      credentialsPanel.style.display = 'none';
      networkBadge.style.display = 'none';
    }

    // Sync signature type
    if (sigTypeSelect) {
      sigTypeSelect.value = this.signatureType.toString();
    }
  }

  /**
   * Get ethers signer
   */
  getSigner() {
    return this.signer;
  }

  /**
   * Get connected address
   */
  getAddress() {
    return this.address;
  }

  /**
   * Get funder address
   */
  getFunderAddress() {
    return this.funderAddress || this.address;
  }

  /**
   * Set funder address
   */
  setFunderAddress(address) {
    this.funderAddress = address;
  }

  /**
   * Get signature type
   */
  getSignatureType() {
    return this.signatureType;
  }

  /**
   * Set signature type
   */
  setSignatureType(type) {
    this.signatureType = parseInt(type);
  }

  /**
   * Set API credentials
   */
  setApiCredentials(credentials) {
    this.apiCredentials = credentials;
    // Store in sessionStorage for persistence
    sessionStorage.setItem('polymarket_api_creds', JSON.stringify(credentials));
    sessionStorage.setItem('polymarket_api_address', this.address);

    // Update UI
    document.getElementById('credentials-display').style.display = 'block';
    document.getElementById('display-api-key').textContent = credentials.apiKey;
  }

  /**
   * Get API credentials
   */
  getApiCredentials() {
    if (!this.apiCredentials) {
      this.loadStoredCredentials();
    }
    return this.apiCredentials;
  }

  /**
   * Load stored credentials from sessionStorage
   */
  loadStoredCredentials() {
    const stored = sessionStorage.getItem('polymarket_api_creds');
    const storedAddress = sessionStorage.getItem('polymarket_api_address');

    // Only load if stored for same address
    if (stored && storedAddress === this.address) {
      this.apiCredentials = JSON.parse(stored);
    }
  }

  /**
   * Clear stored credentials
   */
  clearStoredCredentials() {
    this.apiCredentials = null;
    sessionStorage.removeItem('polymarket_api_creds');
    sessionStorage.removeItem('polymarket_api_address');
    const credentialsDisplay = document.getElementById('credentials-display');
    if (credentialsDisplay) {
      credentialsDisplay.style.display = 'none';
    }
  }

  /**
   * Check if wallet is connected
   */
  isConnected() {
    return !!this.address;
  }
}

// Create global instance
window.walletConnector = new WalletConnector();

// Initialize UI handlers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Connect wallet button
  document.getElementById('connect-wallet')?.addEventListener('click', async () => {
    try {
      await window.walletConnector.connect();
      window.showToast('Wallet connected successfully!', 'success');
    } catch (error) {
      window.showToast('Failed to connect: ' + error.message, 'error');
    }
  });

  // Disconnect wallet button
  document.getElementById('disconnect-wallet')?.addEventListener('click', () => {
    window.walletConnector.disconnect();
    window.showToast('Wallet disconnected', 'info');
  });

  // Funder address input
  document.getElementById('funder-address')?.addEventListener('change', (e) => {
    window.walletConnector.setFunderAddress(e.target.value);
  });

  // Signature type select
  document.getElementById('signature-type')?.addEventListener('change', (e) => {
    window.walletConnector.setSignatureType(e.target.value);
  });

  // Create API key button
  document.getElementById('create-api-key')?.addEventListener('click', async () => {
    const signer = window.walletConnector.getSigner();
    if (!signer) {
      window.showToast('Please connect your wallet first', 'warning');
      return;
    }

    try {
      window.showToast('Please sign the message in MetaMask...', 'info');
      const credentials = await window.eip712Signer.createApiKey(signer);
      window.walletConnector.setApiCredentials(credentials);
      window.showToast('API key created successfully!', 'success');
    } catch (error) {
      console.error('Create API key error:', error);
      window.showToast('Failed to create API key: ' + error.message, 'error');
    }
  });

  // Derive API key button
  document.getElementById('derive-api-key')?.addEventListener('click', async () => {
    const signer = window.walletConnector.getSigner();
    if (!signer) {
      window.showToast('Please connect your wallet first', 'warning');
      return;
    }

    try {
      window.showToast('Please sign the message in MetaMask...', 'info');
      const credentials = await window.eip712Signer.deriveApiKey(signer, 0);
      window.walletConnector.setApiCredentials(credentials);
      window.showToast('API key derived successfully!', 'success');
    } catch (error) {
      console.error('Derive API key error:', error);
      window.showToast('Failed to derive API key: ' + error.message, 'error');
    }
  });
});
