import {
    ArrowUpRight,
    Briefcase,
    Calendar,
    CheckCircle2,
    ChevronDown,
    GraduationCap,
    Mail,
    Phone,
    Search,
    Users,
    X,
    XCircle,
    Eye,
    EyeOff,
} from 'lucide-react';
import { Card, EmptyState } from '@careernest/ui';
import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link, useNavigate, useFetcher, useRevalidator } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { api } from '@careernest/lib';
import { requireCompanyContext, loadCompanyDrives } from '~/utils/company.server';
import { InlineCertificateViewer } from '~/components/InlineCertificateViewer';

export const meta: MetaFunction = () => [{ title: 'Applicants – CareerNest' }];

const STAGE_CONFIG: Record<string, { label: string; badge: string }> = {
    applied:             { label: 'Applied',             badge: 'bg-blue-50 text-blue-700' },
    under_review:        { label: 'Under Review',        badge: 'bg-yellow-50 text-yellow-700' },
    shortlisted:         { label: 'Shortlisted',         badge: 'bg-purple-50 text-purple-700' },
    interview_scheduled: { label: 'Interview Scheduled', badge: 'bg-indigo-50 text-indigo-700' },
    selected:            { label: 'Selected',            badge: 'bg-emerald-50 text-emerald-700' },
    rejected:            { label: 'Rejected',            badge: 'bg-rose-50 text-rose-700' },
};
const ALL_STAGES = Object.keys(STAGE_CONFIG);
const STAGE_TRANSITIONS: Record<string, string[]> = {
    applied: ['under_review', 'rejected'],
    under_review: ['shortlisted', 'rejected'],
    shortlisted: ['interview_scheduled', 'rejected'],
    interview_scheduled: ['selected', 'rejected'],
    selected: [],
    rejected: [],
};
const IST_TIME_ZONE = 'Asia/Kolkata';

function parseDateTimeLocalAsISTToISO(value: string) {
    const normalized = value?.trim();
    if (!normalized) throw new Error('scheduledAt is required');
    const withOffset = normalized.length === 16
        ? `${normalized}:00+05:30`
        : `${normalized}+05:30`;
    const parsed = new Date(withOffset);
    if (Number.isNaN(parsed.getTime())) throw new Error('Invalid scheduledAt value');
    return parsed.toISOString();
}

function toDateTimeLocalInIST(date: Date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: IST_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).formatToParts(date);
    const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value || '00';
    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

