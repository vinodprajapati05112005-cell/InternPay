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

export const formatCurrency = (value, currency = 'USD', minimumFractionDigits = 0) => {
  const numericValue = Number(value ?? 0);
  const safeCurrency = currency || 'USD';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
      minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits,
    }).format(numericValue);
  } catch {
    return `$${numericValue.toLocaleString('en-US', {
      minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits,
    })}`;
  }
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
