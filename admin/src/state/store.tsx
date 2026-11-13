import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
    APPOINTMENTS, AUDIT_SEED, BAGS, CAMPAIGNS, CORRECTIONS, DONORS, MEMBERS, REQUESTS, STOCK_BASE, TRIAGES, UNITS,
    type Appt, type ApptStatus, type AuditEntry, type Bag, type BloodRequest, type Campaign, type Correction, type Donor, type Member,
    type RequestStatus, type Role, type Triage,
} from '../data/mock';

export type ToastKind = 'ok' | 'err';
interface Toast { id: number; msg: string; kind: ToastKind }
export interface QueueItem { donorId: number; status: 'Aguardando' | 'Em triagem' | 'Em coleta' | 'Concluída' }
export interface UnitConfig { name: string; address: string; phone: string; hours: string; slots: Record<string, number>; menInterval: number; womenInterval: number; hemoglobin: number; weight: number; bagValidity: number; slaHours: number; minStock: number; expiryAlert: number }

const SESSION_KEY = 'doemais-admin-session';
const loadSession = () => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') as { unit: string } | null; } catch { return null; }
};

const DEFAULT_CONFIG: UnitConfig = {
    name: 'Hemocentro Recife (sede)', address: 'Av. Joaquim Nabuco, 171 · Graças · Recife', phone: '(81) 3181-0000', hours: 'Seg–Sáb · 07h às 19h',
    slots: { '07:00–10:00': 20, '10:00–13:00': 20, '13:00–16:00': 12, '16:00–19:00': 8 },
    menInterval: 60, womenInterval: 90, hemoglobin: 12.5, weight: 50, bagValidity: 42, slaHours: 24, minStock: 100, expiryAlert: 7,
};

const initial = () => ({
    triages: TRIAGES.map((t) => ({ ...t })),
    corrections: CORRECTIONS.map((c) => ({ ...c })),
    donors: DONORS.map((d) => ({ ...d })),
    appts: APPOINTMENTS.map((a) => ({ ...a })),
    stock: { ...STOCK_BASE },
    bags: BAGS.map((b) => ({ ...b })),
    requests: REQUESTS.map((r) => ({ ...r })),
    campaigns: CAMPAIGNS.map((c) => ({ ...c })),
    members: MEMBERS.map((m) => ({ ...m })),
    audit: AUDIT_SEED.map((a) => ({ ...a })),
    queue: [
        { donorId: 2, status: 'Em coleta' }, { donorId: 4, status: 'Em triagem' }, { donorId: 5, status: 'Aguardando' },
        { donorId: 8, status: 'Aguardando' }, { donorId: 7, status: 'Aguardando' }, { donorId: 10, status: 'Aguardando' },
    ] as QueueItem[],
    config: { ...DEFAULT_CONFIG, slots: { ...DEFAULT_CONFIG.slots } },
});

interface Store {
    authed: boolean;
    unitId: string;
    unit: (typeof UNITS)[number];
    review: boolean;
    setReview: (v: boolean) => void;
    login: () => void;
    chooseUnit: (id: string) => void;
    logout: () => void;
    toasts: Toast[];
    toast: (msg: string, kind?: ToastKind) => void;
    log: (action: string, target: string, kind: AuditEntry['kind']) => void;
    triages: Triage[];
    corrections: Correction[];
    donors: Donor[];
    appts: Appt[];
    stock: Record<string, number>;
    bags: Bag[];
    requests: BloodRequest[];
    campaigns: Campaign[];
    members: Member[];
    audit: AuditEntry[];
    queue: QueueItem[];
    config: UnitConfig;
    pendingCorrections: number;
    decideTriage: (id: number, decision: 'apto' | 'inapto', opts?: { days?: number; note?: string }) => void;
    resolveCorrection: (id: number, status: 'APPROVED' | 'REJECTED', note: string) => void;
    addAppt: (donorId: number, day: number, hour: string) => void;
    setApptStatus: (id: number, status: ApptStatus) => void;
    setQueueStatus: (donorId: number, status: QueueItem['status']) => void;
    registerDonation: (donorId: number, ml: number, lot: string) => void;
    registerExit: (blood: string, qty: number, dest: string) => void;
    setRequestStatus: (id: number, status: RequestStatus, reason?: string) => void;
    addCampaign: (c: Omit<Campaign, 'id'>) => void;
    inviteMember: (m: Pick<Member, 'name' | 'email' | 'role' | 'unit' | 'title'>) => void;
    setMemberRole: (id: number, role: Role) => void;
    toggleMember: (id: number) => void;
    saveConfig: (c: UnitConfig) => void;
    resetDemo: () => void;
}

