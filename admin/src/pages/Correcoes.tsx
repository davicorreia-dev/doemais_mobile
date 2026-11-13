import { useCallback, useEffect, useState } from 'react';
import { Check, CircleCheck, RefreshCw } from 'lucide-react';
import { Card, Chip, Field, PageHead, Pills } from '../components/ui';

type Answer = string | number | boolean | null;
type RetestContext = { formulario?: string; pergunta_bloqueadora?: { id: string; text: string; answer: Answer; message?: string } };
type Correction = {
    id: number; modulo: string; motivo: string; comentario?: string;
    status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
    respostas_originais: Record<string, Answer>; respostas_corrigidas?: Record<string, Answer> | null; perguntas_alteradas?: string[] | null;
    contexto_reteste?: RetestContext; doador: { nome: string; tipo_sanguineo?: string };
};

const answer = (value: Answer | undefined) => value === true ? 'Sim' : value === false ? 'Não' : value == null ? '—' : String(value);

export default function Corrections() {
    const [items, setItems] = useState<Correction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tab, setTab] = useState<'pend' | 'done'>('pend');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [note, setNote] = useState('');
    const load = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const response = await fetch('/hemocentro-api/correcoes');
            if (!response.ok) throw new Error('Não foi possível carregar os retestes. Verifique a chave de integração do painel.');
            setItems(await response.json());
        } catch (cause: any) { setError(cause.message || 'Não foi possível carregar os retestes.'); }
        finally { setLoading(false); }
    }, []);
    useEffect(() => { void load(); }, [load]);
    const list = items.filter((item) => tab === 'pend' ? item.status === 'PENDING_REVIEW' : item.status !== 'PENDING_REVIEW');
    const selected = list.find((item) => item.id === selectedId) ?? list[0];
    const resolve = async (status: 'APPROVED' | 'REJECTED') => {
        if (!selected) return;
        const response = await fetch(`/hemocentro-api/correcoes/${selected.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, responsavel: 'Agente do hemocentro', observacao: note.trim() || undefined }) });
        if (!response.ok) { setError('Não foi possível registrar a decisão.'); return; }
        setItems((current) => current.map((item) => item.id === selected.id ? { ...item, status } : item));
        setNote(''); setSelectedId(null);
    };
    const pending = items.filter((item) => item.status === 'PENDING_REVIEW').length;
    const question = selected?.contexto_reteste?.pergunta_bloqueadora;
    return <>
        <PageHead title="Retestes solicitados" plan="mvp" sub="Solicitações feitas pelos doadores após uma resposta de pré-triagem." actions={<button className="btn outline" onClick={() => void load()}><RefreshCw size={17} />Atualizar</button>} />
        <Pills items={[{ id: 'pend' as const, label: `Aguardando análise (${pending})` }, { id: 'done' as const, label: `Resolvidas (${items.length - pending})` }]} value={tab} onChange={(value) => { setTab(value); setSelectedId(null); }} />
        {error && <div className="note red mt">{error}</div>}
        {loading ? <div className="empty">Carregando retestes…</div> : <div className="grid mt" style={{ gridTemplateColumns: '380px 1fr', alignItems: 'start' }}>
            <Card style={{ padding: 16 }}>
                {list.length === 0 && <div className="empty"><CircleCheck size={32} color="#2e7d32" /><p style={{ marginTop: 10 }}>Nenhum reteste nesta fila.</p></div>}
                {list.map((item) => <button key={item.id} className={`sel-card ${selected?.id === item.id ? 'on' : ''}`} style={{ marginBottom: 10 }} onClick={() => { setSelectedId(item.id); setNote(''); }}>
                    <div className="row between"><b>{item.doador.nome}</b><Chip tone={item.status === 'PENDING_REVIEW' ? 'amber' : item.status === 'APPROVED' ? 'green' : 'red'}>{item.status === 'PENDING_REVIEW' ? 'Reteste solicitado' : item.status === 'APPROVED' ? 'Aprovado' : 'Recusado'}</Chip></div>
                    <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 12, margin: '8px 0 6px' }}>{item.contexto_reteste?.formulario || item.modulo}</div><div className="small muted">{item.motivo}</div>
                </button>)}
            </Card>
            {selected && <Card>
                <div className="row between"><h3 style={{ fontSize: 18 }}>Reteste #{selected.id} · {selected.contexto_reteste?.formulario || selected.modulo}</h3><Chip tone={selected.status === 'PENDING_REVIEW' ? 'amber' : selected.status === 'APPROVED' ? 'green' : 'red'}>{selected.status === 'PENDING_REVIEW' ? 'Reteste solicitado' : selected.status}</Chip></div>
                <p className="small muted" style={{ margin: '6px 0 16px' }}>Doador: {selected.doador.nome} · {selected.doador.tipo_sanguineo || 'Tipo sanguíneo não informado'}</p>
                <div className="note gray" style={{ flexDirection: 'column', gap: 6 }}><b style={{ fontSize: 10, letterSpacing: 0.8, color: '#8a857e' }}>MOTIVO INFORMADO</b><span style={{ fontSize: 13, color: '#353535' }}>{selected.motivo}{selected.comentario ? ` — ${selected.comentario}` : ''}</span></div>
                {question && <div className="note red mt" style={{ flexDirection: 'column', gap: 6 }}><b style={{ fontSize: 10, letterSpacing: 0.8 }}>PERGUNTA QUE EXIGIU RETESTE</b><span><b>{question.text}</b></span><span className="small">Resposta original: <b>{answer(question.answer)}</b>{question.message ? ` · ${question.message}` : ''}</span></div>}
                <h4 style={{ margin: '22px 0 10px' }}>Respostas alteradas no reteste</h4><div className="diff-row" style={{ background: '#faf8f5' }}><b className="small muted">CAMPO</b><b className="small muted">ORIGINAL</b><b className="small muted">RETESTE</b></div>
                {(selected.perguntas_alteradas || []).length === 0 && <p className="small muted">O doador terminou o reteste sem alterar respostas.</p>}
                {(selected.perguntas_alteradas || []).map((id) => <div key={id} className="diff-row changed"><b style={{ fontSize: 13 }}>{question?.id === id ? question.text : id}</b><Chip tone="red">{answer(selected.respostas_originais[id])}</Chip><Chip tone="green">{answer(selected.respostas_corrigidas?.[id])}</Chip></div>)}
                {selected.status === 'PENDING_REVIEW' && <><div className="mt2"><Field label="Observação do agente"><textarea className="textarea" value={note} onChange={(event) => setNote(event.target.value)} /></Field></div><div className="row" style={{ justifyContent: 'flex-end', marginTop: 18 }}><button className="btn danger" onClick={() => void resolve('REJECTED')}>Recusar</button><button className="btn" onClick={() => void resolve('APPROVED')}><Check size={18} />Aprovar reteste</button></div></>}
            </Card>}
        </div>}
    </>;
}
