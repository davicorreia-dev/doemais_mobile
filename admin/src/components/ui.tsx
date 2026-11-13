import { useEffect, type ReactNode } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { useStore } from '../state/store';
import type { Plan, Tone } from '../data/mock';

export const Chip = ({ tone, children }: { tone: Tone; children: ReactNode }) => <span className={`chip ${tone}`}>{children}</span>;

export const PlanTag = ({ plan }: { plan: Plan }) => {
    const { review } = useStore();
    if (!review) return null;
    return <span className={`plan-tag ${plan}`}>{plan === 'mvp' ? 'MVP' : 'FASE 2'}</span>;
};

export const Avatar = ({ name, size = '', soft = true }: { name: string; size?: string; soft?: boolean }) => (
    <span className={`avatar ${soft ? 'soft' : ''} ${size}`}>{name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()}</span>
);

export const PageHead = ({ title, sub, plan, actions }: { title: string; sub?: string; plan?: Plan; actions?: ReactNode }) => (
    <div className="page-head">
        <div>
            <h1>{title} {plan && <PlanTag plan={plan} />}</h1>
            {sub && <p>{sub}</p>}
        </div>
        {actions && <div className="actions">{actions}</div>}
    </div>
);

export const Card = ({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => (
    <div className={`card ${className}`} style={style}>{children}</div>
);

export const CardHead = ({ title, sub, link, onLink, plan }: { title: string; sub?: string; link?: string; onLink?: () => void; plan?: Plan }) => (
    <div className="card-head">
        <div>
            <h3>{title} {plan && <PlanTag plan={plan} />}</h3>
            {sub && <div className="sub">{sub}</div>}
        </div>
        {link && <button className="link" onClick={onLink}>{link}</button>}
    </div>
);

export const Kpi = ({ label, value, delta, tone, foot, icon }: { label: string; value: string | number; delta: string; tone: Tone; foot: string; icon: ReactNode }) => (
    <div className="card kpi">
        <div className="top"><span className="label">{label}</span><span className="ico">{icon}</span></div>
        <div className="value">{value}</div>
        <div className="foot"><Chip tone={tone}>{delta}</Chip>{foot}</div>
    </div>
);

export function Modal({ title, lead, onClose, children, footer, wide }: { title: string; lead?: string; onClose: () => void; children?: ReactNode; footer?: ReactNode; wide?: boolean }) {
    useEffect(() => {
        const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [onClose]);
    return (
        <div className="modal-bg" onMouseDown={onClose}>
            <div className="modal" style={wide ? { maxWidth: 760 } : undefined} onMouseDown={(e) => e.stopPropagation()}>
                <div className="row between"><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Fechar"><X size={20} /></button></div>
                {lead && <p className="lead">{lead}</p>}
                {children}
                {footer && <div className="footer">{footer}</div>}
            </div>
        </div>
    );
}

export function Drawer({ onClose, children }: { onClose: () => void; children: ReactNode }) {
    return (
        <div className="drawer-bg" onMouseDown={onClose}>
            <div className="drawer" onMouseDown={(e) => e.stopPropagation()}>
                <div className="row" style={{ justifyContent: 'flex-end' }}><button className="icon-btn" onClick={onClose} aria-label="Fechar"><X size={20} /></button></div>
                {children}
            </div>
        </div>
    );
}

export function Toasts() {
    const { toasts } = useStore();
    return (
        <div className="toasts">
            {toasts.map((t) => (
                <div key={t.id} className={`toast ${t.kind}`}>{t.kind === 'ok' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}{t.msg}</div>
            ))}
        </div>
    );
}

export function Pills<T extends string>({ items, value, onChange }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
    return (
        <div className="pills">
            {items.map((i) => <button key={i.id} className={`pill ${value === i.id ? 'on' : ''}`} onClick={() => onChange(i.id)}>{i.label}</button>)}
        </div>
    );
}

export function Pager({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
    if (pages <= 1) return null;
    return (
        <div className="pager">
            <button onClick={() => onChange(Math.max(1, page - 1))}>‹</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => <button key={p} className={p === page ? 'on' : ''} onClick={() => onChange(p)}>{p}</button>)}
            <button onClick={() => onChange(Math.min(pages, page + 1))}>›</button>
        </div>
    );
}

export const TypeBadge = ({ type, small }: { type: string; small?: boolean }) => <span className={`type-badge ${small ? 'sm' : ''}`}>{type}</span>;

export const Field = ({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) => (
    <div className="field"><label>{label}</label>{children}{hint && !error && <span className="hint">{hint}</span>}{error && <span className="err">{error}</span>}</div>
);

export const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
    <button type="button" className={`toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)} role="switch" aria-checked={on} />
);

export const downloadCsv = (name: string, rows: (string | number)[][]) => {
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
};

export const toneOfDonor = (s: string): Tone => (s === 'Apto' ? 'green' : s === 'Inapto temporário' ? 'amber' : s === 'Bloqueada' ? 'red' : 'gray');
export const toneOfTriage = (s: string): Tone => (s === 'Aprovado' ? 'green' : s === 'Bloqueado' ? 'red' : s === 'Em revisão' ? 'amber' : 'gray');
