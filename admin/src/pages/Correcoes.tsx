import { useState } from 'react';
import { Check, CircleCheck } from 'lucide-react';
import { Card, Chip, Field, PageHead, Pills } from '../components/ui';
import { useStore } from '../state/store';
import { donorById } from '../data/mock';

export default function Corrections() {
    const { corrections, resolveCorrection, toast } = useStore();
    const [tab, setTab] = useState<'pend' | 'done'>('pend');
    const list = corrections.filter((c) => (tab === 'pend' ? c.status === 'PENDING_REVIEW' : c.status !== 'PENDING_REVIEW'));
    const [selId, setSelId] = useState<number | null>(null);
    const sel = list.find((c) => c.id === selId) ?? list[0];
    const [note, setNote] = useState('');
    const [err, setErr] = useState('');
    const pick = (id: number) => { setSelId(id); setNote(''); setErr(''); };
    const decide = (status: 'APPROVED' | 'REJECTED') => {
        if (!sel) return;
        if (status === 'REJECTED' && note.trim().length < 5) { setErr('Informe o motivo da recusa (mínimo 5 caracteres).'); toast('Observação obrigatória para recusar.', 'err'); return; }
        resolveCorrection(sel.id, status, note.trim());
        setNote(''); setErr(''); setSelId(null);
    };
    const pendCount = corrections.filter((c) => c.status === 'PENDING_REVIEW').length;
    return (
        <>
            <PageHead title="Correções de respostas" plan="mvp" sub="Doadores que pediram revisão de uma triagem já enviada. Analise e decida." />
            <Pills items={[{ id: 'pend' as const, label: `Aguardando análise (${pendCount})` }, { id: 'done' as const, label: `Resolvidas (${corrections.length - pendCount})` }]} value={tab} onChange={(v) => { setTab(v); setSelId(null); }} />
            <div className="grid mt" style={{ gridTemplateColumns: '380px 1fr', alignItems: 'start' }}>
                <Card style={{ padding: 16 }}>
                    {list.length === 0 && <div className="empty"><CircleCheck size={32} color="#2e7d32" /><p style={{ marginTop: 10 }}>Tudo em dia! Nenhuma correção aqui.</p></div>}
                    {list.map((c) => {
                        const d = donorById(c.donorId);
                        const late = c.hoursAgo > 48;
                        return (
                            <button key={c.id} className={`sel-card ${sel?.id === c.id ? 'on' : ''}`} style={{ marginBottom: 10 }} onClick={() => pick(c.id)}>
                                <div className="row between"><b>{d.name}</b><Chip tone={c.status === 'APPROVED' ? 'green' : c.status === 'REJECTED' ? 'red' : late ? 'amber' : 'gray'}>{c.status === 'PENDING_REVIEW' ? `há ${c.hoursAgo}h` : c.status === 'APPROVED' ? 'Aprovada' : 'Recusada'}</Chip></div>
                                <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 12, margin: '8px 0 6px' }}>Módulo: {c.module}</div>
                                <div className="small muted">“{c.reason.length > 60 ? c.reason.slice(0, 60) + '…' : c.reason}”</div>
                            </button>
                        );
                    })}
                </Card>
                {sel && (
                    <Card>
                        <div className="row between">
                            <h3 style={{ fontSize: 18 }}>Solicitação #{sel.id} · {sel.module}</h3>
                            {sel.status === 'PENDING_REVIEW' ? <Chip tone={sel.hoursAgo > 48 ? 'amber' : 'gray'}>{`há ${sel.hoursAgo}h${sel.hoursAgo > 48 ? ' · acima da meta' : ''}`}</Chip> : <Chip tone={sel.status === 'APPROVED' ? 'green' : 'red'}>{sel.status === 'APPROVED' ? 'Aprovada' : 'Recusada'}</Chip>}
                        </div>
                        <p className="small muted" style={{ margin: '6px 0 16px' }}>Doador: {donorById(sel.donorId).name} · {donorById(sel.donorId).blood}{sel.resolvedAt ? ` · resolvida por ${sel.responsible} em ${sel.resolvedAt}` : ''}</p>
                        <div className="note gray" style={{ flexDirection: 'column', gap: 6 }}><b style={{ fontSize: 10, letterSpacing: 0.8, color: '#8a857e' }}>MOTIVO INFORMADO</b><span style={{ fontSize: 13, color: '#353535' }}>{sel.reason}</span></div>
                        <h4 style={{ margin: '22px 0 10px' }}>Comparação das respostas</h4>
                        <div className="diff-row" style={{ background: '#faf8f5' }}><b className="small muted">PERGUNTA</b><b className="small muted">ORIGINAL</b><b className="small muted">CORRIGIDA</b></div>
                        {sel.diff.map((r, i) => {
                            const ch = r.original !== r.corrected;
                            return <div key={i} className={`diff-row ${ch ? 'changed' : ''}`}><b style={{ fontSize: 13 }}>{r.q}</b><Chip tone={ch ? 'red' : 'gray'}>{r.original}</Chip><Chip tone={ch ? 'green' : 'gray'}>{r.corrected}</Chip></div>;
                        })}
                        <div className="note green mt" style={{ flexDirection: 'column', gap: 4 }}><b>Impacto: com a correção, a triagem de {sel.module} passa de {sel.resultBefore} para {sel.resultAfter}.</b><span>Verifique o comprovante ou confirme com o doador antes de aprovar.</span></div>
                        {sel.status === 'PENDING_REVIEW' ? (
                            <>
                                <div className="mt2"><Field label="Observação do agente (obrigatória ao recusar)" error={err}><textarea className={`textarea ${err ? 'invalid' : ''}`} value={note} onChange={(e) => { setNote(e.target.value); setErr(''); }} /></Field></div>
                                <div className="row" style={{ justifyContent: 'flex-end', marginTop: 18 }}>
                                    <button className="btn danger" onClick={() => decide('REJECTED')}>Recusar</button>
                                    <button className="btn" onClick={() => decide('APPROVED')}><Check size={18} />Aprovar correção</button>
                                </div>
                            </>
                        ) : sel.note && <div className="note gray mt2"><span><b>Observação:</b> {sel.note}</span></div>}
                    </Card>
                )}
            </div>
        </>
    );
}
