import { useState } from 'react';
import { Bell, Lock, Plus } from 'lucide-react';
import { Card, Chip, Field, Modal, PageHead } from '../components/ui';
import { useStore } from '../state/store';
import { HOURS, WEEK_DAYS, donorById, type ApptStatus, type Tone } from '../data/mock';

const tone = (s: ApptStatus): 'blue' | 'green' | 'red' | 'gray' => (s === 'Confirmado' || s === 'Agendado' ? 'blue' : s === 'Compareceu' ? 'green' : s === 'Faltou' ? 'red' : 'gray');
const chipTone = (s: ApptStatus): Tone => (tone(s) as Tone);

export default function Agenda() {
    const { appts, donors, addAppt, setApptStatus, toast } = useStore();
    const [view, setView] = useState<'Dia' | 'Semana' | 'Mês'>('Semana');
    const [slot, setSlot] = useState<{ day: number; hour: string } | null>(null);
    const [donor, setDonor] = useState(donors[0].id);
    const [sel, setSel] = useState<number | null>(null);
    const today = appts.filter((a) => a.day === 3);
    const count = (s: ApptStatus) => today.filter((a) => a.status === s).length;
    const next = today.filter((a) => a.status === 'Agendado' || a.status === 'Confirmado').sort((a, b) => a.hour.localeCompare(b.hour)).slice(0, 3);
    const selAppt = appts.find((a) => a.id === sel);
    return (
        <>
            <PageHead title="Agenda" plan="fase2" sub="Semana de 9 a 15 de novembro de 2026 · capacidade de 60 doações por dia"
                actions={<><div className="seg">{(['Dia', 'Semana', 'Mês'] as const).map((v) => <button key={v} className={`pill ${view === v ? 'on' : ''}`} onClick={() => { setView(v); if (v !== 'Semana') toast(`Visão “${v}” ainda não desenhada neste protótipo.`, 'err'); }}>{v}</button>)}</div><button className="btn" onClick={() => setSlot({ day: 3, hour: '14:00' })}><Plus size={18} />Novo agendamento</button></>} />
            <div className="grid" style={{ gridTemplateColumns: '1fr 320px', alignItems: 'start' }}>
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="week">
                        <div className="head" />
                        {WEEK_DAYS.map((d, i) => <div key={d.date} className={`head ${i === 3 ? 'today' : ''}`}><span>{d.label}</span><b>{d.date}</b></div>)}
                        {HOURS.map((h) => (
                            <div key={h} style={{ display: 'contents' }}>
                                <div className="hour">{h}</div>
                                {WEEK_DAYS.map((_, di) => (
                                    <div key={di} className="slot" onClick={() => setSlot({ day: di, hour: h })}>
                                        {appts.filter((a) => a.day === di && a.hour === h).map((a) => (
                                            <button key={a.id} className={`appt ${tone(a.status)}`} onClick={(e) => { e.stopPropagation(); setSel(a.id); }}>
                                                <b>{donorById(a.donorId).name.split(' ').slice(0, 2).join(' ')}</b>{donorById(a.donorId).blood} · {a.first ? '1ª doação' : a.status}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </Card>
                <Card>
                    <h3>Quinta, 12 de novembro</h3>
                    <p className="small muted" style={{ margin: '6px 0 10px' }}>{today.length + 40} de 60 vagas ocupadas</p>
                    <div className="hbar" style={{ gridTemplateColumns: '1fr' }}><div className="track"><div className="fill" style={{ width: `${((today.length + 40) / 60) * 100}%`, background: 'var(--primary)' }} /></div></div>
                    {([['Confirmados', count('Confirmado') + 32, '#1e4fa3'], ['Aguardando confirmação', count('Agendado') + 7, '#8a5a13'], ['Compareceram', count('Compareceu') + 11, '#2e7d32'], ['Faltas', count('Faltou') + 2, '#c62828']] as const).map(([l, v, c]) => (
                        <div key={l} className="row between" style={{ padding: '12px 0' }}><span className="row"><i style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />{l}</span><b>{v}</b></div>
                    ))}
                    <h4 style={{ margin: '14px 0 4px' }}>Próximos atendimentos</h4>
                    {next.map((a) => <div className="list-item" key={a.id}><b style={{ color: 'var(--primary)' }}>{a.hour}</b><div><b>{donorById(a.donorId).name}</b><div className="small muted">{a.status}</div></div></div>)}
                    <div className="grid mt"><button className="btn ghost" onClick={() => toast('Horário bloqueado (simulado).')}><Lock size={18} />Bloquear horário</button><button className="btn outline" onClick={() => toast(`${count('Agendado') + 7} lembretes enviados.`)}><Bell size={18} />Enviar lembretes ({count('Agendado') + 7})</button></div>
                </Card>
            </div>
            {slot && (
                <Modal title="Novo agendamento" lead={`${WEEK_DAYS[slot.day].label} ${WEEK_DAYS[slot.day].date}/11 às ${slot.hour}`} onClose={() => setSlot(null)}
                    footer={<><button className="btn ghost" onClick={() => setSlot(null)}>Cancelar</button><button className="btn" onClick={() => { addAppt(donor, slot.day, slot.hour); setSlot(null); }}>Agendar</button></>}>
                    <div className="grid">
                        <Field label="Doador"><select className="select" value={donor} onChange={(e) => setDonor(Number(e.target.value))}>{donors.filter((d) => d.status === 'Apto' || d.status === 'Em triagem').map((d) => <option key={d.id} value={d.id}>{d.name} · {d.blood}</option>)}</select></Field>
                        <div className="grid g2"><Field label="Dia"><select className="select" value={slot.day} onChange={(e) => setSlot({ ...slot, day: Number(e.target.value) })}>{WEEK_DAYS.map((w, i) => <option key={i} value={i}>{w.label} {w.date}/11</option>)}</select></Field>
                            <Field label="Horário"><select className="select" value={slot.hour} onChange={(e) => setSlot({ ...slot, hour: e.target.value })}>{HOURS.map((h) => <option key={h}>{h}</option>)}</select></Field></div>
                    </div>
                </Modal>
            )}
            {selAppt && (
                <Modal title={donorById(selAppt.donorId).name} lead={`${WEEK_DAYS[selAppt.day].label} ${WEEK_DAYS[selAppt.day].date}/11 às ${selAppt.hour} · ${donorById(selAppt.donorId).blood}`} onClose={() => setSel(null)}
                    footer={<button className="btn ghost" onClick={() => setSel(null)}>Fechar</button>}>
                    <p className="small muted" style={{ marginBottom: 10 }}>Situação atual: <Chip tone={chipTone(selAppt.status)}>{selAppt.status}</Chip></p>
                    <div className="pills">{(['Agendado', 'Confirmado', 'Compareceu', 'Faltou', 'Cancelado'] as ApptStatus[]).map((s) => <button key={s} className={`pill ${selAppt.status === s ? 'on' : ''}`} onClick={() => { setApptStatus(selAppt.id, s); setSel(null); }}>{s}</button>)}</div>
                </Modal>
            )}
        </>
    );
}
