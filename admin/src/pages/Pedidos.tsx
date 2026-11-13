import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Hospital, Megaphone, MapPin, User, X } from 'lucide-react';
import { Card, Chip, Field, Modal, PageHead, Pills, TypeBadge } from '../components/ui';
import { useStore } from '../state/store';
import { BLOOD, type RequestStatus, type Tone } from '../data/mock';

const tone = (s: RequestStatus): Tone => (s === 'Verificado' ? 'green' : s === 'Pendente' ? 'amber' : s === 'Atendido' ? 'blue' : 'red');
const COMPAT: Record<string, string[]> = { 'O-': ['O-'], 'O+': ['O+', 'O-'], 'A-': ['A-', 'O-'], 'A+': ['A+', 'A-', 'O+', 'O-'], 'B-': ['B-', 'O-'], 'B+': ['B+', 'B-', 'O+', 'O-'], 'AB-': ['AB-', 'A-', 'B-', 'O-'], 'AB+': [...BLOOD] };

export default function Requests() {
    const nav = useNavigate();
    const { requests, setRequestStatus, donors, toast } = useStore();
    const [tab, setTab] = useState<RequestStatus | 'Ativos'>('Pendente');
    const [selId, setSelId] = useState<number | null>(null);
    const [modal, setModal] = useState<'recusar' | 'notificar' | null>(null);
    const [reason, setReason] = useState('');
    const count = (s: RequestStatus) => requests.filter((r) => r.status === s).length;
    const list = requests.filter((r) => (tab === 'Ativos' ? r.status === 'Verificado' : r.status === tab));
    const sel = list.find((r) => r.id === selId) ?? list[0];
    const reach = sel ? donors.filter((d) => d.status === 'Apto' && COMPAT[sel.blood].includes(d.blood)).length * 38 + 120 : 0;
    return (
        <>
            <PageHead title="Pedidos de sangue" plan="mvp" sub="Solicitações publicadas no app por pacientes e familiares. Verifique e acompanhe o atendimento." />
            <Pills items={[{ id: 'Pendente' as const, label: `Pendentes ${count('Pendente')}` }, { id: 'Ativos' as const, label: `Ativos ${count('Verificado')}` }, { id: 'Atendido' as const, label: `Atendidos ${count('Atendido') + 91}` }, { id: 'Recusado' as const, label: `Recusados ${count('Recusado')}` }]} value={tab} onChange={(v) => { setTab(v); setSelId(null); }} />
            <div className="grid mt" style={{ gridTemplateColumns: '1fr 420px', alignItems: 'start' }}>
                <div className="grid">
                    {list.length === 0 && <Card><div className="empty">Nenhum pedido nesta aba.</div></Card>}
                    {list.map((r) => (
                        <button key={r.id} className={`sel-card ${sel?.id === r.id ? 'on' : ''}`} style={{ padding: 20 }} onClick={() => setSelId(r.id)}>
                            <div className="row" style={{ gap: 18, alignItems: 'flex-start' }}>
                                <span className="type-badge" style={{ width: 70, height: 70, fontSize: 24 }}>{r.blood}</span>
                                <div style={{ flex: 1 }}>
                                    <b style={{ fontSize: 15 }}>{r.title}</b>
                                    <div className="row small" style={{ marginTop: 8, color: 'var(--text-2)' }}><Hospital size={16} color="#e0323c" />{r.hospital} · {r.city}</div>
                                    <div className="row small" style={{ marginTop: 6, color: 'var(--text-2)' }}><User size={16} />{r.requester} · {r.when}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}><Chip tone={tone(r.status)}>{r.status}</Chip><div style={{ color: 'var(--primary)', fontWeight: 800, marginTop: 12 }}>{r.bags} {r.bags > 1 ? 'bolsas' : 'bolsa'}</div></div>
                            </div>
                        </button>
                    ))}
                </div>
                {sel && (
                    <Card>
                        <div className="row between"><h3 style={{ fontSize: 17 }}>Pedido #{sel.id}</h3><Chip tone={tone(sel.status)}>{sel.status}</Chip></div>
                        <b style={{ display: 'block', margin: '16px 0 8px' }}>{sel.title}</b>
                        <p className="small" style={{ color: 'var(--text-2)', lineHeight: 1.5 }}>“{sel.desc}”</p>
                        <dl className="dl" style={{ marginTop: 10 }}>
                            <dt>Hospital</dt><dd>{sel.hospital}</dd><dt>Cidade</dt><dd>{sel.city} · PE</dd><dt>Contato</dt><dd>{sel.contact}</dd><dt>Documento</dt><dd style={{ color: sel.doc.startsWith('Sem') ? 'var(--red)' : undefined }}>{sel.doc}</dd><dt>Compatíveis</dt><dd>{COMPAT[sel.blood].join(', ')}</dd>
                        </dl>
                        <div className="row" style={{ background: '#eaf0ec', borderRadius: 14, height: 90, justifyContent: 'center', margin: '16px 0', flexDirection: 'column', gap: 4 }}><MapPin color="#e0323c" /><span className="small muted">{sel.hospital} · 3,2 km do hemocentro</span></div>
                        {sel.reason && <div className="note red" style={{ marginBottom: 12 }}><span><b>Motivo da recusa:</b> {sel.reason}</span></div>}
                        {sel.status === 'Pendente' && <div className="grid">
                            <button className="btn lg" onClick={() => setRequestStatus(sel.id, 'Verificado')}><BadgeCheck size={20} />Verificar pedido</button>
                            <div className="grid g2"><button className="btn lg outline" onClick={() => setModal('notificar')}><Megaphone size={18} />Notificar doadores</button><button className="btn lg danger" onClick={() => { setReason(''); setModal('recusar'); }}><X size={18} />Recusar</button></div>
                        </div>}
                        {sel.status === 'Verificado' && <div className="grid">
                            <button className="btn lg" onClick={() => setModal('notificar')}><Megaphone size={18} />Notificar doadores compatíveis</button>
                            <button className="btn lg outline" onClick={() => { setRequestStatus(sel.id, 'Atendido'); setSelId(null); }}>Marcar como atendido</button>
                        </div>}
                    </Card>
                )}
            </div>
            {modal === 'recusar' && sel && (
                <Modal title="Recusar pedido" lead="O solicitante verá o motivo no app." onClose={() => setModal(null)}
                    footer={<><button className="btn ghost" onClick={() => setModal(null)}>Cancelar</button><button className="btn danger" disabled={reason.trim().length < 5} onClick={() => { setRequestStatus(sel.id, 'Recusado', reason); setModal(null); setSelId(null); }}>Recusar pedido</button></>}>
                    <Field label="Motivo (obrigatório)"><textarea className="textarea" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ex.: laudo ilegível, hospital não confirmou o paciente…" /></Field>
                </Modal>
            )}
            {modal === 'notificar' && sel && (
                <Modal title="Notificar doadores compatíveis" lead={`Pedido #${sel.id} · ${sel.blood} · ${sel.hospital}`} onClose={() => setModal(null)}
                    footer={<><button className="btn ghost" onClick={() => setModal(null)}>Cancelar</button><button className="btn" onClick={() => { toast(`Aviso enviado para ${reach} doadores aptos de ${COMPAT[sel.blood].join(', ')}.`); setModal(null); }}>Enviar aviso</button></>}>
                    <div className="note red" style={{ alignItems: 'center' }}><TypeBadge type={sel.blood} small /><div><b style={{ fontSize: 16, color: '#222' }}>≈ {reach} doadores</b><div className="small">aptos hoje, compatíveis com {sel.blood} e num raio de 30 km.</div></div></div>
                    <p className="small muted mt">Só doadores que aceitaram receber avisos são notificados. Os dados do paciente não são compartilhados.</p>
                </Modal>
            )}
        </>
    );
}
