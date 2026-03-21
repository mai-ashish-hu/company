import { Form, useActionData, useNavigation } from '@remix-run/react';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { getUserSession, createUserSession } from '~/auth.server';
import { Button, Input } from '@careernest/ui';
import { Mail, Lock } from 'lucide-react';

export const meta: MetaFunction = () => [{ title: 'Login - Company Portal - CareerNest' }];

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await getUserSession(request);
  if (user) return redirect('/dashboard');
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  if (!email || !password) return json({ error: 'Email and password are required' }, { status: 400 });
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:4000';
    const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) return json({ error: data?.error?.message || 'Invalid credentials' }, { status: 401 });

    const user = data.data.user;

    // Only company role can access the Company Portal
    if (user.role !== 'company') {
      return json({ error: 'Access denied. Only company accounts can access the Company Portal.' }, { status: 403 });
    }

    return createUserSession(request, data.data.token || 'session-token', user, '/dashboard');
  } catch {
    return json({ error: 'Unable to connect to server.' }, { status: 500 });
  }
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo-full.png" alt="CareerNest" className="mx-auto h-40 w-auto mb-2" />
          <p className="text-surface-500 mt-1 text-sm">Company Portal</p>
        </div>
        <div className="rounded-lg border border-surface-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-surface-900 mb-6">Sign in to your account</h2>
          {actionData?.error && <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{actionData.error}</div>}
          <Form method="post" className="space-y-5">
            <Input name="email" type="email" label="Email Address" placeholder="hr@company.com" icon={<Mail size={18} />} required />
            <Input name="password" type="password" label="Password" placeholder="••••••••" icon={<Lock size={18} />} required />
            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign In'}</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
