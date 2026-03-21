import {
    ArrowLeft,
    ArrowUpRight,
    BadgeCheck,
    Briefcase,
    Building2,
    Calendar,
    ClipboardList,
    ExternalLink,
    GraduationCap,
    IndianRupee,
    Layers3,
    MapPin,
    Tag,
    Users,
} from 'lucide-react';
import { Badge, Card } from '@careernest/ui';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { requireUserSession } from '~/auth.server';
import { api, withBasePath } from '@careernest/lib';

export const meta: MetaFunction<typeof loader> = ({ data }) => [
    { title: `${(data as any)?.drive?.title || 'Drive'} – CareerNest` },
];

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { token, user } = await requireUserSession(request);
    if (user.role !== 'company') throw redirect(withBasePath('/login'));

    const id = params.id!;
    let drive: any = null;

    try {
        const res = await api.drives.getById(token, id) as any;
        drive = res.data || res;
    } catch {
        throw redirect(withBasePath('/drives'));
    }

    return json({ drive });
}

function formatDate(d?: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatSalary(salary?: number, period?: string) {
    const value = Number(salary || 0);
    if (!value) return '—';
    if (period === 'monthly') return `Rs. ${value.toLocaleString('en-IN')}/month`;
    if (value >= 100000) return `Rs. ${(value / 100000).toFixed(1)} LPA`;
    return `Rs. ${value.toLocaleString('en-IN')}`;
}

function formatLabel(value?: string) {
    if (!value) return '—';
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2.5 border-b border-surface-100 last:border-0">
            <span className="text-sm text-surface-500 shrink-0">{label}</span>
            <span className="text-sm font-medium text-surface-900 text-right">{value || '—'}</span>
        </div>
    );
}

