import { createAuthHelpers } from '@careernest/lib/auth.server';

export const { getSession, commitSession, destroySession, createUserSession, getUserSession, requireUserSession, logout } = createAuthHelpers('company', {
	allowedRoles: ['company'],
	maxAge: 60 * 60 * 24, // 24 hours — matches JWT expiry
});
