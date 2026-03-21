import { useEffect, useRef, useState } from 'react';

type InlineCertificateViewerProps = {
    url: string;
    title?: string;
    className?: string;
};

declare global {
    interface Window {
        pdfjsLib?: any;
        __pdfjsLoadPromise?: Promise<any>;
    }
}

function getPathnameLower(url: string): string {
    try {
        return new URL(url, 'http://localhost').pathname.toLowerCase();
    } catch {
        return url.toLowerCase();
    }
}

function isImageUrl(pathname: string): boolean {
    return /\.(png|jpe?g|webp|gif|bmp|svg)$/.test(pathname);
}

function isPdfUrl(pathname: string): boolean {
    return pathname.endsWith('.pdf');
}

function loadPdfJs(): Promise<any> {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (window.__pdfjsLoadPromise) return window.__pdfjsLoadPromise;

    window.__pdfjsLoadPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>('script[data-pdfjs="true"]');
        if (existing) {
            existing.addEventListener('load', () => resolve(window.pdfjsLib));
            existing.addEventListener('error', () => reject(new Error('Failed to load PDF.js')));
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.async = true;
        script.dataset.pdfjs = 'true';
        script.onload = () => {
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve(window.pdfjsLib);
            } else {
                reject(new Error('PDF.js not available on window'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load PDF.js'));
        document.head.appendChild(script);
    });

    return window.__pdfjsLoadPromise;
}

export function InlineCertificateViewer({
    url,
    title = 'Certificate preview',
    className,
}: InlineCertificateViewerProps) {
    const trimmedUrl = url.trim();
    const [show, setShow] = useState(false);
    const [pdfError, setPdfError] = useState('');
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    if (!trimmedUrl) return null;

    const pathname = getPathnameLower(trimmedUrl);
    const image = isImageUrl(pathname);
    const pdf = isPdfUrl(pathname);

    useEffect(() => {
        if (!show || !pdf) return;

        let cancelled = false;

        const renderPdf = async () => {
            try {
                setPdfError('');
                const pdfjs = await loadPdfJs();
                const loadingTask = pdfjs.getDocument(trimmedUrl);
                const doc = await loadingTask.promise;
                if (cancelled) return;

                const page = await doc.getPage(1);
                if (cancelled) return;

                const canvas = canvasRef.current;
                if (!canvas) return;
                const context = canvas.getContext('2d');
                if (!context) return;

                const unscaled = page.getViewport({ scale: 1 });
                const targetWidth = Math.max(canvas.parentElement?.clientWidth || 800, 320);
                const scale = Math.min(2.2, Math.max(0.7, targetWidth / unscaled.width));
                const viewport = page.getViewport({ scale });

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: context, viewport }).promise;
            } catch {
                if (!cancelled) setPdfError('Failed to preview PDF.');
            }
        };

        renderPdf();
        return () => { cancelled = true; };
    }, [show, pdf, trimmedUrl]);

    return (
        <div className={['mt-2', className].filter(Boolean).join(' ')}>
            <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
                {show ? 'Hide certificate' : 'View certificate'}
            </button>

            {show && (
                <div className="mt-2 overflow-hidden rounded-md border border-surface-200 bg-white">
                    {image ? (
                        <img src={trimmedUrl} alt={title} loading="lazy" className="max-h-72 w-full object-contain bg-surface-50" />
                    ) : pdf ? (
                        <div className="overflow-auto">
                            <canvas ref={canvasRef} className="block max-w-full" />
                            {pdfError && (
                                <div className="p-3 text-xs text-rose-600">
                                    {pdfError} <a href={trimmedUrl} target="_blank" rel="noreferrer" className="underline">Open file</a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <iframe src={`${trimmedUrl}#toolbar=0`} title={title} loading="lazy" className="h-72 w-full" />
                    )}
                </div>
            )}
        </div>
    );
}
