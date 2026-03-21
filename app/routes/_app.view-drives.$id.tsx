import { ArrowLeft, Briefcase, Building2, Calendar, MapPin, Users } from 'lucide-react';
import { Badge, Card } from '@careernest/ui';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { requireUserSession } from '~/auth.server';
import { api } from '@careernest/lib';

export const meta: MetaFunction<typeof loader> = ({ data }) => [
    { title: `${(data as any)?.drive?.title || 'Drive'} – CareerNest` },
];

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { token, user } = await requireUserSession(request);
    if (user.role !== 'company') throw redirect('/login');

    const id = params.id!;
    let drive: any = null;

    try {
        const res = await api.drives.getById(token, id) as any;
        drive = res.data || res;
    } catch {
        throw redirect('/drives');
    }

    return json({ drive });
}

function formatDate(d?: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ViewDrive() {
    const { drive } = useLoaderData<typeof loader>() as { drive: any };

    if (!drive) return null;

    return (
        <div className="mx-auto max-w-3xl space-y-4 animate-fade-in pb-12">
            <Link to="/drives" className="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-700 transition-colors">
                <ArrowLeft size={16} /> Back to Drives
            </Link>

            <Card className="border border-surface-200 !p-6 space-y-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
                        <Briefcase size={22} />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-surface-900">{drive.title || '—'}</h1>
                        {drive.status && (
                            <Badge variant={drive.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-100 text-surface-600'} className="mt-1">
                                {drive.status}
                            </Badge>
                        )}
                    </div>
                </div>

                <hr className="border-surface-100" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                    {drive.location && (
                        <div className="flex items-center gap-2 text-surface-600">
                            <MapPin size={14} className="text-surface-400" />
                            {drive.location}
                        </div>
                    )}
                    {drive.applicationDeadline && (
                        <div className="flex items-center gap-2 text-surface-600">
                            <Calendar size={14} className="text-surface-400" />
                            Deadline: {formatDate(drive.applicationDeadline)}
                        </div>
                    )}
                    {drive.package && (
                        <div className="flex items-center gap-2 text-surface-600">
                            <Building2 size={14} className="text-surface-400" />
                            Package: {drive.package}
                        </div>
                    )}
                    {drive.openings != null && (
                        <div className="flex items-center gap-2 text-surface-600">
                            <Users size={14} className="text-surface-400" />
                            Openings: {drive.openings}
                        </div>
                    )}
                </div>

                {drive.description && (
                    <div>
                        <h2 className="text-sm font-semibold text-surface-700 mb-2">Description</h2>
                        <p className="text-sm text-surface-600 leading-7 whitespace-pre-wrap">{drive.description}</p>
                    </div>
                )}

                {drive.eligibility && (
                    <div>
                        <h2 className="text-sm font-semibold text-surface-700 mb-2">Eligibility</h2>
                        <p className="text-sm text-surface-600 leading-7 whitespace-pre-wrap">{drive.eligibility}</p>
                    </div>
                )}

                {drive.requirements && (
                    <div>
                        <h2 className="text-sm font-semibold text-surface-700 mb-2">Requirements</h2>
                        <p className="text-sm text-surface-600 leading-7 whitespace-pre-wrap">{drive.requirements}</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
