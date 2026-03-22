export interface SessionUser {
  id?: string;
  email?: string;
  name?: string;
  role: string;
  tenantId?: string;
  companyId?: string;
  [key: string]: unknown;
}

const API_ROOT = (process.env.API_URL || 'http://localhost:4000').replace(/\/$/, '');

function withQuery(path: string, query?: string) {
  if (!query) return path;
  return `${path}${query.startsWith('?') ? query : `?${query}`}`;
}

async function request(method: string, path: string, token: string, body?: unknown) {
  const response = await fetch(`${API_ROOT}/api/v1${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const payload = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    const message = (payload as any)?.error?.message || (payload as any)?.message || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return (payload as any)?.data ? payload : { data: payload };
}

function resource(basePath: string) {
  return {
    list(token: string, query?: string) {
      return request('GET', withQuery(basePath, query), token);
    },
    getById(token: string, id: string) {
      return request('GET', `${basePath}/${id}`, token);
    },
    create(token: string, data: unknown) {
      return request('POST', basePath, token, data);
    },
    update(token: string, id: string, data: unknown) {
      return request('PATCH', `${basePath}/${id}`, token, data);
    },
  };
}

export const api = {
  companies: resource('/companies'),
  drives: resource('/drives'),
  applications: {
    ...resource('/applications'),
    updateStage(token: string, id: string, stage: string) {
      return request('PATCH', `/applications/${id}/stage`, token, { stage });
    },
  },
  interviews: {
    ...resource('/interviews'),
    getRoomDetails(token: string, roomId: string) {
      return request('GET', `/interviews/room/${roomId}`, token);
    },
    join(token: string, interviewId: string) {
      return request('POST', `/interviews/${interviewId}/join`, token);
    },
    extend(token: string, interviewId: string, minutes: number) {
      return request('POST', `/interviews/${interviewId}/extend`, token, { minutes });
    },
  },
  students: {
    getDirectoryProfile(token: string, studentId: string) {
      return request('GET', `/students/${studentId}/directory-profile`, token);
    },
  },
  tenants: resource('/tenants'),
};

export function withBasePath(path: string) {
  const basePath = (process.env.APP_BASE_PATH || '/').replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return basePath && basePath !== '/' ? `${basePath}${normalizedPath}` : normalizedPath;
}
