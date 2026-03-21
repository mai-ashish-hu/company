import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { withBasePath } from '@careernest/lib';
import { getUserSession } from '~/auth.server';
export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await getUserSession(request);
  if (user) return redirect(withBasePath('/dashboard'));
  return redirect(withBasePath('/login'));
}
