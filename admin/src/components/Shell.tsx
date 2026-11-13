import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Bell, CalendarDays, ChevronDown, ClipboardCheck, Droplets, FilePenLine, Hospital, LayoutDashboard, LogOut, Megaphone, ScanLine,
    Search, Settings, ShieldCheck, UserCog, Users, HandHeart, ChartColumn, RotateCcw, Repeat,
} from 'lucide-react';
import { useStore } from '../state/store';
import { UNITS, NOTIFICATIONS, initials, type Plan } from '../data/mock';
import { Logo } from './Logo';
import { Toasts } from './ui';

interface NavItem { to: string; label: string; icon: typeof Bell; plan: Plan }
const GROUPS: { title: string; items: NavItem[] }[] = [
    { title: 'OPERAÇÃO', items: [
        { to: '/visao-geral', label: 'Visão geral', icon: LayoutDashboard, plan: 'mvp' },
        { to: '/triagens', label: 'Triagens', icon: ClipboardCheck, plan: 'mvp' },
        { to: '/correcoes', label: 'Correções', icon: FilePenLine, plan: 'mvp' },
        { to: '/agenda', label: 'Agenda', icon: CalendarDays, plan: 'fase2' },
        { to: '/atendimento', label: 'Atendimento', icon: ScanLine, plan: 'mvp' },
    ] },
    { title: 'BANCO DE SANGUE', items: [
        { to: '/estoque', label: 'Estoque', icon: Droplets, plan: 'fase2' },
        { to: '/pedidos', label: 'Pedidos de sangue', icon: HandHeart, plan: 'mvp' },
    ] },
    { title: 'COMUNIDADE', items: [
        { to: '/doadores', label: 'Doadores', icon: Users, plan: 'mvp' },
        { to: '/campanhas', label: 'Campanhas', icon: Megaphone, plan: 'mvp' },
    ] },
    { title: 'GESTÃO', items: [
        { to: '/relatorios', label: 'Relatórios', icon: ChartColumn, plan: 'fase2' },
        { to: '/equipe', label: 'Equipe', icon: UserCog, plan: 'mvp' },
        { to: '/auditoria', label: 'Auditoria', icon: ShieldCheck, plan: 'mvp' },
        { to: '/configuracoes', label: 'Configurações', icon: Settings, plan: 'fase2' },
    ] },
];

export const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

