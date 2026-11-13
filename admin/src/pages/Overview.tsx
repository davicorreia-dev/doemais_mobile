import { useNavigate } from 'react-router-dom';
import { CalendarDays, CircleCheck, Clock3, Droplet, FilePenLine, Megaphone, Plus, Timer, TriangleAlert, Users } from 'lucide-react';
import { Card, CardHead, Chip, Kpi, PageHead } from '../components/ui';
import { useStore } from '../state/store';
import { BLOOD, donorById, type ApptStatus, type Tone } from '../data/mock';

const WEEK = [['Sex', 38], ['Sáb', 52], ['Dom', 44], ['Seg', 61], ['Ter', 57], ['Qua', 29], ['Qui', 18]] as [string, number][];
const apptTone = (s: ApptStatus): Tone => (s === 'Confirmado' ? 'blue' : s === 'Compareceu' ? 'green' : s === 'Faltou' ? 'red' : 'gray');
const level = (v: number) => (v < 20 ? '#c62828' : v < 100 ? '#d58a18' : '#2e7d32');

export default function Overview() {
    const nav = useNavigate();
    const { stock, appts, pendingCorrections, corrections, requests, unit } = useStore();
    const today = appts.filter((a) => a.day === 3).sort((a, b) => a.hour.localeCompare(b.hour));
    const confirmed = today.filter((a) => a.status === 'Confirmado' || a.status === 'Compareceu').length;
    const critical = BLOOD.filter((t) => stock[t] < 20);
    const late = corrections.filter((c) => c.status === 'PENDING_REVIEW' && c.hoursAgo > 48).length;
    const pendingReq = requests.filter((r) => r.status === 'Pendente').length;
    const total = Object.values(stock).reduce((a, b) => a + b, 0);
    return (
        <>
            <PageHead title="Visão geral" plan="mvp" sub={`Quinta-feira, 12 de novembro de 2026 · ${unit.name}`}
                actions={<button className="btn" onClick={() => nav('/agenda')}><Plus size={18} />Novo agendamento</button>} />
            <div className="grid g4">
                <Kpi label="Doadores aptos hoje" value={128} delta="+12%" tone="green" foot="vs. ontem" icon={<Users size={22} />} />
                <Kpi label="Agendamentos hoje" value={46} delta={`${Math.max(confirmed, 38)} confirmados`} tone="blue" foot="8 aguardando" icon={<CalendarDays size={22} />} />
                <Kpi label="Bolsas em estoque" value={total} delta={`${critical.length} críticos`} tone={critical.length ? 'red' : 'green'} foot="tipos abaixo de 20" icon={<Droplet size={22} />} />
                <Kpi label="Correções pendentes" value={pendingCorrections} delta={`${late} há +48h`} tone={late ? 'amber' : 'green'} foot="meta: 24h" icon={<FilePenLine size={22} />} />
            </div>
            <div className="grid mt" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                <Card>
                    <CardHead title="Triagens enviadas nos últimos 7 dias" sub="Total: 299 · média 43 por dia" />
                    <div className="bars">
                        {WEEK.map(([d, v], i) => (
                            <div key={d} className={`col ${i === 6 ? 'today' : ''}`}><b>{v}</b><i style={{ height: `${(v / 70) * 100}%` }} /><span>{d}</span></div>
                        ))}
                    </div>
                </Card>
                <Card>
                    <CardHead title="Estoque por tipo sanguíneo" sub="Meta de 100 bolsas por tipo" link="Ver estoque" onLink={() => nav('/estoque')} plan="fase2" />
                    {BLOOD.map((t) => (
                        <div className="hbar" key={t}>
                            <b>{t}</b>
                            <div className="track"><div className="fill" style={{ width: `${Math.min(100, stock[t])}%`, background: level(stock[t]) }} /></div>
                            <b style={{ color: level(stock[t]), fontSize: 12 }}>{stock[t]} bolsas</b>
                        </div>
                    ))}
                </Card>
            </div>
            <div className="grid mt" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <Card>
                    <CardHead title="Agenda de hoje" link="Ver agenda completa" onLink={() => nav('/agenda')} plan="fase2" />
                    {today.slice(0, 5).map((a) => {
                        const d = donorById(a.donorId);
                        return (
                            <div className="list-item" key={a.id}>
                                <b style={{ color: 'var(--primary)', width: 54 }}>{a.hour}</b>
                                <div style={{ flex: 1 }}><b>{d.name}</b><div className="muted small">{a.first ? 'Primeira doação' : 'Doação de repetição'}</div></div>
                                <Chip tone={apptTone(a.status)}>{a.status}</Chip>
                            </div>
                        );
                    })}
                </Card>
                <Card>
                    <CardHead title="Alertas e pendências" plan="mvp" />
                    {critical.length > 0 && <button className="alert red" onClick={() => nav('/estoque')}><TriangleAlert size={22} /><div><b>Estoque crítico: {critical.join(' e ')}</b><span>Menos de 3 dias de cobertura. Sugerimos disparar campanha.</span></div></button>}
                    <button className="alert amber" onClick={() => nav('/estoque')}><Timer size={22} /><div><b>14 bolsas vencem em 5 dias</b><span>Priorize a saída de A+ e B+ para os hospitais parceiros.</span></div></button>
                    <button className="alert amber" onClick={() => nav('/correcoes')}><FilePenLine size={22} /><div><b>{pendingCorrections} correções aguardando análise</b><span>{late} estão acima de 48h (meta: 24h).</span></div></button>
                    <button className="alert blue" onClick={() => nav('/pedidos')}><Clock3 size={22} /><div><b>{pendingReq} pedidos de sangue para verificar</b><span>Confirme o laudo antes de avisar os doadores compatíveis.</span></div></button>
                    <button className="alert green" onClick={() => nav('/campanhas')}><Megaphone size={22} /><div><b>Campanha “Semana do O-” teve 32 agendamentos</b><span>Veja os resultados e programe a próxima.</span></div></button>
                    <span className="hidden"><CircleCheck /></span>
                </Card>
            </div>
        </>
    );
}
