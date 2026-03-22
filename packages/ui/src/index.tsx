import * as React from 'react';
import clsx, { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export function Card({ className, hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-6 shadow-sm',
        hover && 'transition-shadow hover:shadow-md',
        className,
      )}
      {...props}
    />
  );
}

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: string;
};

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        variant || 'bg-slate-100 text-slate-700',
        className,
      )}
      {...props}
    />
  );
}

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      {icon ? <div className="mb-3 text-slate-400">{icon}</div> : null}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

type StatCardProps = {
  title: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

export function StatCard({ title, value, subtitle, icon, className }: StatCardProps) {
  return (
    <Card className={cn('!p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
        {icon ? <div className="text-slate-500">{icon}</div> : null}
      </div>
    </Card>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  variant?: 'solid' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({
  className,
  isLoading,
  variant = 'solid',
  size = 'md',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-10 px-4 text-sm',
        size === 'lg' && 'h-11 px-5 text-base',
        variant === 'solid' && 'bg-primary-600 text-white hover:bg-primary-700',
        variant === 'ghost' && 'bg-transparent text-slate-700 hover:bg-slate-100',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode;
  icon?: React.ReactNode;
};

export function Input({ label, icon, className, id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span> : null}
      <span className="relative block">
        {icon ? <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span> : null}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-3 text-sm outline-none transition-colors focus:border-primary-500',
            icon ? 'pl-10' : 'pl-3',
            className,
          )}
          {...props}
        />
      </span>
    </label>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: React.ReactNode;
};

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  const inputId = id || props.name;
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span> : null}
      <textarea
        id={inputId}
        className={cn(
          'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary-500',
          className,
        )}
        {...props}
      />
    </label>
  );
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, title, size = 'md', children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 w-full rounded-2xl bg-white p-5 shadow-xl',
          size === 'sm' && 'max-w-md',
          size === 'md' && 'max-w-lg',
          size === 'lg' && 'max-w-3xl',
          size === 'xl' && 'max-w-5xl',
        )}
      >
        {title ? <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2> : null}
        {children}
      </div>
    </div>
  );
}

export function formatDate(value: string | number | Date): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
