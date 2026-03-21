import { ArrowLeft, Briefcase, Calendar, Mail, Phone, User } from 'lucide-react';
import { Card } from '@careernest/ui';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { requireUserSession } from '~/auth.server';
import { api, withBasePath } from '@careernest/lib';

export const meta: MetaFunction = () => [{ title: 'Applicant – CareerNest' }];

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

    const id = params.id!;
    let application: any = null;
    let student: any = null;

    try {
        const res = await api.applications.getById(token, id) as any;
        application = res.data || res;
    } catch {
        throw redirect(withBasePath('/drives'));
    }

    if (application?.studentId) {
        try {
            const res = await api.students.getDirectoryProfile(token, application.studentId) as any;
            student = (res.data || res)?.summary || res.data || res;
        } catch { /* optional */ }
    }

    return json({ application, student });
}

function formatDate(d?: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ApplicantDetail() {
    const { application, student } = useLoaderData<typeof loader>() as { application: any; student: any };

    return (
        <div className="mx-auto max-w-2xl space-y-4 animate-fade-in pb-12">
            <Link to="/drives" className="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-700 transition-colors">
                <ArrowLeft size={16} /> Back to Drives
            </Link>

            <Card className="border border-surface-200 !p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-surface-100 text-surface-600">
                        <User size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-surface-900">{student?.name || 'Applicant'}</h1>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STAGE_COLOR[application?.stage] || 'bg-surface-100 text-surface-600'}`}>
                            {stageLabel(application?.stage || '')}
                        </span>
                    </div>
                </div>

                <hr className="border-surface-100" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-surface-600">
                    {student?.email && (
                        <div className="flex items-center gap-2"><Mail size={13} className="text-surface-400" />{student.email}</div>
                    )}
                    {student?.phone && (
                        <div className="flex items-center gap-2"><Phone size={13} className="text-surface-400" />{student.phone}</div>
                    )}
                    {application?.$createdAt && (
                        <div className="flex items-center gap-2"><Calendar size={13} className="text-surface-400" />Applied: {formatDate(application.$createdAt)}</div>
                    )}
                    {application?.driveTitle && (
                        <div className="flex items-center gap-2"><Briefcase size={13} className="text-surface-400" />{application.driveTitle}</div>
                    )}
                </div>

                {student?.headline && (
                    <p className="text-sm text-surface-600 italic">"{student.headline}"</p>
                )}
                {student?.skills?.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                            {student.skills.slice(0, 10).map((s: string) => (
                                <span key={s} className="px-2 py-0.5 bg-surface-100 text-surface-600 rounded text-xs">{s}</span>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
