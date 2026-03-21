import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

async function proxy(request: Request, params: Record<string, string | undefined>) {
    const splat = params['*'] ?? '';
    const url = new URL(request.url);
    const target = `${API_URL}/api/${splat}${url.search}`;

    const proxyHeaders = new Headers(request.headers);
    proxyHeaders.delete('host');
    proxyHeaders.delete('connection');

    const init: RequestInit = {
        method: request.method,
        headers: proxyHeaders,
        redirect: 'manual',
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
        init.body = request.body;
        (init as any).duplex = 'half';
    }

    const upstream = await fetch(target, init);
    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete('transfer-encoding');

    return new Response(upstream.body, {
        status: upstream.status,
        headers: responseHeaders,
    });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
    return proxy(request, params);
}

export async function action({ request, params }: ActionFunctionArgs) {
    return proxy(request, params);
}
