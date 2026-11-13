import { useMemo, useState } from 'react';
import { ArrowRight, Ban, Check, CircleCheck, QrCode, Search, TriangleAlert, UserX } from 'lucide-react';
import { Avatar, Card, CardHead, Chip, Field, PageHead, PlanTag, TypeBadge } from '../components/ui';
import { useStore } from '../state/store';
import { type Donor, type Tone } from '../data/mock';

type Step = 1 | 2 | 3;
const queueTone = (s: string): Tone => (s === 'Concluída' ? 'green' : s === 'Em coleta' ? 'green' : s === 'Em triagem' ? 'amber' : 'gray');

export default function Attendance() {
    const { donors, queue, setQueueStatus, registerDonation, toast } = useStore();
    const [step, setStep] = useState<Step>(1);
    const [q, setQ] = useState('Paulo');
    const [donor, setDonor] = useState<Donor | null>(donors[0]);
    const [docOk, setDocOk] = useState(false);
    const [v, setV] = useState({ pa: '120x80', hb: '14.2', pulse: '72', weight: '72', temp: '36.4' });
    const [coleta, setColeta] = useState({ ml: '450', lot: 'L-2026-1112-0087', bag: 'Tripla (CPDA-1)', react: 'Nenhuma' });
    const found = useMemo(() => {
        const s = q.trim().toLowerCase();
        return s ? donors.filter((d) => d.name.toLowerCase().includes(s) || d.cpf.replace(/\D/g, '').includes(s.replace(/\D/g, '')) && s.replace(/\D/g, '').length > 2).slice(0, 4) : [];
    }, [q, donors]);
    const clinical = useMemo(() => {
        const hb = parseFloat(v.hb.replace(',', '.'));
        const w = parseFloat(v.weight);
        const t = parseFloat(v.temp.replace(',', '.'));
        const [sys, dia] = v.pa.split(/[x×/]/).map(Number);
        const issues: string[] = [];
        if (!(hb >= 12.5)) issues.push('Hemoglobina abaixo de 12,5 g/dL');
        if (!(w >= 50)) issues.push('Peso abaixo de 50 kg');
        if (!(t < 37.5)) issues.push('Temperatura acima de 37,4 °C');
        if (!(sys >= 90 && sys <= 180 && dia >= 60 && dia <= 100)) issues.push('Pressão arterial fora da faixa (90–180 × 60–100)');
        return issues;
    }, [v]);
    const startTriage = () => { if (!donor) return; setQueueStatus(donor.id, 'Em triagem'); setStep(2); };
    const finish = () => { if (!donor) return; registerDonation(donor.id, Number(coleta.ml), coleta.lot); setStep(1); setDonor(null); setDocOk(false); setQ(''); };
    const steps = ['Identificar doador', 'Triagem presencial', 'Registrar coleta'];
    return (
        <>
            <PageHead title="Atendimento" plan="mvp" sub="Check-in, triagem presencial e registro da coleta em um só fluxo." />
            <div className="stepper">
                {steps.map((s, i) => (
                    <div key={s} style={{ display: 'contents' }}>
                        <div className={`step ${step === i + 1 ? 'on' : step > i + 1 ? 'done' : ''}`}><span className="n">{step > i + 1 ? <Check size={20} /> : i + 1}</span>{s}{i === 2 && <PlanTag plan="fase2" />}</div>
                        {i < 2 && <span className="step-line" />}
                    </div>
                ))}
            </div>
            <div className="grid" style={{ gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>
                {step === 1 && (
                    <Card>
                        <CardHead title="Buscar doador" />
                        <div className="row">
                            <div className="input-wrap" style={{ flex: 1 }}><Search size={22} style={{ top: 16 }} /><input className="input" style={{ height: 56 }} placeholder="CPF, nome ou código da carteirinha" value={q} onChange={(e) => { setQ(e.target.value); setDonor(null); }} /></div>
                            <button className="btn lg" onClick={() => { const d = donors.find((x) => x.status === 'Apto') ?? donors[0]; setDonor(d); setQ(d.name); toast('QR lido: carteirinha válida (simulado).'); }}><QrCode size={20} />Ler QR</button>
                        </div>
                        {!donor && found.length > 0 && <div className="mt">{found.map((d) => <button key={d.id} className="sel-card" style={{ marginBottom: 8 }} onClick={() => { setDonor(d); setQ(d.name); }}><div className="row"><Avatar name={d.name} /><b>{d.name}</b><span className="muted small right">{d.blood} · {d.city}</span></div></button>)}</div>}
                        {!donor && found.length === 0 && q && <div className="empty">Nenhum doador encontrado.</div>}
                        {donor && (
                            <div className="mt2" style={{ background: '#faf8f5', borderRadius: 18, padding: 24 }}>
                                <div className="row" style={{ gap: 18 }}>
                                    <Avatar name={donor.name} size="lg" />
                                    <div style={{ flex: 1 }}><b style={{ fontSize: 20 }}>{donor.name}</b><div className="small muted" style={{ marginTop: 6 }}>CPF ***.{donor.cpf.slice(4, 7)}.{donor.cpf.slice(8, 11)}-** · {donor.age} anos · {donor.gender} · {donor.weight} kg</div></div>
                                    <TypeBadge type={donor.blood} />
                                </div>
                                {[
                                    [donor.status === 'Apto' || donor.status === 'Em triagem', 'Triagem aprovada em 12 nov 2026', 'Triagem do app pendente ou com bloqueio'],
                                    [donor.status !== 'Inapto temporário', 'Intervalo mínimo cumprido (96 dias · mínimo 60)', `Intervalo mínimo não cumprido${donor.until ? ` · liberado em ${donor.until}` : ''}`],
                                    [true, 'Agendamento de hoje, 09:00 · Hemocentro Recife', ''],
                                ].map(([ok, a, b], i) => <div className="row" key={i} style={{ marginTop: 16, color: ok ? 'var(--green)' : 'var(--red)' }}>{ok ? <CircleCheck size={22} /> : <Ban size={22} />}<b style={{ color: '#353535', fontSize: 13 }}>{(ok ? a : b) as string}</b></div>)}
                                <div className="row" style={{ marginTop: 16, color: 'var(--amber)' }}><TriangleAlert size={22} /><b style={{ color: '#353535', fontSize: 13 }}>Conferir documento oficial com foto</b></div>
                            </div>
                        )}
                        {donor && (
                            <>
                                <label className="check mt2"><input type="checkbox" checked={docOk} onChange={(e) => setDocOk(e.target.checked)} />Confirmo que conferi o documento com foto do doador.</label>
                                <div className="row mt"><button className="btn lg" disabled={!docOk || donor.status === 'Inapto temporário' || donor.status === 'Bloqueada'} onClick={startTriage}>Iniciar triagem presencial<ArrowRight size={20} /></button>
                                    <button className="btn lg danger" onClick={() => { setQueueStatus(donor.id, 'Concluída'); toast(`${donor.name} marcado como não compareceu.`); setDonor(null); setQ(''); }}><UserX size={20} />Não compareceu</button></div>
                            </>
                        )}
                    </Card>
                )}
                {step === 2 && donor && (
                    <Card>
                        <CardHead title={`Triagem presencial · ${donor.name}`} sub="Os campos já vêm validados contra as regras da unidade." />
                        <div className="grid g3">
                            <Field label="Pressão arterial (mmHg)"><input className="input" value={v.pa} onChange={(e) => setV({ ...v, pa: e.target.value })} /></Field>
                            <Field label="Hemoglobina (g/dL)" hint="Mínimo 12,5"><input className="input" value={v.hb} onChange={(e) => setV({ ...v, hb: e.target.value })} /></Field>
                            <Field label="Pulso (bpm)"><input className="input" value={v.pulse} onChange={(e) => setV({ ...v, pulse: e.target.value })} /></Field>
                            <Field label="Peso (kg)" hint="Mínimo 50"><input className="input" value={v.weight} onChange={(e) => setV({ ...v, weight: e.target.value })} /></Field>
                            <Field label="Temperatura (°C)"><input className="input" value={v.temp} onChange={(e) => setV({ ...v, temp: e.target.value })} /></Field>
                        </div>
                        {clinical.length === 0
                            ? <div className="note green mt2"><CircleCheck size={22} /><b>Todos os critérios foram atendidos. O doador está apto para a coleta.</b></div>
                            : <div className="note red mt2" style={{ flexDirection: 'column' }}><b>O doador não atende aos critérios:</b>{clinical.map((c) => <span key={c}>• {c}</span>)}</div>}
                        <div className="row mt2" style={{ justifyContent: 'flex-end' }}>
                            <button className="btn danger" onClick={() => { setQueueStatus(donor.id, 'Concluída'); toast('Doador marcado como inapto na triagem presencial.'); setStep(1); setDonor(null); setDocOk(false); }}><Ban size={18} />Inapto na triagem</button>
                            <button className="btn" disabled={clinical.length > 0} onClick={() => { setQueueStatus(donor.id, 'Em coleta'); setStep(3); }}>Liberar para coleta<ArrowRight size={18} /></button>
                        </div>
                    </Card>
                )}
                {step === 3 && donor && (
                    <Card>
                        <CardHead title="Registrar coleta" sub="Ao registrar, a bolsa entra no estoque e o intervalo mínimo do doador volta a contar." plan="fase2" />
                        <div className="grid g2">
                            <Field label="Volume coletado (mL)"><input className="input" value={coleta.ml} onChange={(e) => setColeta({ ...coleta, ml: e.target.value })} /></Field>
                            <Field label="Tipo de bolsa"><select className="select" value={coleta.bag} onChange={(e) => setColeta({ ...coleta, bag: e.target.value })}><option>Simples (CPDA-1)</option><option>Dupla (CPDA-1)</option><option>Tripla (CPDA-1)</option></select></Field>
                            <Field label="Número do lote da bolsa"><input className="input" value={coleta.lot} onChange={(e) => setColeta({ ...coleta, lot: e.target.value })} /></Field>
                            <Field label="Reação adversa"><select className="select" value={coleta.react} onChange={(e) => setColeta({ ...coleta, react: e.target.value })}><option>Nenhuma</option><option>Leve (tontura)</option><option>Moderada</option></select></Field>
                        </div>
                        <div className="note red mt2" style={{ alignItems: 'center' }}><TypeBadge type={donor.blood} small /><b style={{ fontSize: 15, color: '#222' }}>Estoque {donor.blood}: +1 bolsa · validade 42 dias (vence em 24 dez 2026)</b></div>
                        <div className="row mt2" style={{ justifyContent: 'flex-end' }}><button className="btn lg" onClick={finish}><CircleCheck size={20} />Registrar doação</button></div>
                    </Card>
                )}
                <Card>
                    <CardHead title="Fila de hoje" sub={`${queue.filter((x) => x.status === 'Concluída').length + 12} concluídas · ${queue.filter((x) => x.status !== 'Concluída' && x.status !== 'Aguardando').length} em andamento`} />
                    {queue.map((it) => {
                        const d = donors.find((x) => x.id === it.donorId)!;
                        return (
                            <div className="list-item" key={it.donorId} style={{ cursor: it.status === 'Aguardando' ? 'pointer' : 'default' }} onClick={() => { if (it.status === 'Aguardando' && step === 1) { setDonor(d); setQ(d.name); } }}>
                                <Avatar name={d.name} /><div style={{ flex: 1 }}><b>{d.name}</b><div style={{ marginTop: 6 }}><Chip tone={queueTone(it.status)}>{it.status}</Chip></div></div>
                            </div>
                        );
                    })}
                </Card>
            </div>
        </>
    );
}
