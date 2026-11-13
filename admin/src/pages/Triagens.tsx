import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Ban, CalendarPlus, CircleCheck, Clock3, Search } from 'lucide-react';
import { Avatar, Card, CardHead, Chip, Field, Modal, Pager, PageHead, PlanTag, toneOfTriage, TypeBadge } from '../components/ui';
import { useStore } from '../state/store';
import { HOURS, MODULES, WEEK_DAYS, donorById, okAnswer, type TriageStatus } from '../data/mock';

type Filter = 'Todas' | TriageStatus;
const PAGE = 8;

export function Triages() {
    const nav = useNavigate();
    const { triages } = useStore();
    const [filter, setFilter] = useState<Filter>('Todas');
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const count = (f: Filter) => (f === 'Todas' ? triages.length : triages.filter((t) => t.status === f).length);
    const rows = useMemo(() => {
        const s = q.trim().toLowerCase();
        return triages.filter((t) => (filter === 'Todas' || t.status === filter) && (!s || donorById(t.donorId).name.toLowerCase().includes(s) || donorById(t.donorId).cpf.includes(s)));
    }, [triages, filter, q]);
    const pages = Math.max(1, Math.ceil(rows.length / PAGE));
    const shown = rows.slice((page - 1) * PAGE, page * PAGE);
    const filters: Filter[] = ['Todas', 'Aprovado', 'Bloqueado', 'Em revisão', 'Pendente'];
    return (
        <>
            <PageHead title="Triagens" plan="mvp" sub="Acompanhe as triagens enviadas pelos doadores e valide os casos que pedem atenção." />
            <div className="row" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
                <div className="pills">
                    {filters.map((f) => <button key={f} className={`pill ${filter === f ? 'on' : ''}`} onClick={() => { setFilter(f); setPage(1); }}>{f === 'Todas' ? 'Todas' : f + 's'.replace('Aprovados', 'Aprovadas')}  {count(f)}</button>)}
                </div>
                <div className="input-wrap right" style={{ width: 320 }}><Search size={20} style={{ top: 12 }} /><input className="input" style={{ height: 44 }} placeholder="Buscar nome ou CPF" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div>
            </div>
            <Card style={{ padding: 0 }}>
                <table>
                    <thead><tr><th>DOADOR</th><th>TIPO</th><th>MÓDULOS CONCLUÍDOS</th><th>ATUALIZADA EM</th><th>STATUS</th></tr></thead>
                    <tbody>
                        {shown.map((t) => {
                            const d = donorById(t.donorId);
                            return (
                                <tr key={t.id} className="click" onClick={() => nav(`/triagens/${t.id}`)}>
                                    <td><div className="cell-name"><Avatar name={d.name} /><div><b>{d.name}</b><span>CPF ***.{d.cpf.slice(4, 7)}.{d.cpf.slice(8, 11)}-**</span></div></div></td>
                                    <td><b>{d.blood}</b></td>
                                    <td>{t.done} de 9{t.blockedModule ? ` · ${MODULES.find((m) => m.id === t.blockedModule)?.title}` : ''}</td>
                                    <td className="muted">{t.updated}</td>
                                    <td><Chip tone={toneOfTriage(t.status)}>{t.status}</Chip></td>
                                </tr>
                            );
                        })}
                        {shown.length === 0 && <tr><td colSpan={5}><div className="empty">Nenhuma triagem encontrada com esses filtros.</div></td></tr>}
                    </tbody>
                </table>
                <div className="row between"><span className="small muted" style={{ padding: '0 16px' }}>Mostrando {shown.length} de {rows.length} triagens</span><Pager page={page} pages={pages} onChange={setPage} /></div>
            </Card>
        </>
    );
}

