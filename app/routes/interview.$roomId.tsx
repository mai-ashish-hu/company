import { useEffect, useRef, useState, useCallback } from 'react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireUserSession } from '~/auth.server';
import { api } from '@careernest/lib';

export const meta: MetaFunction = () => [{ title: 'Interview Room – CareerNest' }];

type SessionStatus = 'waiting_for_start' | 'active' | 'grace_period' | 'ended';
type SessionWindow = { scheduledStartTime: string; activationTime: string; endTime: string; gracePeriodEndTime: string; };

const FIVE_MINUTES_MS = 5 * 60 * 1000;

const DEFAULT_CODE: Record<string, string> = {
    javascript: 'function solve() {\n    \n}\n\nsolve();\n',
    python:     'def solve():\n    pass\n\nif __name__ == "__main__":\n    solve()\n',
    java:       'public class Main {\n    public static void main(String[] args) {\n    }\n}\n',
    cpp:        '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    return 0;\n}\n',
    c:          '#include <stdio.h>\nint main() {\n    return 0;\n}\n',
    go:         'package main\nfunc main() {}\n',
    rust:       'fn main() {}\n',
    typescript: 'function solve(): void {\n}\nsolve();\n',
    kotlin:     'fun main() {}\n',
    csharp:     'using System;\npublic class Program {\n    public static void Main(string[] args) {}\n}\n',
    swift:      'import Foundation\nfunc main() {}\n',
    php:        '<?php\nfunction solve(): void {}\nsolve();\n',
    ruby:       'def solve\nend\nsolve\n',
    dart:       'void main() {}\n',
};

const toMonacoLanguage = (language: string) => {
    return ({ cpp: 'cpp', c: 'c', csharp: 'csharp', dart: 'dart' } as Record<string, string>)[language] || language;
};

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { token, user } = await requireUserSession(request);
    const roomId = params.roomId!;
    let roomInfo: any = null;
    try {
        const res = await api.interviews.getRoomDetails(token, roomId) as any;
        roomInfo = res.data || res;
    } catch (err: any) {
        roomInfo = { roomId, error: err?.message || 'Room not found' };
    }
    return json({ token, user, roomId, roomInfo });
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const MicIcon = ({ off }: { off?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {off ? (<><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>)
        : (<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>)}
    </svg>
);
const CamIcon = ({ off }: { off?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {off ? (<><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" /><line x1="1" y1="1" x2="23" y2="23" /></>)
        : (<><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>)}
    </svg>
);
const MonitorIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>);
const ChatIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
const CodeIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>);

// ─── Agora Video Container ─────────────────────────────────────────────────────
function AgoraVideoTrack({ track, className, style }: { track: any | null; className?: string; style?: React.CSSProperties }) {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!track || !containerRef.current) return;
        track.play(containerRef.current);
        return () => { try { track.stop(); } catch { /* ignore */ } };
    }, [track]);
    return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%', ...style }} />;
}

// ─── Read-only Code Editor (for recruiter watching candidate) ─────────────────
function CodeEditor({ value, language }: { value: string; language: string }) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const lineCount = Math.max(value.split('\n').length, 12);
    const syncScroll = useCallback(() => {
        if (!textareaRef.current || !lineNumbersRef.current) return;
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }, []);
    return (
        <div className="w-full h-full rounded-2xl border border-white/10 bg-slate-950 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/40">
                <span>{toMonacoLanguage(language)}</span>
                <span>Read only · Candidate view</span>
            </div>
            <div className="flex h-[calc(100%-37px)]">
                <div ref={lineNumbersRef} className="select-none overflow-hidden border-r border-white/10 bg-black/20 px-3 py-3 text-right font-mono text-xs leading-6 text-white/30">
                    {Array.from({ length: lineCount }, (_, i) => <div key={i + 1}>{i + 1}</div>)}
                </div>
                <textarea
                    ref={textareaRef}
                    aria-label={`${language} code viewer`}
                    spellCheck={false}
                    readOnly
                    onScroll={syncScroll}
                    className="h-full w-full resize-none bg-transparent px-4 py-3 font-mono text-sm leading-6 text-white outline-none"
                    style={{ tabSize: 4 }}
                    value={value}
                />
            </div>
        </div>
    );
}

