/**
 * Polymarket Authentication Plugin for Swagger UI
 * Automatically injects authentication headers based on endpoint requirements
 */

// Endpoints that require L1 authentication (EIP-712)
const L1_ENDPOINTS = [
  '/auth/api-key',
  '/auth/derive-api-key'
];

// Endpoints that require L2 authentication (HMAC-SHA256)
const L2_ENDPOINTS = [
  '/order',
  '/orders',
  '/cancel',
  '/cancel-all',
  '/cancel-orders',
  '/cancel-market-orders',
  '/data/orders',
  '/data/trades',
  '/balance-allowance'
];

/**
 * Check if a path requires L1 authentication
 * @param {string} path - Request path
 * @returns {boolean}
 */
function requiresL1Auth(path) {
  return L1_ENDPOINTS.some(ep => path.includes(ep));
}

/**
 * Check if a path requires L2 authentication
 * @param {string} path - Request path
 * @returns {boolean}
 */
function requiresL2Auth(path) {
  return L2_ENDPOINTS.some(ep => path.includes(ep));
}

/**
 * Request interceptor for automatic header injection
 * This function is called before every request made through Swagger UI
 * @param {Request} request - The request object
 * @returns {Promise<Request>} Modified request with auth headers
 */
async function polymarketRequestInterceptor(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  const walletConnector = window.walletConnector;
  const address = walletConnector?.getAddress();

  // If no wallet connected, proceed without modification
  if (!address) {
    return request;
  }

  try {
    if (requiresL1Auth(path)) {
      // L1 Authentication - EIP-712 signature
      const signer = walletConnector.getSigner();
      if (!signer) {
        console.warn('L1 endpoint requires wallet signer');
        return request;
      }

      if (window.showToast) {
        window.showToast('Please sign the authentication message...', 'info');
      }

      const headers = await window.eip712Signer.buildL1Headers(signer, 0);
      Object.assign(request.headers, headers);

      console.log('Added L1 auth headers for:', path);

    } else if (requiresL2Auth(path)) {
      // L2 Authentication - HMAC-SHA256 signature
      const credentials = walletConnector.getApiCredentials();

      if (!credentials) {
        console.warn('L2 endpoint requires API credentials. Please create/derive API key first.');
        if (window.showToast) {
          window.showToast('Please create API credentials first', 'warning');
        }
        return request;
      }

      if (!window.hmacSigner.verifyCredentials(credentials)) {
        console.warn('Invalid API credentials');
        return request;
      }

      // Get request body for signature
      const body = request.body
        ? (typeof request.body === 'string' ? request.body : JSON.stringify(request.body))
        : '';

      const headers = await window.hmacSigner.buildL2Headers(
        credentials,
        address,
        method,
        path,
        body
      );

      Object.assign(request.headers, headers);

      console.log('Added L2 auth headers for:', path);
    }
  } catch (error) {
    console.error('Failed to add auth headers:', error);
    if (window.showToast) {
      window.showToast('Authentication error: ' + error.message, 'error');
    }
  }

  return request;
}

/**
 * Get auth badge configuration for a path
 * @param {string} path - Request path
 * @returns {{className: string, title: string, label: string} | null}
 */
function getAuthBadgeConfig(path) {
  if (requiresL1Auth(path)) {
    return {
      className: 'auth-badge auth-l1',
      title: 'Requires L1 Authentication (EIP-712 Wallet Signature)',
      label: 'L1 Auth'
    };
  }
  if (requiresL2Auth(path)) {
    return {
      className: 'auth-badge auth-l2',
      title: 'Requires L2 Authentication (API Key + HMAC)',
      label: 'L2 Auth'
    };
  }
  return null;
}

/**
 * Custom Swagger UI Plugin
 * Adds authentication badges to operations requiring L1/L2 auth
 */
const PolymarketAuthPlugin = function() {
  return {
    wrapComponents: {
      OperationSummary: (Original, { React }) => (props) => {
        const path = props.operationProps?.op?.get('path') || '';
        const badgeConfig = getAuthBadgeConfig(path);

        const authBadge = badgeConfig
          ? React.createElement('span', {
              className: badgeConfig.className,
              title: badgeConfig.title
            }, badgeConfig.label)
          : null;

        return React.createElement('div', { className: 'operation-summary-wrapper' }, [
          React.createElement(Original, { ...props, key: 'original' }),
          authBadge
        ]);
      }
    }
  };
};

// Export for use in Swagger UI initialization
window.PolymarketAuthPlugin = PolymarketAuthPlugin;
window.polymarketRequestInterceptor = polymarketRequestInterceptor;
