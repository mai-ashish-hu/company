import { ArrowLeft, Search, Users } from 'lucide-react';
import { Badge, Card, EmptyState } from '@careernest/ui';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { useState } from 'react';
import { requireUserSession } from '~/auth.server';
import { api, withBasePath } from '@careernest/lib';

export const meta: MetaFunction = () => [{ title: 'Applicants – CareerNest' }];

const STAGE_COLOR: Record<string, string> = {
    applied: 'bg-blue-50 text-blue-700',
    under_review: 'bg-yellow-50 text-yellow-700',
    shortlisted: 'bg-purple-50 text-purple-700',
    interview_scheduled: 'bg-indigo-50 text-indigo-700',
    selected: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-rose-50 text-rose-700',
};

function stageLabel(s: string) {
    return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { token, user } = await requireUserSession(request);
    if (user.role !== 'company') throw redirect(withBasePath('/login'));

    const driveId = params.id!;
    let drive: any = null;
    let applications: any[] = [];

    try {
        const res = await api.drives.getById(token, driveId) as any;
        drive = res.data || res;
    } catch {
        throw redirect(withBasePath('/drives'));
    }

    try {
        const res = await api.applications.list(token, `driveId=${driveId}&limit=500`) as any;
        applications = res.data || [];
    } catch { /* optional */ }

    return json({ drive, applications });
}

export default function DriveApplicants() {
    const { drive, applications } = useLoaderData<typeof loader>() as { drive: any; applications: any[] };
    const [search, setSearch] = useState('');

    const filtered = applications.filter(a =>
        !search ||
        (a.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.studentEmail || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4 animate-fade-in">
            <Link to="/drives" className="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-700 transition-colors">
                <ArrowLeft size={16} /> Back to Drives
            </Link>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-surface-900">{drive?.title || 'Drive'}</h1>
                    <p className="text-sm text-surface-500">{applications.length} applicant{applications.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            <Card className="border border-surface-200 !p-3">
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input type="text" placeholder="Search by name or email..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400" />
                </div>
            </Card>

            {filtered.length === 0 ? (
                <Card className="border border-surface-200">
                    <EmptyState icon={<Users size={24} />} title="No applicants yet" description="Applications will appear here once students apply." />
                </Card>
            ) : (
                <div className="space-y-2">
                    {filtered.map((app: any) => (
                        <Link key={app.$id || app.id} to={`/applicants/${app.$id || app.id}`}>
                            <Card hover className="border border-surface-200 !p-4 flex items-center justify-between gap-4 hover:border-surface-300 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-surface-900 truncate">{app.studentName || app.studentId || 'Student'}</p>
                                    {app.studentEmail && <p className="text-sm text-surface-500 truncate">{app.studentEmail}</p>}
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STAGE_COLOR[app.stage] || 'bg-surface-100 text-surface-600'}`}>
                                    {stageLabel(app.stage || 'applied')}
                                </span>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
