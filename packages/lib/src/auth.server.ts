import { createCookieSessionStorage, redirect } from '@remix-run/node';
import type { Session } from '@remix-run/node';
import type { SessionUser } from './index';

type AuthOptions = {
  allowedRoles?: string[];
  maxAge?: number;
};

function getCookieName(appName: string) {
  return `cn_${appName}_session`;
}

export function createAuthHelpers(appName: string, options: AuthOptions = {}) {
  const sessionSecret = process.env.SESSION_SECRET || 'dev-session-secret';
  const storage = createCookieSessionStorage({
    cookie: {
      name: getCookieName(appName),
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      secrets: [sessionSecret],
      maxAge: options.maxAge ?? 60 * 60 * 24,
    },
  });

  async function getSession(request: Request) {
    const cookie = request.headers.get('Cookie');
    return storage.getSession(cookie);
  }

  async function commitSession(session: Session) {
    return storage.commitSession(session);
  }

  async function destroySession(session: Session) {
    return storage.destroySession(session);
  }

  function parseUser(rawUser: unknown): SessionUser | null {
    if (!rawUser || typeof rawUser !== 'object') return null;
    const user = rawUser as SessionUser;
    if (!user.role) return null;

    if (options.allowedRoles?.length && !options.allowedRoles.includes(user.role)) {
      return null;
    }

    return user;
  }

  async function getUserSession(request: Request) {
    const session = await getSession(request);
    const token = String(session.get('token') || '');
    const user = parseUser(session.get('user'));
    return { session, token, user };
  }

  async function requireUserSession(request: Request) {
    const { token, user } = await getUserSession(request);
    if (!token || !user) {
      throw redirect('/login');
    }
    return { token, user };
  }

  async function createUserSession(
    request: Request,
    token: string,
    user: SessionUser,
    redirectTo = '/',
  ) {
    const session = await getSession(request);
    session.set('token', token);
    session.set('user', user);

    return redirect(redirectTo, {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  async function logout(request: Request) {
    const session = await getSession(request);
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }

  return {
    getSession,
    commitSession,
    destroySession,
    createUserSession,
    getUserSession,
    requireUserSession,
    logout,
  };
}
