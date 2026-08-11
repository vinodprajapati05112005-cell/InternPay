const WALLET_SESSION_KEY = 'internpay_wallet_session';
const DEFAULT_EXPECTED_CHAIN_ID = '0x66eee';

const NETWORK_NAMES = {
  '0x1': 'Ethereum Mainnet',
  '0x5': 'Goerli Testnet',
  '0xaa36a7': 'Sepolia Testnet',
  '0x38': 'BNB Smart Chain',
  '0x89': 'Polygon Mainnet',
  '0xa4b1': 'Arbitrum One',
  '0x66eee': 'Arbitrum Sepolia',
  '0x2105': 'Base Mainnet',
};

export const normalizeChainId = (chainId) => {
  const value = String(chainId || '').trim().toLowerCase();
  if (!value) {
    return '';
  }

  if (value.startsWith('0x')) {
    return value;
  }

  if (/^\d+$/.test(value)) {
    return `0x${Number(value).toString(16)}`;
  }

  return value;
};

export const getExpectedChainId = () => normalizeChainId(import.meta.env.VITE_CHAIN_ID || DEFAULT_EXPECTED_CHAIN_ID);

export const getExpectedChainLabel = () => NETWORK_NAMES[getExpectedChainId()] || 'Arbitrum Sepolia';

export const isWrongNetwork = (chainId) => {
  const expected = getExpectedChainId();
  if (!expected) {
    return false;
  }

  return normalizeChainId(chainId) !== expected;
};

export const getStoredWalletSession = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(WALLET_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredWalletSession = (session) => {
  if (typeof window === 'undefined') {
    return session;
  }

  window.localStorage.setItem(WALLET_SESSION_KEY, JSON.stringify(session));
  return session;
};

export const clearStoredWalletSession = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(WALLET_SESSION_KEY);
};

export const shortenWalletAddress = (address, prefixLength = 6, suffixLength = 4) => {
  const value = String(address || '').trim();
  if (!value) {
    return '';
  }

  if (value.length <= prefixLength + suffixLength + 3) {
    return value;
  }

  return `${value.slice(0, prefixLength)}...${value.slice(-suffixLength)}`;
};

export const getChainLabel = (chainId) => {
  const normalized = normalizeChainId(chainId);
  if (!normalized) {
    return 'Unknown network';
  }

  return NETWORK_NAMES[normalized] || `Chain ${normalized}`;
};

export const formatWeiToEth = (weiValue, precision = 4) => {
  try {
    const wei = typeof weiValue === 'bigint' ? weiValue : BigInt(String(weiValue || '0'));
    const sign = wei < 0n ? '-' : '';
    const absolute = wei < 0n ? -wei : wei;
    const whole = absolute / 10n ** 18n;
    const remainder = absolute % 10n ** 18n;

    if (precision <= 0) {
      return `${sign}${whole.toString()} ETH`;
    }

    const fraction = remainder
      .toString()
      .padStart(18, '0')
      .slice(0, precision)
      .replace(/0+$/, '');

    return fraction ? `${sign}${whole.toString()}.${fraction} ETH` : `${sign}${whole.toString()} ETH`;
  } catch {
    return '0 ETH';
  }
};