// ─── Main Recruiter Interview Room ────────────────────────────────────────────
export default function InterviewRoomPage() {
    const { token, user, roomId, roomInfo } = useLoaderData<typeof loader>();

    const initialWindow: SessionWindow = roomInfo?.sessionWindow || {
        scheduledStartTime: roomInfo?.scheduledAt,
        activationTime: new Date(new Date(roomInfo?.scheduledAt).getTime() - 10 * 60 * 1000).toISOString(),
        endTime: new Date(new Date(roomInfo?.scheduledAt).getTime() + Number(roomInfo?.durationMinutes || 60) * 60 * 1000).toISOString(),
        gracePeriodEndTime: new Date(new Date(roomInfo?.scheduledAt).getTime() + (Number(roomInfo?.durationMinutes || 60) + 10) * 60 * 1000).toISOString(),
    };

    const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
    const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
    const [localScreenTrack, setLocalScreenTrack] = useState<any>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [remoteScreenSharerId, setRemoteScreenSharerId] = useState<string | null>(null);
    const [showChat, setShowChat] = useState(false);
    const [showIDE, setShowIDE] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [hasLeft, setHasLeft] = useState(false);
    const [unreadChat, setUnreadChat] = useState(0);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const [confirmEnd, setConfirmEnd] = useState(false);
    const [isEnding, setIsEnding] = useState(false);
    const [isExtending, setIsExtending] = useState(false);
    const [error, setError] = useState('');
    const [tabSwitchAlerts, setTabSwitchAlerts] = useState<{ id: number; name: string; time: string }[]>([]);
    const [elapsed, setElapsed] = useState('00:00');
    const [nowMs, setNowMs] = useState(Date.now());
    const [sessionWindow, setSessionWindow] = useState<SessionWindow>(initialWindow);
    const [extensionNotice, setExtensionNotice] = useState('');
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState(DEFAULT_CODE.python);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [showConsole, setShowConsole] = useState(true);
    const [candidateIsRunning, setCandidateIsRunning] = useState(false);
    const [candidateStdin, setCandidateStdin] = useState('');
    const [candidateTyping, setCandidateTyping] = useState(false);

    const agoraClientRef = useRef<any>(null);
    const screenShareClientRef = useRef<any>(null);
    const localAudioTrackRef = useRef<any>(null);
    const localVideoTrackRef = useRef<any>(null);
    const localScreenTrackRef = useRef<any>(null);
    const screenShareUidRef = useRef<string | null>(null);
    const ablyClientRef = useRef<any>(null);
    const ablyChannelRef = useRef<any>(null);
    const agoraJoinInfoRef = useRef<{ appId: string; token: string | null; channelName: string }>({
        appId: '',
        token: null,
        channelName: '',
    });
    const candidateTypingTimer = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef(Date.now());
    const showChatRef = useRef(false);

    const currentUser = user as { id?: string; $id?: string; name?: string };
    const currentUserId = currentUser.id ?? currentUser.$id ?? '';

    const deriveStatus = useCallback((win: SessionWindow): SessionStatus => {
        const activation = new Date(win.activationTime).getTime();
        const end = new Date(win.endTime).getTime();
        const graceEnd = new Date(win.gracePeriodEndTime).getTime();
        if (nowMs < activation) return 'waiting_for_start';
        if (nowMs <= end) return 'active';
        if (nowMs <= graceEnd) return 'grace_period';
        return 'ended';
    }, [nowMs]);

    const sessionStatus = deriveStatus(sessionWindow);
    const showEndingSoon = sessionStatus === 'active' && (new Date(sessionWindow.endTime).getTime() - nowMs) <= FIVE_MINUTES_MS;

    useEffect(() => { showChatRef.current = showChat; }, [showChat]);

    useEffect(() => {
        const tick = setInterval(() => setNowMs(Date.now()), 1000);
        return () => clearInterval(tick);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = Math.floor((Date.now() - startTimeRef.current) / 1000);
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            const s = diff % 60;
            setElapsed(h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const sendSignal = useCallback((type: string, data: unknown, targetId?: string) => {
        ablyChannelRef.current?.publish(type, {
            id: Math.random().toString(36).slice(2),
            roomId, senderId: currentUserId, senderName: currentUser.name || 'Recruiter',
            receiverId: targetId || 'broadcast', type,
            payload: JSON.stringify(data ?? {}),
            createdAt: new Date().toISOString(), $createdAt: new Date().toISOString(),
        });
    }, [roomId, currentUserId, currentUser.name]);

    // ── Startup ────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (sessionStatus === 'waiting_for_start' || sessionStatus === 'ended') return;

        let cancelled = false;

        const init = async () => {
            try {
                const joinRes = await api.interviews.join(token, roomInfo.interviewId) as any;
                const joinData = joinRes.data || joinRes;
                if (cancelled) return;

                if (joinData.sessionWindow) setSessionWindow(joinData.sessionWindow);

                const agoraAppId = joinData.agoraAppId as string;
                const agoraToken = joinData.agoraToken as string | null;
                const channelName = joinData.channelName as string;
                agoraJoinInfoRef.current = { appId: agoraAppId, token: agoraToken, channelName };

                if (!agoraAppId || !channelName) {
                    throw new Error('Interview video service is not configured.');
                }

                // Connect Ably
                const AblyModule = await import('ably');
                const Ably = AblyModule.default || AblyModule;
                const ablyClient = new (Ably as any).Realtime({
                    authUrl: `/api/v1/interview-signal/rooms/${roomId}/ably-token`,
                    authHeaders: { Authorization: `Bearer ${token}` },
                });
                ablyClientRef.current = ablyClient;
                const channel = ablyClient.channels.get(`interview:${roomId}`);
                ablyChannelRef.current = channel;

                channel.subscribe((msg: any) => {
                    if (cancelled) return;
                    const signal = { ...msg.data, type: msg.data?.type || msg.name };
                    if (signal.senderId === currentUserId) return;

                    const rawPayload = signal.payload ?? '{}';
                    const data = typeof rawPayload === 'string' ? (() => { try { return JSON.parse(rawPayload); } catch { return {}; } })() : rawPayload;

                    if (signal.type === 'chat') {
                        const msgId = signal.id || String(Date.now());
                        setChatMessages(prev => {
                            if (prev.some(m => m.id === msgId)) return prev;
                            return [...prev, { id: msgId, sender: data.senderName || signal.senderName || 'Candidate', text: data.text || '', time: new Date(signal.createdAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }];
                        });
                        if (!showChatRef.current) setUnreadChat(n => n + 1);
                    } else if (signal.type === 'code_update') {
                        if (data.language && data.code !== undefined) {
                            setLanguage(data.language);
                            setCode(data.code);
                        }
                        setCandidateTyping(true);
                        if (candidateTypingTimer.current) clearTimeout(candidateTypingTimer.current);
                        candidateTypingTimer.current = setTimeout(() => setCandidateTyping(false), 2000);
                    } else if (signal.type === 'code_output') {
                        setConsoleOutput(Array.isArray(data.lines) ? data.lines.map((line: unknown) => String(line)) : []);
                        setCandidateIsRunning(Boolean(data.isRunning));
                        setCandidateStdin(typeof data.stdin === 'string' ? data.stdin : '');
                        if (typeof data.language === 'string' && data.language) {
                            setLanguage(data.language);
                        }
                        setShowConsole(true);
                    } else if (signal.type === 'tab_switch') {
                        const candidateName = data.senderName || signal.senderName || 'Candidate';
                        const alertTime = new Date(signal.createdAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                        setTabSwitchAlerts(prev => [...prev, { id: Date.now(), name: candidateName, time: alertTime }]);
                        setTimeout(() => setTabSwitchAlerts(prev => prev.slice(1)), 8000);
                    } else if (signal.type === 'interview_time_extended') {
                        if (data.newEndTime) {
                            const endMs = new Date(data.newEndTime).getTime();
                            setSessionWindow(prev => ({ ...prev, endTime: new Date(endMs).toISOString(), gracePeriodEndTime: new Date(endMs + 10 * 60 * 1000).toISOString() }));
                        }
                        if (Number(data.addedMinutes || 0) > 0) {
                            setExtensionNotice(`Interview extended by ${data.addedMinutes} minutes.`);
                            setTimeout(() => setExtensionNotice(''), 5000);
                        }
                    } else if (signal.type === 'screen_share_started') {
                        setRemoteScreenSharerId(String(data.screenUid || signal.senderId || ''));
                    } else if (signal.type === 'screen_share_stopped') {
                        setRemoteScreenSharerId(prev => prev === String(data.screenUid || signal.senderId || '') ? null : prev);
                    }
                });

                // Join Agora
                const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
                const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
                agoraClientRef.current = client;

                client.on('user-published', async (remoteUser: any, mediaType: 'audio' | 'video') => {
                    await client.subscribe(remoteUser, mediaType);
                    if (mediaType === 'audio') remoteUser.audioTrack?.play();
                    setRemoteUsers(prev => {
                        const idx = prev.findIndex(u => u.uid === remoteUser.uid);
                        if (idx >= 0) { const n = [...prev]; n[idx] = remoteUser; return n; }
                        return [...prev, remoteUser];
                    });
                });
                client.on('user-unpublished', (remoteUser: any) => { setRemoteUsers(prev => prev.map(u => u.uid === remoteUser.uid ? remoteUser : u)); });
                client.on('user-left', (remoteUser: any) => {
                    setRemoteUsers(prev => prev.filter(u => u.uid !== remoteUser.uid));
                    setRemoteScreenSharerId(prev => prev === String(remoteUser.uid) ? null : prev);
                });
                client.on('connection-state-change', (curState: string) => {
                    if (!cancelled) {
                        if (curState === 'CONNECTED') setConnectionStatus('connected');
                        else if (curState === 'CONNECTING' || curState === 'RECONNECTING') setConnectionStatus('connecting');
                        else if (curState === 'DISCONNECTED') setConnectionStatus('disconnected');
                    }
                });

                await client.join(agoraAppId, channelName, agoraToken, null);
                if (cancelled) return;

                let audioTrack: any = null;
                let videoTrack: any = null;
                const mediaIssues: string[] = [];

                try {
                    audioTrack = await AgoraRTC.createMicrophoneAudioTrack({ encoderConfig: 'high_quality' });
                    localAudioTrackRef.current = audioTrack;
                } catch { setIsMuted(true); mediaIssues.push('Microphone unavailable. Joined muted.'); }

                try {
                    videoTrack = await AgoraRTC.createCameraVideoTrack({ encoderConfig: '720p_2' });
                    localVideoTrackRef.current = videoTrack;
                    if (!cancelled) setLocalVideoTrack(videoTrack);
                } catch { setIsCameraOff(true); mediaIssues.push('Camera unavailable.'); }

                const toPublish = [audioTrack, videoTrack].filter(Boolean);
                if (toPublish.length > 0) await client.publish(toPublish);

                if (!cancelled) {
                    setConnectionStatus('connected');
                    if (mediaIssues.length > 0) setError(mediaIssues.join(' '));
                }
            } catch (err: any) {
                if (!cancelled) { setConnectionStatus('disconnected'); setError(err?.message || 'Could not initialize the interview room'); }
            }
        };

        init();

        return () => {
            cancelled = true;
            [localAudioTrackRef.current, localVideoTrackRef.current, localScreenTrackRef.current]
                .filter(Boolean).forEach((t: any) => { try { t.stop(); t.close(); } catch { /* ignore */ } });
            agoraClientRef.current?.leave().catch(() => {});
            screenShareClientRef.current?.leave().catch(() => {});
            agoraClientRef.current = null;
            screenShareClientRef.current = null;
            screenShareUidRef.current = null;
            localAudioTrackRef.current = null; localVideoTrackRef.current = null; localScreenTrackRef.current = null;
            try { ablyChannelRef.current?.unsubscribe(); } catch { /* ignore */ }
            try { ablyClientRef.current?.close(); } catch { /* ignore */ }
            ablyChannelRef.current = null; ablyClientRef.current = null;
            if (candidateTypingTimer.current) clearTimeout(candidateTypingTimer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionStatus]);

    const toggleMute = async () => {
        const audioTrack = localAudioTrackRef.current;
        if (!audioTrack) return;
        const newMuted = !isMuted;
        await audioTrack.setEnabled(!newMuted);
        setIsMuted(newMuted); setError('');
        sendSignal('mute_status', { isMuted: newMuted, isCameraOff });
    };

    const toggleCamera = async () => {
        const videoTrack = localVideoTrackRef.current;
        if (!videoTrack) return;
        const newOff = !isCameraOff;
        await videoTrack.setEnabled(!newOff);
        setIsCameraOff(newOff); if (!newOff) setError('');
        sendSignal('mute_status', { isMuted, isCameraOff: newOff });
    };

    const stopScreenShare = async (shouldNotify = true) => {
        const screenTrack = localScreenTrackRef.current;
        const screenClient = screenShareClientRef.current;
        const screenUid = screenShareUidRef.current;

        if (screenTrack) {
            try { await screenClient?.unpublish?.([screenTrack]); } catch { /* ignore */ }
            try { screenTrack.stop(); screenTrack.close(); } catch { /* ignore */ }
        }

        await screenClient?.leave?.().catch(() => {});

        localScreenTrackRef.current = null;
        screenShareClientRef.current = null;
        screenShareUidRef.current = null;
        setLocalScreenTrack(null);
        setIsScreenSharing(false);

        if (shouldNotify) {
            sendSignal('screen_share_stopped', { screenUid });
        }
    };

    const toggleScreenShare = async () => {
        const client = agoraClientRef.current;
        if (!client) return;
        if (isScreenSharing) {
            await stopScreenShare(true);
        } else {
            try {
                const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
                const { appId, token: agoraToken, channelName } = agoraJoinInfoRef.current;
                if (!appId || !channelName) {
                    throw new Error('Screen sharing is unavailable right now.');
                }

                const screenClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
                const screenUid = await screenClient.join(appId, channelName, agoraToken, null);
                const screenTrack = await AgoraRTC.createScreenVideoTrack({ encoderConfig: '1080p_1' }, 'disable');
                await screenClient.publish([screenTrack as any]);
                screenShareClientRef.current = screenClient;
                screenShareUidRef.current = String(screenUid);
                localScreenTrackRef.current = screenTrack;
                setLocalScreenTrack(screenTrack);
                setIsScreenSharing(true);
                sendSignal('screen_share_started', { screenUid: String(screenUid) });
                (screenTrack as any).on?.('track-ended', async () => {
                    await stopScreenShare(true);
                });
            } catch (err: any) {
                if (err?.name !== 'NotAllowedError') setError(err?.message || 'Could not start screen sharing.');
            }
        }
    };

    const sendChat = async () => {
        if (!chatInput.trim()) return;
        const text = chatInput.trim(); setChatInput('');
        setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: (currentUser.name || 'You') + ' (You)', text, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
        sendSignal('chat', { text, senderName: currentUser.name });
    };

    const leaveRoom = async () => {
        if (isScreenSharing) {
            await stopScreenShare(false);
        }

        [localAudioTrackRef.current, localVideoTrackRef.current]
            .filter(Boolean).forEach((t: any) => { try { t.stop(); t.close(); } catch { /* ignore */ } });
        await agoraClientRef.current?.leave().catch(() => {});
        await screenShareClientRef.current?.leave?.().catch(() => {});
        try { ablyChannelRef.current?.unsubscribe(); } catch { /* ignore */ }
        try { ablyClientRef.current?.close(); } catch { /* ignore */ }
        setHasLeft(true);
    };

    const endInterview = async () => {
        setIsEnding(true);
        try {
            await api.interviews.update(token, roomInfo.interviewId, { status: 'completed' } as any);
            await leaveRoom();
        } catch (err: any) {
            setError(err?.message || 'Could not end interview');
        } finally {
            setIsEnding(false); setConfirmEnd(false);
        }
    };

    const extendInterview = async (minutes: 30 | 45 | 60) => {
        setIsExtending(true);
        try {
            await api.interviews.extend(token, roomInfo.interviewId, minutes);
        } catch (err: any) {
            setError(err?.message || 'Could not extend interview');
        } finally {
            setIsExtending(false);
        }
    };

    if (roomInfo?.error) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-center p-8"><div className="text-red-400 text-5xl mb-4">⚠️</div><h1 className="text-white text-xl font-semibold mb-2">Room Not Found</h1><p className="text-gray-400 text-sm mb-6">{roomInfo.error}</p><button onClick={() => window.history.back()} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Go Back</button></div>
        </div>
    );

    if (hasLeft) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-center p-8"><div className="text-5xl mb-4">👋</div><h1 className="text-white text-xl font-semibold mb-2">You've left the interview</h1><button onClick={() => window.history.back()} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Go Back</button></div>
        </div>
    );

    const selfInitials = (currentUser.name || 'R').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    const screenSharerUser = remoteScreenSharerId
        ? remoteUsers.find((remoteUser) => String(remoteUser.uid) === remoteScreenSharerId) || null
        : null;
    const mainRemoteUser = remoteUsers.find((remoteUser) => String(remoteUser.uid) !== remoteScreenSharerId) || remoteUsers[0] || null;
    const activeScreenTrack = localScreenTrack ?? screenSharerUser?.videoTrack ?? null;
    const isShowingScreenShare = Boolean(activeScreenTrack);

    return (
        <div className="bg-gray-950 select-none" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Confirm end interview modal */}
            {confirmEnd && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                        <h2 className="text-white text-xl font-bold mb-2">End Interview?</h2>
                        <p className="text-gray-400 text-sm mb-6">This will end the session for all participants.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setConfirmEnd(false)} className="px-5 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 text-sm">Cancel</button>
                            <button onClick={endInterview} disabled={isEnding} className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm disabled:opacity-50">
                                {isEnding ? 'Ending…' : 'End Interview'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab switch alerts */}
            <div className="fixed top-4 right-4 z-40 flex flex-col gap-2">
                {tabSwitchAlerts.map(a => (
                    <div key={a.id} className="bg-red-900/90 border border-red-500/50 rounded-xl px-4 py-2 text-white text-xs shadow-lg">
                        ⚠️ <strong>{a.name}</strong> switched tabs at {a.time}
                    </div>
                ))}
            </div>

            {/* Header */}
            <div style={{ flexShrink: 0 }} className="flex items-center justify-between px-5 py-2.5 bg-gray-900/90 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <span className="text-white font-semibold text-sm">CareerNest Interview</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' : connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' : 'bg-red-500/20 text-red-400'}`}>
                        {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'connecting' ? 'Connecting…' : 'Disconnected'}
                    </span>
                    {showEndingSoon && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">Ending soon</span>}
                    {extensionNotice && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{extensionNotice}</span>}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs">{remoteUsers.length + 1} participant{remoteUsers.length !== 0 ? 's' : ''} · {elapsed}</span>
                    {/* Extend buttons */}
                    {(['30', '45', '60'] as const).map(m => (
                        <button key={m} onClick={() => extendInterview(Number(m) as 30 | 45 | 60)} disabled={isExtending} className="text-xs px-2 py-0.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 disabled:opacity-50 transition-colors">+{m}m</button>
                    ))}
                    <button onClick={() => setConfirmEnd(true)} className="text-xs px-3 py-1 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors">End</button>
                </div>
            </div>

            {/* Banners */}
            {error && <div style={{ flexShrink: 0 }} className="bg-red-900/50 border-b border-red-500/30 px-5 py-2 text-red-300 text-sm text-center">{error}</div>}

            {/* Main area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

                {/* Video section */}
                <div className="relative bg-gray-900 overflow-hidden" style={showIDE ? { width: '38%', flexShrink: 0, display: 'flex', flexDirection: 'column' } : { flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {isShowingScreenShare ? (
                        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                            <div style={{ flex: 1, position: 'relative', background: '#000', overflow: 'hidden' }}>
                                <AgoraVideoTrack track={activeScreenTrack} className="w-full h-full object-contain" />
                                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-blue-600/90 text-white text-xs px-2.5 py-1 rounded-full">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    {localScreenTrack ? "You're sharing your screen" : 'Candidate is sharing their screen'}
                                </div>
                            </div>
                            <div className="bg-gray-950 border-l border-white/10 overflow-y-auto" style={{ width: 148, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, padding: 8 }}>
                                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-gray-800" style={{ aspectRatio: '16/9', width: '100%' }}>
                                    {localVideoTrack && !isCameraOff ? <AgoraVideoTrack track={localVideoTrack} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center bg-gray-800"><span className="text-white text-lg font-bold">{selfInitials}</span></div>}
                                    <div className="absolute bottom-1 left-1.5"><span className="text-white text-[10px] bg-black/60 px-1 py-0.5 rounded">You</span></div>
                                </div>
                                {mainRemoteUser && (
                                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-gray-800" style={{ aspectRatio: '16/9', width: '100%' }}>
                                        {mainRemoteUser.videoTrack ? <AgoraVideoTrack track={mainRemoteUser.videoTrack} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center bg-gray-800"><span className="text-white text-lg font-bold">C</span></div>}
                                        <div className="absolute bottom-1 left-1.5"><span className="text-white text-[10px] bg-black/60 px-1 py-0.5 rounded">Candidate</span></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                            {mainRemoteUser?.videoTrack ? (
                                <AgoraVideoTrack track={mainRemoteUser.videoTrack} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                    {mainRemoteUser ? (
                                        <div className="text-center">
                                            <div className="w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center text-white text-3xl font-bold mx-auto">C</div>
                                            <p className="text-white/60 text-sm mt-3">Candidate</p>
                                            <p className="text-white/30 text-xs">Camera off</p>
                                        </div>
                                    ) : (
                                        <p className="text-white/40 text-sm">Waiting for candidate to join...</p>
                                    )}
                                </div>
                            )}
                            {mainRemoteUser && <div className="absolute bottom-4 left-4"><span className="px-2 py-0.5 bg-black/60 rounded text-white text-xs backdrop-blur-sm">Candidate</span></div>}

                            {/* Self PiP */}
                            <div className="absolute rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-gray-800" style={{ bottom: 16, right: 16, width: 180, height: 120, zIndex: 10 }}>
                                {localVideoTrack && !isCameraOff ? <AgoraVideoTrack track={localVideoTrack} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center bg-gray-900"><span className="text-white text-lg font-bold">{selfInitials}</span></div>}
                                <div className="absolute bottom-1 left-1 flex items-center gap-1">
                                    <span className="px-2 py-0.5 bg-black/60 rounded text-white text-xs backdrop-blur-sm">You</span>
                                    {isMuted && <span className="w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center"><MicIcon off /></span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chat overlay */}
                    {showChat && (
                        <div className="absolute top-0 right-0 bottom-0 border-l border-white/10 flex flex-col" style={{ width: 280, zIndex: 20, backgroundColor: '#0b0b0b' }}>
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0" style={{ backgroundColor: '#0b0b0b' }}>
                                <span className="text-sm font-semibold" style={{ color: '#ffffff' }}>Chat</span>
                                <button onClick={() => setShowChat(false)} className="text-white/40 hover:text-white text-xl leading-none">&times;</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ backgroundColor: '#0b0b0b' }}>
                                {chatMessages.length === 0 && <p className="text-white/25 text-xs text-center mt-6">No messages yet</p>}
                                {chatMessages.map(m => (
                                    <div key={m.id}>
                                        <div className="flex items-center gap-1.5 mb-0.5"><span className="text-xs font-medium" style={{ color: '#aaaaaa' }}>{m.sender}</span><span className="text-white/25 text-[10px]">{m.time}</span></div>
                                        <p className="text-xs rounded-lg px-2.5 py-1.5" style={{ color: '#ffffff', backgroundColor: '#1a1a1a' }}>{m.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-white/10 flex gap-2 flex-shrink-0" style={{ backgroundColor: '#0b0b0b' }}>
                                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }}} placeholder="Type a message…" className="flex-1 text-xs px-2.5 py-2 rounded-lg focus:outline-none focus:border-blue-500 placeholder-white/25" style={{ backgroundColor: '#111111', color: '#ffffff', border: '1px solid #333' }} />
                                <button onClick={sendChat} disabled={!chatInput.trim()} className="px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">→</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Code viewer panel (read-only for recruiter) */}
                {showIDE && (
                    <div className="bg-gray-950 border-l border-white/10" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                        <div style={{ flexShrink: 0 }} className="flex items-center gap-3 px-4 py-2.5 bg-gray-900 border-b border-white/5">
                            <span className="text-white/60 text-xs font-medium">Candidate's Code</span>
                            <span className="text-white/40 text-xs px-2 py-0.5 rounded bg-white/5">{language}</span>
                            {candidateTyping && <span className="text-blue-400 text-xs animate-pulse">Candidate is typing…</span>}
                            {candidateIsRunning && <span className="text-green-400 text-xs animate-pulse">Running…</span>}
                            <div style={{ flex: 1 }} />
                            <button onClick={() => setShowConsole(v => !v)} title="Toggle console" className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors ${showConsole ? 'bg-blue-600/30 text-blue-400' : 'bg-white/5 text-white/40 hover:text-white'}`}>Console</button>
                            <button onClick={() => setShowIDE(false)} title="Close" className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white/40 hover:text-white flex items-center justify-center transition-colors">✕</button>
                        </div>
                        <div style={{ flex: showConsole ? 0.65 : 1, minHeight: 0, overflow: 'hidden' }}>
                            <CodeEditor value={code} language={language} />
                        </div>
                        {showConsole && (
                            <div className="border-t border-white/10" style={{ flex: 0.35, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                                <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900/80 border-b border-white/5 flex-shrink-0">
                                    <span className="text-white/40 text-xs font-medium">Console Output</span>
                                    {candidateIsRunning ? <span className="text-green-400 text-[11px] animate-pulse">Running…</span> : null}
                                </div>
                                <div className="px-3 py-2 border-b border-white/5 bg-gray-900/70">
                                    <label className="block text-white/40 text-[11px] mb-1">Stdin used by candidate</label>
                                    <div className="min-h-[44px] rounded border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-white/70 whitespace-pre-wrap">
                                        {candidateStdin || 'No stdin provided'}
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-3 font-mono text-xs" style={{ background: '#0d1117' }}>
                                    {candidateIsRunning ? (
                                        <p className="text-green-300">Candidate is running the code...</p>
                                    ) : consoleOutput.length === 0 ? (
                                        <p className="text-white/20">Candidate output will appear here after they run the code.</p>
                                    ) : (
                                        consoleOutput.map((line, index) => (
                                            <div key={`${line}-${index}`} className={`py-0.5 ${line.startsWith('Error') ? 'text-red-400' : line.startsWith('Warn') ? 'text-yellow-400' : 'text-green-300'}`}>{line}</div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Controls bar */}
            <div style={{ flexShrink: 0 }} className="bg-gray-900/95 border-t border-white/10 px-6 py-3">
                <div className="flex items-center justify-center gap-3">
                    <button onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all text-white ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'}`}><MicIcon off={isMuted} /></button>
                    <button onClick={toggleCamera} title={isCameraOff ? 'Camera on' : 'Camera off'} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all text-white ${isCameraOff ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'}`}><CamIcon off={isCameraOff} /></button>
                    <button onClick={toggleScreenShare} title={isScreenSharing ? 'Stop sharing' : 'Share screen'} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all text-white ${isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}><MonitorIcon /></button>
                    <button onClick={() => { setShowChat(v => { const n = !v; if (n) setUnreadChat(0); return n; }); }} title="Chat" className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all text-white ${showChat ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}>
                        <ChatIcon />
                        {unreadChat > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">{unreadChat}</span>}
                    </button>
                    <button onClick={() => setShowIDE(v => !v)} title={showIDE ? 'Close Code View' : "View Candidate's Code"} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all text-white ${showIDE ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}><CodeIcon /></button>
                    <button onClick={leaveRoom} title="Leave" className="w-16 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors ml-4 text-xs">Leave</button>
                    <button onClick={() => setConfirmEnd(true)} title="End Interview" className="w-16 h-12 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors text-xs">End</button>
                </div>
                <p className="text-center text-white/15 text-[10px] mt-1.5">Room: {roomId}</p>
            </div>
        </div>
    );
}