export default function ViewDrive() {
    const { drive } = useLoaderData<typeof loader>() as { drive: any };

    if (!drive) return null;

    const departments = Array.isArray(drive.department) && drive.department.length > 0
        ? drive.department
        : [];

    const driveId = drive.$id || drive.id || '';

    return (
        <div className="mx-auto max-w-5xl space-y-5 animate-fade-in pb-12">
            <div className="flex items-center justify-between">
                <Link to="/drives" className="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-700 transition-colors">
                    <ArrowLeft size={16} /> Back to Drives
                </Link>
                {driveId && (
                    <Link
                        to={`/applicants?driveId=${driveId}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
                    >
                        <Users size={15} /> View Applicants <ArrowUpRight size={13} />
                    </Link>
                )}
            </div>

            {/* Hero card */}
            <Card className="border border-surface-200 !p-0 overflow-hidden">
                {/* Top banner */}
                <div className="h-3 bg-gradient-to-r from-primary-500 to-indigo-500" />
                <div className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-primary-50 text-primary-600 border border-primary-100">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-surface-900">{drive.title || '—'}</h1>
                                {(drive.companyName || drive.companies) && (
                                    <p className="mt-1 text-sm text-surface-500 inline-flex items-center gap-1.5">
                                        <Building2 size={13} />
                                        {drive.companyName || drive.companies?.name || drive.companies?.[0]?.name || ''}
                                    </p>
                                )}
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <Badge variant={drive.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-100 text-surface-600'}>
                                        {formatLabel(drive.status)}
                                    </Badge>
                                    {drive.jobType && (
                                        <Badge variant="bg-indigo-50 text-indigo-700">{formatLabel(drive.jobType)}</Badge>
                                    )}
                                    {drive.jobLevel && (
                                        <Badge variant="bg-amber-50 text-amber-700">{formatLabel(drive.jobLevel)}</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        {drive.externalLink && (
                            <a
                                href={drive.externalLink}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                            >
                                External Listing <ExternalLink size={15} />
                            </a>
                        )}
                    </div>

                    {/* Key metrics grid */}
                    <div className="mt-6 grid gap-3 grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-surface-200 bg-surface-50 p-4">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-surface-400 flex items-center gap-1">
                                <IndianRupee size={11} /> Compensation
                            </p>
                            <p className="mt-1.5 text-base font-semibold text-surface-900">
                                {formatSalary(drive.salary, drive.ctcPeriod)}
                            </p>
                            {drive.ctcPeriod && (
                                <p className="text-xs text-surface-400 mt-0.5">{formatLabel(drive.ctcPeriod)}</p>
                            )}
                        </div>
                        <div className="rounded-xl border border-surface-200 bg-surface-50 p-4">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-surface-400 flex items-center gap-1">
                                <Calendar size={11} /> Deadline
                            </p>
                            <p className="mt-1.5 text-base font-semibold text-surface-900">
                                {formatDate(drive.deadline || drive.applicationDeadline)}
                            </p>
                        </div>
                        <div className="rounded-xl border border-surface-200 bg-surface-50 p-4">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-surface-400 flex items-center gap-1">
                                <Users size={11} /> Vacancies
                            </p>
                            <p className="mt-1.5 text-base font-semibold text-surface-900">
                                {drive.vacancies ?? drive.openings ?? 0}
                            </p>
                        </div>
                        <div className="rounded-xl border border-surface-200 bg-surface-50 p-4">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-surface-400 flex items-center gap-1">
                                <MapPin size={11} /> Location
                            </p>
                            <p className="mt-1.5 text-base font-semibold text-surface-900 truncate">
                                {drive.location || '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid gap-5 lg:grid-cols-2">
                {/* Role Details */}
                <Card className="border border-surface-200 !p-5">
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-surface-800">
                        <Layers3 size={15} className="text-surface-500" /> Role Details
                    </h2>
                    <InfoRow label="Experience" value={formatLabel(drive.experience)} />
                    <InfoRow label="Job Type" value={formatLabel(drive.jobType)} />
                    <InfoRow label="Job Level" value={formatLabel(drive.jobLevel)} />
                    <InfoRow label="CTC Period" value={formatLabel(drive.ctcPeriod)} />
                    {drive.location && <InfoRow label="Location" value={drive.location} />}
                </Card>

                {/* Eligibility */}
                <Card className="border border-surface-200 !p-5">
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-surface-800">
                        <BadgeCheck size={15} className="text-surface-500" /> Eligibility Criteria
                    </h2>
                    <InfoRow label="Minimum CGPA" value={drive.CGPA ?? '—'} />
                    <InfoRow label="Allowed Backlogs" value={drive.Backlogs ?? '—'} />
                    <InfoRow label="Studying Year" value={drive.studyingYear || '—'} />
                    <InfoRow
                        label="Departments"
                        value={
                            departments.length > 0 ? (
                                <div className="flex flex-wrap justify-end gap-1">
                                    {departments.map((d: string) => (
                                        <span key={d} className="rounded bg-surface-100 px-1.5 py-0.5 text-xs text-surface-600">{d}</span>
                                    ))}
                                </div>
                            ) : '—'
                        }
                    />
                </Card>
            </div>

            {/* Description */}
            {drive.description && (
                <Card className="border border-surface-200 !p-5">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-surface-800 mb-3">
                        <ClipboardList size={15} className="text-surface-500" /> Job Description
                    </h2>
                    <p className="text-sm text-surface-600 leading-7 whitespace-pre-wrap">{drive.description}</p>
                </Card>
            )}

            {/* Eligibility text */}
            {drive.eligibility && (
                <Card className="border border-surface-200 !p-5">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-surface-800 mb-3">
                        <GraduationCap size={15} className="text-surface-500" /> Eligibility Details
                    </h2>
                    <p className="text-sm text-surface-600 leading-7 whitespace-pre-wrap">{drive.eligibility}</p>
                </Card>
            )}

            {/* Requirements */}
            {drive.requirements && (
                <Card className="border border-surface-200 !p-5">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-surface-800 mb-3">
                        <Tag size={15} className="text-surface-500" /> Requirements
                    </h2>
                    <p className="text-sm text-surface-600 leading-7 whitespace-pre-wrap">{drive.requirements}</p>
                </Card>
            )}

            {/* Summary footer */}
            <Card className="border border-surface-200 !p-5 bg-surface-50">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-surface-800 mb-3">
                    <GraduationCap size={15} className="text-surface-500" /> Hiring Summary
                </h2>
                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm text-surface-700">
                        <Users size={13} className="text-surface-400" /> {drive.vacancies ?? drive.openings ?? 0} vacancies
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm text-surface-700">
                        <MapPin size={13} className="text-surface-400" /> {drive.location || '—'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm text-surface-700">
                        <Calendar size={13} className="text-surface-400" /> Deadline: {formatDate(drive.deadline || drive.applicationDeadline)}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${drive.status === 'open' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-surface-200 bg-white text-surface-600'}`}>
                        {formatLabel(drive.status)}
                    </span>
                </div>
            </Card>
        </div>
    );
}
