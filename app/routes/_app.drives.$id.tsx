import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

export async function loader({ params }: LoaderFunctionArgs) {
    return redirect(`/view-drives/${params.id}`);
}

export default function DriveRedirect() {
    return null;
}