const Ctx = createContext<Store>(null as unknown as Store);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }: { children: ReactNode }) {
    const session = loadSession();
    const [authed, setAuthed] = useState(Boolean(session));
    const [unitId, setUnitId] = useState(session?.unit ?? 'rec');
    const [review, setReview] = useState(true);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [data, setData] = useState(initial);

    const toast = useCallback((msg: string, kind: ToastKind = 'ok') => {
        const id = Date.now() + Math.random();
        setToasts((t) => [...t, { id, msg, kind }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
    }, []);

    const log = useCallback((action: string, target: string, kind: AuditEntry['kind']) => {
        setData((d) => ({ ...d, audit: [{ id: Date.now(), at: 'agora', agent: 'Dra. Marina Lopes', action, target, origin: '187.34.xx.xx', kind }, ...d.audit] }));
    }, []);

    const patch = <K extends keyof ReturnType<typeof initial>>(key: K, fn: (v: ReturnType<typeof initial>[K]) => ReturnType<typeof initial>[K]) =>
        setData((d) => ({ ...d, [key]: fn(d[key]) }));

    const store = useMemo<Store>(() => {
        const unit = UNITS.find((u) => u.id === unitId) ?? UNITS[0];
        const donorName = (id: number) => data.donors.find((x) => x.id === id)?.name ?? '';
        return {
            authed, unitId, unit, review, setReview, toasts, toast, log,
            ...data,
            pendingCorrections: data.corrections.filter((c) => c.status === 'PENDING_REVIEW').length,
            login: () => { setAuthed(true); },
            chooseUnit: (id) => { setUnitId(id); setAuthed(true); localStorage.setItem(SESSION_KEY, JSON.stringify({ unit: id })); },
            logout: () => { setAuthed(false); localStorage.removeItem(SESSION_KEY); },
            decideTriage: (id, decision, opts) => {
                const t = data.triages.find((x) => x.id === id)!;
                patch('triages', (arr) => arr.map((x) => (x.id === id ? { ...x, status: decision === 'apto' ? 'Aprovado' : 'Bloqueado', note: decision === 'apto' ? 'Aprovada pelo agente.' : `Inapto temporário por ${opts?.days ?? 30} dias. ${opts?.note ?? ''}` } : x)));
                patch('donors', (arr) => arr.map((x) => (x.id === t.donorId ? { ...x, status: decision === 'apto' ? 'Apto' : 'Inapto temporário', until: decision === 'apto' ? undefined : `em ${opts?.days ?? 30} dias` } : x)));
                log(decision === 'apto' ? 'Aprovou triagem como apto' : `Marcou inapto temporário (${opts?.days ?? 30}d)`, donorName(t.donorId), 'Decisões');
                toast(decision === 'apto' ? 'Doador marcado como apto.' : 'Inaptidão temporária registrada.');
            },
            resolveCorrection: (id, status, note) => {
                const c = data.corrections.find((x) => x.id === id)!;
                patch('corrections', (arr) => arr.map((x) => (x.id === id ? { ...x, status, note, responsible: 'Dra. Marina Lopes', resolvedAt: 'agora' } : x)));
                if (status === 'APPROVED') {
                    patch('triages', (arr) => arr.map((x) => (x.donorId === c.donorId && x.status === 'Em revisão' ? { ...x, status: 'Aprovado' } : x)));
                    patch('donors', (arr) => arr.map((x) => (x.id === c.donorId && x.status === 'Bloqueada' ? { ...x, status: 'Apto' } : x)));
                }
                log(`${status === 'APPROVED' ? 'Aprovou' : 'Recusou'} correção #${id}`, `${donorName(c.donorId)} · ${c.module}`, 'Decisões');
                toast(status === 'APPROVED' ? `Correção #${id} aprovada.` : `Correção #${id} recusada.`);
            },
            addAppt: (donorId, day, hour) => {
                patch('appts', (arr) => [...arr, { id: Date.now(), donorId, day, hour, status: 'Agendado', first: (data.donors.find((x) => x.id === donorId)?.donations ?? 0) === 0 }]);
                log('Criou agendamento', `${donorName(donorId)} · ${hour}`, 'Decisões');
                toast('Agendamento criado.');
            },
            setApptStatus: (id, status) => {
                patch('appts', (arr) => arr.map((a) => (a.id === id ? { ...a, status } : a)));
                toast(`Agendamento marcado como ${status.toLowerCase()}.`);
            },
            setQueueStatus: (donorId, status) => patch('queue', (arr) => (arr.some((q) => q.donorId === donorId) ? arr.map((q) => (q.donorId === donorId ? { ...q, status } : q)) : [...arr, { donorId, status }])),
            registerDonation: (donorId, ml, lot) => {
                const d = data.donors.find((x) => x.id === donorId)!;
                patch('stock', (s) => ({ ...s, [d.blood]: (s[d.blood] ?? 0) + 1 }));
                patch('bags', (b) => [{ lot, blood: d.blood, collected: '12 nov', expires: '24 dez', origin: 'Hemocentro Recife', status: 'Disponível' as const }, ...b]);
                patch('donors', (arr) => arr.map((x) => (x.id === donorId ? { ...x, donations: x.donations + 1, lastDonation: '12 nov 2026', status: 'Inapto temporário', until: '11 jan 2027' } : x)));
                patch('queue', (arr) => arr.map((q) => (q.donorId === donorId ? { ...q, status: 'Concluída' } : q)));
                log(`Registrou doação (${ml} mL)`, `${d.name} · ${lot}`, 'Decisões');
                toast(`Doação registrada. Estoque ${d.blood}: +1 bolsa.`);
            },
            registerExit: (blood, qty, dest) => {
                patch('stock', (s) => ({ ...s, [blood]: Math.max(0, (s[blood] ?? 0) - qty) }));
                log(`Registrou saída de ${qty} bolsa(s) ${blood}`, dest, 'Decisões');
                toast(`Saída registrada: ${qty} × ${blood} para ${dest}.`);
            },
            setRequestStatus: (id, status, reason) => {
                patch('requests', (arr) => arr.map((r) => (r.id === id ? { ...r, status, reason } : r)));
                log(`${status === 'Verificado' ? 'Verificou' : status === 'Recusado' ? 'Recusou' : 'Atualizou'} pedido #${id}`, 'Pedidos de sangue', 'Decisões');
                toast(`Pedido #${id}: ${status.toLowerCase()}.`);
            },
            addCampaign: (c) => {
                patch('campaigns', (arr) => [{ ...c, id: Date.now() }, ...arr]);
                log(c.status === 'Programada' ? 'Programou campanha' : c.status === 'Rascunho' ? 'Salvou rascunho de campanha' : 'Enviou campanha', c.title, 'Decisões');
                toast(c.status === 'Concluída' ? `Campanha enviada para ${c.reach} doadores.` : c.status === 'Programada' ? 'Campanha programada.' : 'Rascunho salvo.');
            },
            inviteMember: (m) => {
                patch('members', (arr) => [...arr, { id: Date.now(), ...m, twofa: false, lastAccess: '—', status: 'Convite pendente' as const }]);
                log('Convidou agente', `${m.name} (${m.role})`, 'Decisões');
                toast(`Convite enviado para ${m.email}.`);
            },
            setMemberRole: (id, role) => {
                const m = data.members.find((x) => x.id === id)!;
                patch('members', (arr) => arr.map((x) => (x.id === id ? { ...x, role } : x)));
                log('Alterou papel de usuário', `${m.name} → ${role}`, 'Decisões');
                toast(`${m.name} agora é ${role}.`);
            },
            toggleMember: (id) => {
                const m = data.members.find((x) => x.id === id)!;
                patch('members', (arr) => arr.map((x) => (x.id === id ? { ...x, status: x.status === 'Inativo' ? 'Ativo' : 'Inativo' } : x)));
                log(m.status === 'Inativo' ? 'Reativou usuário' : 'Desativou usuário', m.name, 'Acessos');
                toast(m.status === 'Inativo' ? 'Usuário reativado.' : 'Usuário desativado.');
            },
            saveConfig: (c) => {
                setData((d) => ({ ...d, config: c }));
                log('Alterou configurações da unidade', c.name, 'Decisões');
                toast('Configurações salvas.');
            },
            resetDemo: () => { setData(initial()); toast('Dados de demonstração restaurados.'); },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authed, unitId, review, toasts, data, toast, log]);

    return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}