function GlobalSearch({ onClose }: { onClose: () => void }) {
    const { donors } = useStore();
    const nav = useNavigate();
    const [q, setQ] = useState('');
    const results = useMemo(() => {
        const s = q.trim().toLowerCase();
        const pages = ALL_ITEMS.filter((i) => !s || i.label.toLowerCase().includes(s)).map((i) => ({ key: i.to, label: i.label, sub: 'Página', to: i.to }));
        const people = s ? donors.filter((d) => d.name.toLowerCase().includes(s) || d.cpf.includes(s)).slice(0, 5).map((d) => ({ key: 'd' + d.id, label: d.name, sub: `Doador · ${d.blood} · ${d.city}`, to: `/doadores?busca=${encodeURIComponent(d.name)}` })) : [];
        return [...people, ...pages].slice(0, 9);
    }, [q, donors]);
    return (
        <div className="cmd" onMouseDown={onClose}>
            <div className="box" onMouseDown={(e) => e.stopPropagation()}>
                <input autoFocus placeholder="Buscar doador, CPF ou página…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); if (e.key === 'Enter' && results[0]) { nav(results[0].to); onClose(); } }} />
                <div className="res">
                    {results.length === 0 && <div className="empty">Nada encontrado.</div>}
                    {results.map((r) => (
                        <button key={r.key} onClick={() => { nav(r.to); onClose(); }}><b>{r.label}</b><span className="muted small right">{r.sub}</span></button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Shell() {
    const { authed, unit, unitId, chooseUnit, logout, review, setReview, pendingCorrections, resetDemo } = useStore();
    const nav = useNavigate();
    const loc = useLocation();
    const [menu, setMenu] = useState<'unit' | 'bell' | 'user' | null>(null);
    const [search, setSearch] = useState(false);
    const topRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMenu(null); document.querySelector('.content')?.scrollTo(0, 0); }, [loc.pathname]);
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch(true); } };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, []);
    useEffect(() => {
        const h = (e: MouseEvent) => { if (topRef.current && !topRef.current.contains(e.target as Node)) setMenu(null); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    if (!authed) return <Navigate to="/login" replace />;

    return (
        <div className="shell">
            <aside className="sidebar">
                <div className="brand"><Logo width={130} color="#fff" /><small>PAINEL DO<br />AGENTE</small></div>
                {GROUPS.map((g) => (
                    <div className="nav-group" key={g.title}>
                        <h4>{g.title}</h4>
                        {g.items.map((i) => (
                            <NavLink key={i.to} to={i.to} className={({ isActive }) => `nav-item ${isActive || loc.pathname.startsWith(i.to + '/') ? 'active' : ''}`}>
                                <i.icon size={22} />{i.label}
                                {i.to === '/correcoes' && pendingCorrections > 0 && <span className="count">{pendingCorrections}</span>}
                                {review && i.plan === 'fase2' && <span className="plan-dot" title="Fase 2" />}
                            </NavLink>
                        ))}
                    </div>
                ))}
                <div className="agent">
                    <span className="avatar">ML</span>
                    <div className="info"><b>Dra. Marina Lopes</b><span>Agente de saúde<br />{unit.name.replace('Hemocentro ', 'Hemocentro ')}</span></div>
                    <button className="icon-btn" title="Sair" onClick={() => { logout(); nav('/login'); }} style={{ color: '#a89f95' }}><LogOut size={20} /></button>
                </div>
            </aside>
            <div className="main">
                <div className="review-bar">
                    <b>Protótipo navegável</b> · dados fictícios, nada é salvo no servidor. Use para revisar fluxos e telas.
                    <label><input type="checkbox" checked={review} onChange={(e) => setReview(e.target.checked)} /> Mostrar MVP / Fase 2</label>
                </div>
                <div className="topbar" ref={topRef}>
                    <div className="spacer" />
                    <div style={{ position: 'relative' }}>
                        <button className="unit-pill" onClick={() => setMenu(menu === 'unit' ? null : 'unit')}><Hospital size={20} color="#e0323c" />{unit.short}<ChevronDown size={18} color="#888" /></button>
                        {menu === 'unit' && (
                            <div className="menu"><h5>TROCAR DE UNIDADE</h5>
                                {UNITS.map((u) => <button key={u.id} onClick={() => { chooseUnit(u.id); setMenu(null); }}><b>{u.short}</b>{u.id === unitId && <span className="chip green right">atual</span>}</button>)}
                            </div>
                        )}
                    </div>
                    <button className="icon-btn" onClick={() => setSearch(true)} title="Buscar (Ctrl+K)"><Search size={22} /></button>
                    <div style={{ position: 'relative' }}>
                        <button className="icon-btn" onClick={() => setMenu(menu === 'bell' ? null : 'bell')}><Bell size={22} /><span className="dot" /></button>
                        {menu === 'bell' && (
                            <div className="menu"><h5>NOTIFICAÇÕES</h5>
                                {NOTIFICATIONS.map((n) => <button key={n.id} onClick={() => nav(n.to)}><span className={`chip ${n.tone}`} style={{ padding: '0 8px' }}>•</span>{n.text}</button>)}
                            </div>
                        )}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button className="avatar" onClick={() => setMenu(menu === 'user' ? null : 'user')}>{initials('Marina Lopes')}</button>
                        {menu === 'user' && (
                            <div className="menu"><h5>Dra. Marina Lopes · {unit.role}</h5>
                                <button onClick={() => nav('/equipe')}><UserCog size={18} />Equipe e permissões</button>
                                <button onClick={() => { nav('/unidade'); }}><Repeat size={18} />Trocar de unidade</button>
                                <button onClick={() => { resetDemo(); setMenu(null); }}><RotateCcw size={18} />Restaurar dados de demonstração</button>
                                <button onClick={() => { logout(); nav('/login'); }}><LogOut size={18} />Sair</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="content"><Outlet /></div>
            </div>
            {search && <GlobalSearch onClose={() => setSearch(false)} />}
            <Toasts />
        </div>
    );
}