function sl(s: string) {
    return STAGE_CONFIG[s]?.label || s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function fmtDate(d?: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function initials(name: string) {
    return (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
function formatAcademicYear(y: unknown) {
    const n = Number(y);
    if (!Number.isFinite(n) || n <= 0) return '—';
    if (n === 1) return '1st';
    if (n === 2) return '2nd';
    if (n === 3) return '3rd';
    return `${n}th`;
}
function val(v: unknown) {
    if (v === null || v === undefined || v === '') return '—';
    if (Array.isArray(v)) return v.length ? v.join(', ') : '—';
    return String(v);
}

function CertificatePreviewToggle({ url, title }: { url?: string; title: string }) {
    if (!url) return <p><span className="text-surface-400">Certificate URL:</span> <span className="text-surface-700">—</span></p>;
    return (
        <div>
            <p><span className="text-surface-400">Certificate URL:</span> <span className="text-surface-700 break-all">{url}</span></p>
            <InlineCertificateViewer url={url} title={title} className="mt-1" />
        </div>
    );
}

// ── Loader ──────────────────────────────────────────────────────────────────
export async function loader({ request }: LoaderFunctionArgs) {
    const { token, user, company } = await requireCompanyContext(request);
    const url = new URL(request.url);
    const driveId = url.searchParams.get('driveId') || '';
    const stage = url.searchParams.get('stage') || '';

    const drives = await loadCompanyDrives(token, user, company);
    let allApplications: any[] = [];
    let drive: any = null;

    if (driveId) {
        try { const dr = await api.drives.getById(token, driveId) as any; drive = dr.data || dr; } catch { /**/ }
        try {
            const res = await api.applications.list(token, `driveId=${driveId}&limit=500`) as any;
            allApplications = res.data || [];
        } catch { /**/ }
    } else {
        const all = await Promise.all(drives.map(async d => {
            try {
                const res = await api.applications.list(token, `driveId=${d.id}&limit=500`) as any;
                return (res.data || []).map((a: any) => ({ ...a, driveTitle: a.driveTitle || d.title }));
            } catch { return []; }
        }));
        allApplications = all.flat();
    }

    const stageCounts: Record<string, number> = {};
    ALL_STAGES.forEach(s => { stageCounts[s] = 0; });
    allApplications.forEach(a => { if (stageCounts[a.stage] !== undefined) stageCounts[a.stage]++; });

    const applications = stage
        ? allApplications.filter((a) => a.stage === stage)
        : allApplications;

    return json({ drives, applications, drive, driveId, stage, stageCounts, totalApplicants: allApplications.length });
}

// ── Action — fetch details or update stage ───────────────────────────────────
export async function action({ request }: ActionFunctionArgs) {
    const { token, company } = await requireCompanyContext(request);
    const form = await request.formData();
    const intent = String(form.get('intent') || 'fetchDetails');

    if (intent === 'updateStage') {
        const appId = String(form.get('appId') || '');
        const newStage = String(form.get('stage') || '');
        if (!appId || !newStage) return json({ error: 'Missing fields' }, { status: 400 });
        try {
            await api.applications.updateStage(token, appId, newStage);
            return json({ ok: true, appId, stage: newStage });
        } catch {
            return json({ error: 'Failed to update stage' }, { status: 500 });
        }
    }

    if (intent === 'scheduleInterview') {
        const appId = String(form.get('appId') || '');
        const mode = String(form.get('mode') || 'careernest');
        const scheduledAt = String(form.get('scheduledAt') || '');
        const durationMinutes = Number(form.get('durationMinutes') || 60);
        const interviewerName = String(form.get('interviewerName') || '');
        const interviewerEmail = String(form.get('interviewerEmail') || '');
        const notes = String(form.get('notes') || '');
        const externalLink = String(form.get('externalLink') || '');

        if (!appId || !scheduledAt) return json({ error: 'Missing required fields' }, { status: 400 });
        if (mode === 'external' && !externalLink) return json({ error: 'External meeting link is required' }, { status: 400 });

        try {
            const payload: any = {
                applicationId: appId,
                scheduledAt: parseDateTimeLocalAsISTToISO(scheduledAt),
                durationMinutes,
                interviewerName,
                interviewerEmail,
                notes,
            };

            if (mode === 'careernest') {
                payload.interviewType = 'careernest';
            } else {
                payload.interviewType = 'external';
                payload.format = 'video_call';
                payload.meetingLink = externalLink;
            }

            await api.interviews.create(token, payload);
            return json({ ok: true });
        } catch (err: any) {
            return json({ error: err?.message || 'Failed to schedule interview' }, { status: 500 });
        }
    }

    // Default: fetch single application details
    const appId = String(form.get('appId') || '');
    let application: any = null;
    let student: any = null;
    let driveName = '—';
    let collegeName = '—';

    try {
        const res = await api.applications.getById(token, appId) as any;
        application = res.data || res;
    } catch { return json({ error: 'Application not found' }, { status: 404 }); }

    // Company role cannot access students directory profile endpoint.

    if (application?.driveId) {
        try {
            const dr = await api.drives.getById(token, application.driveId) as any;
            const drive = dr.data || dr;
            driveName = drive?.title || '—';
            if (!collegeName || collegeName === '—') {
                const colleges = drive?.colleges;
                collegeName = Array.isArray(colleges)
                    ? (colleges[0]?.name || collegeName)
                    : (colleges?.name || collegeName);
            }
        } catch { /**/ }
    }

    if ((!collegeName || collegeName === '—') && application?.tenantId) {
        try {
            const tr = await api.tenants.getById(token, application.tenantId) as any;
            const tenant = tr.data || tr;
            collegeName = tenant?.name || collegeName;
        } catch { /**/ }
    }

    collegeName = company.collegeName || '—';

    return json({ application, student, driveName, collegeName });
}

function InterviewSchedulerModal({
    app,
    onClose,
    onScheduled,
}: {
    app: any;
    onClose: () => void;
    onScheduled: () => void;
}) {
    const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
    const [mode, setMode] = useState<'careernest' | 'external'>('careernest');

    useEffect(() => {
        if (fetcher.data?.ok) {
            onScheduled();
            onClose();
        }
    }, [fetcher.data]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
                    <h2 className="text-sm font-semibold text-surface-900">Schedule Interview</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700">
                        <X size={16} />
                    </button>
                </div>

                <fetcher.Form method="post" className="p-5 space-y-3">
                    <input type="hidden" name="intent" value="scheduleInterview" />
                    <input type="hidden" name="appId" value={app.$id || app.id} />

                    <div className="text-xs text-surface-600 rounded-lg bg-surface-50 p-2.5">
                        <p className="font-medium text-surface-800">{app.studentName || 'Candidate'}</p>
                        <p className="text-surface-500">{app.studentEmail || '—'}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-surface-700 mb-1">Interview Type</label>
                        <select
                            name="mode"
                            value={mode}
                            onChange={(e) => setMode(e.target.value as 'careernest' | 'external')}
                            className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm"
                        >
                            <option value="careernest">Schedule on CareerNest platform</option>
                            <option value="external">Google Meet / Zoom / Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-surface-700 mb-1">Date & Time (IST)</label>
                        <input name="scheduledAt" type="datetime-local" required min={toDateTimeLocalInIST()} className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm" />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-surface-700 mb-1">Duration</label>
                        <select name="durationMinutes" defaultValue="60" className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm">
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                        </select>
                    </div>

                    {mode === 'external' && (
                        <div>
                            <label className="block text-xs font-medium text-surface-700 mb-1">Meeting Link</label>
                            <input name="externalLink" type="url" required placeholder="https://meet.google.com/... or https://zoom.us/..." className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm" />
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input name="interviewerName" type="text" placeholder="Interviewer name" className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm" />
                        <input name="interviewerEmail" type="email" placeholder="Interviewer email" className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm" />
                    </div>

                    <textarea name="notes" rows={2} placeholder="Notes for candidate (optional)" className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm resize-none" />

                    {fetcher.data?.error && <p className="text-xs text-rose-600">{fetcher.data.error}</p>}

                    <div className="flex gap-2 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 px-3 py-2 border border-surface-200 rounded-lg text-sm font-medium text-surface-700">Cancel</button>
                        <button type="submit" className="flex-1 px-3 py-2 bg-primary-600 rounded-lg text-sm font-medium text-white hover:bg-primary-700">Schedule Interview</button>
                    </div>
                </fetcher.Form>
            </div>
        </div>
    );
}

// ── Applicant detail modal ────────────────────────────────────────────────────
function ApplicantModal({ app, onClose }: { app: any; onClose: () => void }) {
    const fetcher = useFetcher<{ application: any; student: any; driveName?: string; collegeName?: string; error?: string }>();

    useEffect(() => {
        const appId = app.$id || app.id;
        fetcher.submit({ intent: 'fetchDetails', appId }, { method: 'post' });
    }, []);

    const application = fetcher.data?.application ?? app;
    const student = fetcher.data?.student;
    const loading = fetcher.state !== 'idle';
    const name = student?.name || app.studentName || 'Student';
    const parsedSkills = Array.isArray(application?.skills)
        ? application.skills
        : typeof application?.skills === 'string'
            ? application.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [];
    const projects = Array.isArray(application?.projects) ? application.projects : [];
    const achievements = Array.isArray(application?.achievements) ? application.achievements : [];
    const experiences = Array.isArray(application?.experiences) ? application.experiences : [];
    const driveName = fetcher.data?.driveName || app?.driveTitle || '—';
    const collegeName = fetcher.data?.collegeName || student?.collegeName || student?.college || '—';
    const departmentName = student?.departmentName || student?.department || app?.studentDepartment || application?.branch || app?.branch || '—';
    const basicFields = [
        ['College Name', collegeName],
        ['Drive Name', driveName],
        ['Student ID', application?.studentId],
        ['Department', departmentName],
        ['Stage', sl(application?.stage || 'applied')],
        ['Applied At', fmtDate(application?.appliedAt || application?.$createdAt || application?.createdAt)],
        ['Updated At', fmtDate(application?.$updatedAt || application?.updatedAt)],
        ['Phone Number', application?.phoneNumber],
        ['Current City', application?.currentCity],
        ['Degree', application?.degree],
        ['Branch', application?.branch],
        ['Academic Year', formatAcademicYear(application?.academicYear)],
        ['Graduation Year', application?.graduationYear],
        ['CGPA', application?.cgpa],
        ['Has Backlogs', application?.hasBacklogs === true ? 'Yes' : application?.hasBacklogs === false ? 'No' : '—'],
        ['Backlog Count', application?.backlogCount],
        ['Skills', parsedSkills],
        ['Resume URL', application?.resumeFileId],
        ['Agreed To Terms', application?.agreedToTerms === true ? 'Yes' : application?.agreedToTerms === false ? 'No' : '—'],
        ['Cover Letter', application?.coverLetter],
    ] as const;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
                    <h2 className="text-sm font-semibold text-surface-900">Application Details</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
                    {loading ? (
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="h-12 w-12 rounded-full bg-surface-100 animate-pulse shrink-0" />
                                <div className="flex-1 space-y-2 pt-1">
                                    <div className="h-4 bg-surface-100 rounded animate-pulse w-3/4" />
                                    <div className="h-3 bg-surface-100 rounded animate-pulse w-1/2" />
                                </div>
                            </div>
                            {[80, 65, 50].map(w => (
                                <div key={w} className="h-3.5 bg-surface-100 rounded animate-pulse" style={{ width: `${w}%` }} />
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Profile card */}
                            <div className="rounded-xl border border-surface-200 overflow-hidden">
                                <div className="h-14 bg-gradient-to-br from-primary-100 to-indigo-100" />
                                <div className="px-4 pb-4">
                                    <div className="-mt-6 flex items-end gap-3">
                                        <div className="h-12 w-12 flex items-center justify-center rounded-full border-2 border-white bg-primary-600 text-white text-sm font-bold shadow shrink-0">
                                            {initials(name)}
                                        </div>
                                        <div className="pb-1 flex-1 min-w-0">
                                            <p className="font-bold text-surface-900 truncate">{name}</p>
                                            {student?.headline && <p className="text-xs text-surface-500 truncate">{student.headline}</p>}
                                        </div>
                                        <span className={`shrink-0 mb-1 text-xs font-medium px-2.5 py-1 rounded-full ${STAGE_CONFIG[application?.stage]?.badge || 'bg-surface-100 text-surface-600'}`}>
                                            {sl(application?.stage || 'applied')}
                                        </span>
                                    </div>

                                    <div className="mt-3 space-y-1.5 text-xs text-surface-600">
                                        {(student?.email || app.studentEmail) && (
                                            <div className="flex items-center gap-2">
                                                <Mail size={12} className="text-surface-400 shrink-0" />
                                                <span className="truncate">{student?.email || app.studentEmail}</span>
                                            </div>
                                        )}
                                        {(student?.phone || student?.phoneNumber) && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={12} className="text-surface-400 shrink-0" />
                                                {student.phone || student.phoneNumber}
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                            {departmentName !== '—' && (
                                                <span className="flex items-center gap-1"><GraduationCap size={11} className="text-surface-400" />{departmentName}</span>
                                            )}
                                            {student?.cgpa != null && (
                                                <span className="font-medium text-surface-700">CGPA {student.cgpa}</span>
                                            )}
                                            {(student?.studentId || application?.studentId) && (
                                                <span className="text-surface-400">ID: {student?.studentId || application?.studentId}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* All submitted fields */}
                            <div className="rounded-xl border border-surface-200 p-3">
                                <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2">All Application Fields</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {basicFields.map(([label, value]) => (
                                        <p key={label}>
                                            <span className="text-surface-400">{label}:</span>{' '}
                                            <span className="text-surface-700 whitespace-pre-wrap">{val(value)}</span>
                                        </p>
                                    ))}
                                </div>
                                {application?.resumeFileId && application.resumeFileId !== '—' && (
                                    <a
                                        href={application.resumeFileId}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700"
                                    >
                                        View Resume <ArrowUpRight size={12} />
                                    </a>
                                )}
                            </div>

                            {/* Projects */}
                            <div>
                                <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2">Projects</p>
                                {projects.length === 0 ? (
                                    <p className="text-xs text-surface-500">—</p>
                                ) : (
                                    <div className="space-y-2">
                                        {projects.map((p: any, i: number) => (
                                            <div key={p.$id || i} className="rounded-lg border border-surface-200 p-2.5 text-xs">
                                                <p><span className="text-surface-400">Title:</span> <span className="text-surface-800">{val(p.title)}</span></p>
                                                <p><span className="text-surface-400">Description:</span> <span className="text-surface-700">{val(p.description)}</span></p>
                                                <p><span className="text-surface-400">Technologies:</span> <span className="text-surface-700">{val(p.technologies)}</span></p>
                                                <p><span className="text-surface-400">Project Link:</span> <span className="text-surface-700">{val(p.projectLink)}</span></p>
                                                <CertificatePreviewToggle url={p.certificateUrl} title={`${p.title || 'Project'} certificate`} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Achievements */}
                            <div>
                                <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2">Achievements</p>
                                {achievements.length === 0 ? (
                                    <p className="text-xs text-surface-500">—</p>
                                ) : (
                                    <div className="space-y-2">
                                        {achievements.map((a: any, i: number) => (
                                            <div key={a.$id || i} className="rounded-lg border border-surface-200 p-2.5 text-xs">
                                                <p><span className="text-surface-400">Title:</span> <span className="text-surface-800">{val(a.title)}</span></p>
                                                <p><span className="text-surface-400">Description:</span> <span className="text-surface-700">{val(a.description)}</span></p>
                                                <p><span className="text-surface-400">Date:</span> <span className="text-surface-700">{a.date ? fmtDate(a.date) : '—'}</span></p>
                                                <CertificatePreviewToggle url={a.certificateUrl} title={`${a.title || 'Achievement'} certificate`} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Experience */}
                            <div>
                                <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2">Experience</p>
                                {experiences.length === 0 ? (
                                    <p className="text-xs text-surface-500">—</p>
                                ) : (
                                    <div className="space-y-2">
                                        {experiences.map((e: any, i: number) => (
                                            <div key={e.$id || i} className="rounded-lg border border-surface-200 p-2.5 text-xs">
                                                <p><span className="text-surface-400">Company:</span> <span className="text-surface-800">{val(e.companyName)}</span></p>
                                                <p><span className="text-surface-400">Role:</span> <span className="text-surface-700">{val(e.role)}</span></p>
                                                <p><span className="text-surface-400">Description:</span> <span className="text-surface-700">{val(e.description)}</span></p>
                                                <p><span className="text-surface-400">Start Date:</span> <span className="text-surface-700">{e.startDate ? fmtDate(e.startDate) : '—'}</span></p>
                                                <p><span className="text-surface-400">End Date:</span> <span className="text-surface-700">{e.endDate ? fmtDate(e.endDate) : '—'}</span></p>
                                                <CertificatePreviewToggle url={e.certificateUrl} title={`${e.role || 'Experience'} certificate`} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Application meta */}
                            <div className="rounded-xl bg-surface-50 p-3 space-y-1.5 text-sm text-surface-600">
                                {driveName !== '—' && (
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={13} className="text-surface-400 shrink-0" />
                                        <span className="truncate">{driveName}</span>
                                    </div>
                                )}
                                {collegeName !== '—' && (
                                    <div className="flex items-center gap-2">
                                        <GraduationCap size={13} className="text-surface-400 shrink-0" />
                                        <span className="truncate">{collegeName}</span>
                                    </div>
                                )}
                                {(application?.$createdAt || application?.createdAt) && (
                                    <div className="flex items-center gap-2">
                                        <Calendar size={13} className="text-surface-400 shrink-0" />
                                        Applied {fmtDate(application.$createdAt || application.createdAt)}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {(application?.driveId || app.driveId) && (
                                <Link
                                    to={`/drives/${application?.driveId || app.driveId}`}
                                    onClick={onClose}
                                    className="block w-full text-center rounded-lg border border-surface-200 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
                                >
                                    View Drive
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Stage actions per applicant ───────────────────────────────────────────────
function StageActions({ app, onUpdated, onScheduleInterview }: { app: any; onUpdated: () => void; onScheduleInterview: (app: any) => void }) {
    const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
    const appId = app.$id || app.id;
    const currentStage = (fetcher.formData?.get('stage') as string) || app.stage || 'applied';
    const updating = fetcher.state !== 'idle';
    const options = STAGE_TRANSITIONS[currentStage] || [];

    useEffect(() => {
        if (fetcher.data?.ok) onUpdated();
    }, [fetcher.data]);

    if (options.length === 0) {
        return (
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-700">
                Final Stage
            </span>
        );
    }

    return (
        <div className="inline-flex items-center gap-2">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STAGE_CONFIG[currentStage]?.badge || 'bg-surface-100 text-surface-600'}`}>
                {sl(currentStage)}
            </span>
            <div className="relative">
                <select
                    defaultValue=""
                    disabled={updating}
                    onChange={(e) => {
                        const nextStage = e.target.value;
                        if (!nextStage) return;
                        if (nextStage === 'interview_scheduled') {
                            onScheduleInterview(app);
                            e.currentTarget.value = '';
                            return;
                        }
                        fetcher.submit(
                            { intent: 'updateStage', appId, stage: nextStage },
                            { method: 'post' }
                        );
                        e.currentTarget.value = '';
                    }}
                    className={`appearance-none pl-2.5 pr-7 py-1.5 border border-surface-200 rounded-md text-xs bg-white text-surface-700 focus:outline-none focus:ring-1 focus:ring-primary-300 ${updating ? 'opacity-60' : ''}`}
                >
                    <option value="">Update Stage</option>
                    {options.map((nextStage) => (
                        <option key={nextStage} value={nextStage}>
                            {nextStage === 'interview_scheduled' ? 'Interview Schedule' : sl(nextStage)}
                        </option>
                    ))}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-surface-400" />
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CompanyApplicants() {
    const { drives, applications, drive, driveId, stage, stageCounts, totalApplicants } =
        useLoaderData<typeof loader>() as {
            drives: any[]; applications: any[]; drive: any;
            driveId: string; stage: string; stageCounts: Record<string, number>; totalApplicants: number;
        };

    const [selectedApp, setSelectedApp] = useState<any | null>(null);
    const [scheduleApp, setScheduleApp] = useState<any | null>(null);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const filtered = applications.filter(a => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (a.studentName || '').toLowerCase().includes(q)
            || (a.studentEmail || '').toLowerCase().includes(q)
            || (a.studentId || '').toLowerCase().includes(q);
    });

    const total = totalApplicants;
    const sel = stageCounts['selected'] || 0;
    const short = stageCounts['shortlisted'] || 0;
    const rej = stageCounts['rejected'] || 0;

    function buildUrl(params: Record<string, string>) {
        const p = new URLSearchParams();
        if (driveId) p.set('driveId', driveId);
        if (stage) p.set('stage', stage);
        Object.entries(params).forEach(([k, v]) => { if (v) p.set(k, v); else p.delete(k); });
        return `?${p.toString()}`;
    }

    return (
        <div className="space-y-5 animate-fade-in">
            {selectedApp && <ApplicantModal app={selectedApp} onClose={() => setSelectedApp(null)} />}
            {scheduleApp && (
                <InterviewSchedulerModal
                    app={scheduleApp}
                    onClose={() => setScheduleApp(null)}
                    onScheduled={() => revalidator.revalidate()}
                />
            )}

            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-surface-900">{drive ? drive.title : 'All Applicants'}</h1>
                    <p className="text-sm text-surface-500 mt-0.5">{total} applicant{total !== 1 ? 's' : ''}{stage ? ` · ${sl(stage)}` : ''}{search ? ` · ${filtered.length} shown` : ''}</p>
                </div>
                {driveId && (
                    <div className="flex items-center gap-2 shrink-0">
                        <Link to="/applicants" className="text-sm text-surface-500 hover:text-surface-700">← All</Link>
                        <Link to={`/drives/${driveId}`} className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-surface-50">
                            View Drive <ArrowUpRight size={13} />
                        </Link>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total',       value: total, icon: <Users size={16} />,        color: 'text-surface-600' },
                    { label: 'Shortlisted', value: short, icon: <GraduationCap size={16} />, color: 'text-purple-600' },
                    { label: 'Selected',    value: sel,   icon: <CheckCircle2 size={16} />,  color: 'text-emerald-600' },
                    { label: 'Rejected',    value: rej,   icon: <XCircle size={16} />,       color: 'text-rose-600' },
                ].map(stat => (
                    <Card key={stat.label} className="border border-surface-200 !p-4">
                        <div className={`flex items-center gap-2 ${stat.color} mb-1`}>{stat.icon}<span className="text-xs font-medium text-surface-500">{stat.label}</span></div>
                        <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                    <select value={driveId} onChange={e => { const p = new URLSearchParams(); if (e.target.value) p.set('driveId', e.target.value); if (stage) p.set('stage', stage); navigate(`?${p.toString()}`); }}
                        className="appearance-none pl-3 pr-8 py-2 border border-surface-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 text-surface-700">
                        <option value="">All Drives</option>
                        {drives.map((d: any) => <option key={d.id} value={d.id}>{d.title || 'Untitled'}</option>)}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400" />
                </div>

                <div className="flex items-center gap-1 border border-surface-200 rounded-lg p-0.5 bg-white overflow-x-auto">
                    <a href={buildUrl({ stage: '' })} className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${!stage ? 'bg-surface-100 text-surface-900' : 'text-surface-500 hover:text-surface-700'}`}>All ({total})</a>
                    {ALL_STAGES.map(s => (
                        <a key={s} href={buildUrl({ stage: s })} className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${stage === s ? 'bg-surface-100 text-surface-900' : 'text-surface-500 hover:text-surface-700'}`}>
                            {STAGE_CONFIG[s].label} ({stageCounts[s] || 0})
                        </a>
                    ))}
                </div>

                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input type="text" placeholder="Search by name, email or ID..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-surface-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400" />
                </div>
            </div>

            {/* Applicant cards */}
            {filtered.length === 0 ? (
                <Card className="border border-surface-200">
                    <EmptyState icon={<Users size={24} />} title="No applicants found" description={search ? 'Try a different search term.' : 'Applications will appear here once students apply.'} />
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {filtered.map((app: any) => (
                        <Card key={app.$id || app.id} className="border border-surface-200 !p-3 pb-4 min-w-0 min-h-[172px]">
                            <div className="min-w-0">
                                <p className="font-semibold text-surface-900 text-sm truncate">{app.studentName || app.studentId || 'Student'}</p>
                                <p className="text-[11px] text-surface-400 truncate">{app.studentEmail || '—'}</p>
                                <p className="mt-1 text-[11px] text-surface-500 truncate">{fmtDate(app.$createdAt || app.createdAt)}</p>
                                <div className="mt-2 grid grid-cols-1 gap-0.5 text-[11px] text-surface-600">
                                    <p><span className="text-surface-400">Year:</span> {formatAcademicYear(app.academicYear)}</p>
                                    <p><span className="text-surface-400">CGPA:</span> {val(app.cgpa)}</p>
                                    <p className="truncate"><span className="text-surface-400">College:</span> {val(app.collegeName || app.college || app.studentCollegeName || app.studentCollege)}</p>
                                </div>
                            </div>

                            <div className="mt-2 pt-2 border-t border-surface-100 space-y-2">
                                <StageActions app={app} onUpdated={() => revalidator.revalidate()} onScheduleInterview={(a) => setScheduleApp(a)} />
                                <button
                                    onClick={() => setSelectedApp(app)}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:text-primary-700"
                                >
                                    View Form <ArrowUpRight size={10} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