export function TriageDetail() {
    const { id } = useParams();
    const nav = useNavigate();
    const { triages, donors, decideTriage, addAppt } = useStore();
    const t = triages.find((x) => x.id === Number(id));
    const [mod, setMod] = useState(t?.blockedModule ?? 'imp');
    const [modal, setModal] = useState<'inapto' | 'agenda' | null>(null);
    const [days, setDays] = useState(30);
    const [note, setNote] = useState('');
    const [slotDay, setSlotDay] = useState(3);
    const [slotHour, setSlotHour] = useState('14:00');
    if (!t) return <div className="empty">Triagem não encontrada. <Link to="/triagens" style={{ color: 'var(--primary)' }}>Voltar</Link></div>;
    const d = donors.find((x) => x.id === t.donorId)!;
    const m = MODULES.find((x) => x.id === mod)!;
    return (
        <>
            <PageHead title={d.name} plan="mvp" sub={`Triagens › Detalhe · enviada em ${t.updated}`} actions={<button className="btn ghost" onClick={() => nav('/triagens')}>Voltar à lista</button>} />
            <div className="grid" style={{ gridTemplateColumns: '340px 1fr', alignItems: 'start' }}>
                <div className="grid">
                    <Card>
                        <div className="row" style={{ gap: 16, marginBottom: 12 }}><Avatar name={d.name} size="lg" /><div><b style={{ fontSize: 17 }}>{d.name}</b><div style={{ marginTop: 8 }}><Chip tone={toneOfTriage(t.status)}>{t.status}</Chip></div></div></div>
                        <dl className="dl">
                            <dt>Tipo sanguíneo</dt><dd>{d.blood}</dd><dt>CPF</dt><dd>***.{d.cpf.slice(4, 7)}.{d.cpf.slice(8, 11)}-**</dd>
                            <dt>Idade · gênero</dt><dd>{d.age} anos · {d.gender}</dd><dt>Peso</dt><dd>{d.weight} kg</dd><dt>Cidade</dt><dd>{d.city} · PE</dd><dt>Contato</dt><dd>{d.phone}</dd>
                            <dt>Última doação</dt><dd>{d.lastDonation ?? 'Nunca doou'}</dd>
                        </dl>
                    </Card>
                    <Card>
                        <CardHead title="Histórico de doações" />
                        {d.donations === 0 && <p className="muted small">Ainda não há doações registradas.</p>}
                        {d.lastDonation && [d.lastDonation, '02 mar 2026', '10 out 2025'].slice(0, Math.min(3, d.donations)).map((x, i) => (
                            <div className="list-item" key={i}><span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--primary)' }} /><div><b>{x}</b><div className="muted small">450 mL · Hemocentro Recife</div></div></div>
                        ))}
                    </Card>
                </div>
                <div className="grid">
                    <Card>
                        <CardHead title="Decisão do agente" />
                        <p className="small" style={{ color: 'var(--text-2)', lineHeight: 1.5 }}>{t.note ?? 'Todos os módulos foram concluídos sem bloqueios. Falta a validação presencial (pressão, hemoglobina e peso) no dia da doação.'}</p>
                        <div className="row mt" style={{ flexWrap: 'wrap' }}>
                            <button className="btn" disabled={t.status === 'Aprovado'} onClick={() => decideTriage(t.id, 'apto')}><CircleCheck size={18} />Aprovar como apto</button>
                            <button className="btn warn" onClick={() => setModal('inapto')}><Clock3 size={18} />Inapto temporário</button>
                            <button className="btn outline" onClick={() => setModal('agenda')}><CalendarPlus size={18} />Agendar doação <PlanTag plan="fase2" /></button>
                        </div>
                    </Card>
                    <Card>
                        <CardHead title="Respostas da triagem" sub="Respostas em vermelho são as que bloquearam a doação." />
                        <div className="pills" style={{ marginBottom: 14 }}>
                            {MODULES.map((x) => <button key={x.id} className={`pill ${mod === x.id ? 'on' : ''}`} style={{ height: 34, padding: '0 14px', fontSize: 12 }} onClick={() => setMod(x.id)}>{x.title}{t.blockedModule === x.id ? ' ⚠' : ''}</button>)}
                        </div>
                        {m.questions.map((q, i) => {
                            const a = t.answers[m.id][i];
                            const blocked = a !== okAnswer(m.id, i);
                            return (
                                <div className="list-item" key={i}>
                                    <span className="muted bold" style={{ width: 22 }}>{i + 1}.</span>
                                    <div style={{ flex: 1 }}><b style={{ fontSize: 13 }}>{q}</b><div className={`small ${blocked ? '' : 'muted'}`} style={{ color: blocked ? 'var(--red)' : undefined }}>{blocked ? 'Bloqueio · resposta que impede a doação no momento' : 'Sem bloqueio · resposta esperada'}</div></div>
                                    <Chip tone={blocked ? 'red' : 'green'}>{a}</Chip>
                                </div>
                            );
                        })}
                    </Card>
                </div>
            </div>
            {modal === 'inapto' && (
                <Modal title="Marcar como inapto temporário" lead={`${d.name} ficará inapto até o fim do prazo e será avisado no app.`} onClose={() => setModal(null)}
                    footer={<><button className="btn ghost" onClick={() => setModal(null)}>Cancelar</button><button className="btn" onClick={() => { decideTriage(t.id, 'inapto', { days, note }); setModal(null); }}>Confirmar</button></>}>
                    <div className="grid">
                        <Field label="Prazo de inaptidão"><select className="select" value={days} onChange={(e) => setDays(Number(e.target.value))}>{[7, 15, 30, 60, 90, 180, 365].map((n) => <option key={n} value={n}>{n} dias</option>)}</select></Field>
                        <Field label="Observação do agente" hint="Opcional. Fica registrada na auditoria."><textarea className="textarea" value={note} onChange={(e) => setNote(e.target.value)} /></Field>
                    </div>
                </Modal>
            )}
            {modal === 'agenda' && (
                <Modal title="Agendar doação" lead="Escolha um horário livre na semana." onClose={() => setModal(null)}
                    footer={<><button className="btn ghost" onClick={() => setModal(null)}>Cancelar</button><button className="btn" onClick={() => { addAppt(d.id, slotDay, slotHour); setModal(null); }}>Agendar</button></>}>
                    <div className="grid g2">
                        <Field label="Dia"><select className="select" value={slotDay} onChange={(e) => setSlotDay(Number(e.target.value))}>{WEEK_DAYS.map((w, i) => <option key={i} value={i}>{w.label} {w.date}/11</option>)}</select></Field>
                        <Field label="Horário"><select className="select" value={slotHour} onChange={(e) => setSlotHour(e.target.value)}>{HOURS.map((h) => <option key={h}>{h}</option>)}</select></Field>
                    </div>
                    <div className="note blue mt"><Ban size={0} />A agenda faz parte da Fase 2; aqui ela é apenas simulada.</div>
                    <span className="hidden"><TypeBadge type={d.blood} /></span>
                </Modal>
            )}
        </>
    );
}
