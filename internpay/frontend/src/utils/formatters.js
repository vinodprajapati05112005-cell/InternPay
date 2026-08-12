export const humanizeEnum = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  return String(value)
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// Keep small ETH amounts visible without forcing fixed trailing zeros.
const DEFAULT_MAX_FRACTION_DIGITS = 6;

export const formatCurrency = (
  value,
  currency = 'USD',
  minimumFractionDigits = 0,
  maximumFractionDigits = DEFAULT_MAX_FRACTION_DIGITS,
) => {
  const symbol = currency && currency !== 'USD' ? currency : 'ETH';
  return formatTokenAmount(value, symbol, minimumFractionDigits, maximumFractionDigits);
};

export const formatTokenAmount = (
  value,
  symbol = 'ETH',
  minimumFractionDigits = 0,
  maximumFractionDigits = DEFAULT_MAX_FRACTION_DIGITS,
) => {
  const numericValue = Number(value ?? 0);
  const fractionDigits = Math.max(minimumFractionDigits, maximumFractionDigits);

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);

  return symbol ? `${formatted} ${symbol}` : formatted;
};

export const formatDate = (value, options = {}) => {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
};

export const formatDateTime = (value, options = {}) => {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...options,
  });
};

export const daysUntil = (value) => {
  if (!value) {
    return null;
  }

  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) {
    return null;
  }

  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const compactHash = (value, start = 6, end = 4) => {
  if (!value) {
    return '';
  }

  const text = String(value);
  if (text.length <= start + end + 3) {
    return text;
  }

  return `${text.slice(0, start)}...${text.slice(-end)}`;
};

export const toList = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === null || value === undefined || value === '') {
    return [];
  }

  return [value];
};
