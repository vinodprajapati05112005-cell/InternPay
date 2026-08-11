export const ROLE_PATHS = {
  COMPANY: '/company/dashboard',
  STUDENT: '/student/dashboard',
  JUDGE: '/judge/dashboard',
};

export const getDashboardPath = (role) => {
  if (!role) {
    return '/';
  }

  return ROLE_PATHS[String(role).toUpperCase()] || '/';
};

export const getRoleFromPath = (pathname = '') => {
  if (pathname.startsWith('/company')) return 'COMPANY';
  if (pathname.startsWith('/student')) return 'STUDENT';
  if (pathname.startsWith('/judge')) return 'JUDGE';
  return '';
};

export const getRoleLabel = (role) => {
  switch (String(role || '').toUpperCase()) {
    case 'COMPANY':
      return 'Company';
    case 'STUDENT':
      return 'Student';
    case 'JUDGE':
      return 'Judge';
    case 'ADMIN':
      return 'Admin';
    default:
      return 'Guest';
  }
};

export const getUserDisplayName = (user) => {
  if (!user) {
    return 'Demo User';
  }

  const profile = user.profile || {};
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();

  if (user.role === 'COMPANY') {
    return (
      user.company_name ||
      profile.company_name ||
      fullName ||
      user.email ||
      'Company'
    );
  }

  if (user.role === 'STUDENT') {
    return (
      user.first_name ||
      profile.first_name ||
      fullName ||
      user.email ||
      'Student'
    );
  }

  if (user.role === 'JUDGE') {
    return (
      user.judge_display_name ||
      profile.judge_display_name ||
      fullName ||
      user.email ||
      'Judge'
    );
  }

  return fullName || user.email || 'User';
};

export const getUserInitial = (user) => {
  const name = getUserDisplayName(user);
  return name ? name.charAt(0).toUpperCase() : 'U';
};
