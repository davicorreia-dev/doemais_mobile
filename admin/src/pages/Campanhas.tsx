import { useMemo, useState } from 'react';
import { Clock3, Send, Smartphone, Users } from 'lucide-react';
import { Card, CardHead, Chip, Field, PageHead, Toggle } from '../components/ui';
import { useStore } from '../state/store';
import { BLOOD } from '../data/mock';

const REGIONS: Record<string, number> = { 'Recife e região metropolitana': 1.0, 'Somente Recife': 0.55, 'Todo o estado de Pernambuco': 1.6 };

export default function Campaigns() {
    const { donors, campaigns, addCampaign } = useStore();
    const [title, setTitle] = useState('Estoque de O- está crítico: sua doação salva vidas');
    const [msg, setMsg] = useState('Faltam bolsas de O- no Hemocentro Recife. Agende em 1 minuto e doe nesta semana.');
    const [types, setTypes] = useState<string[]>(['O-', 'O+']);
    const [region, setRegion] = useState('Recife e região metropolitana');
    const [onlyApt, setOnlyApt] = useState(true);
    const [ch, setCh] = useState({ push: true, email: true, sms: false });
    const [when, setWhen] = useState<'now' | 'later'>('now');
    const [date, setDate] = useState('2026-11-14');
    const reach = useMemo(() => {
        const compat = donors.filter((d) => types.includes(d.blood) && (!onlyApt || d.status === 'Apto')).length;
        return Math.round(((compat + 3) / donors.length) * 3482 * 0.62 * REGIONS[region]);
    }, [donors, types, onlyApt, region]);
    const channels = [ch.push && 'Push', ch.email && 'E-mail', ch.sms && 'SMS'].filter(Boolean) as string[];
    const valid = title.trim().length > 5 && msg.trim().length > 10 && types.length > 0 && channels.length > 0;
    const send = (status: 'Concluída' | 'Programada' | 'Rascunho') => {
        addCampaign({ title: title.slice(0, 48), sent: status === 'Programada' ? date.split('-').reverse().join('/') : 'agora', reach: status === 'Rascunho' ? 0 : reach, opened: 0, booked: 0, status, types });
    };
    return (
        <>
            <PageHead title="Campanhas" plan="mvp" sub="Convoque doadores compatíveis por tipo sanguíneo e região, direto no app." />
            <div className="grid" style={{ gridTemplateColumns: '1fr 400px', alignItems: 'start' }}>
                <Card>
                    <CardHead title="Nova campanha" />
                    <div className="grid" style={{ gap: 18 }}>
                        <Field label="Título da notificação" hint={`${title.length}/65 caracteres`}><input className="input" maxLength={65} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
                        <Field label="Mensagem" hint={`${msg.length}/160 caracteres`}><textarea className="textarea" maxLength={160} value={msg} onChange={(e) => setMsg(e.target.value)} /></Field>
                        <Field label="Tipos sanguíneos"><div className="type-toggle">{[...BLOOD].sort().map((t) => <button key={t} type="button" className={types.includes(t) ? 'on' : ''} onClick={() => setTypes(types.includes(t) ? types.filter((x) => x !== t) : [...types, t])}>{t}</button>)}</div></Field>
                        <div className="grid g2">
                            <Field label="Região"><select className="select" value={region} onChange={(e) => setRegion(e.target.value)}>{Object.keys(REGIONS).map((r) => <option key={r}>{r}</option>)}</select></Field>
                            <Field label="Canais"><div className="row" style={{ height: 50, gap: 16 }}>{(['push', 'email', 'sms'] as const).map((k) => <label key={k} className="check small"><input type="checkbox" checked={ch[k]} onChange={(e) => setCh({ ...ch, [k]: e.target.checked })} />{k === 'push' ? 'Push' : k === 'email' ? 'E-mail' : 'SMS'}</label>)}</div></Field>
                        </div>
                        <div className="row between"><b>Enviar apenas para doadores aptos hoje</b><Toggle on={onlyApt} onChange={setOnlyApt} /></div>
                        <div className="note red" style={{ alignItems: 'center', padding: 20 }}><Users size={34} color="#e0323c" /><div><b style={{ fontSize: 22, color: '#222' }}>≈ {reach.toLocaleString('pt-BR')} doadores</b><div className="small">compatíveis e {onlyApt ? 'aptos' : 'cadastrados'} · dos 3.482 da base</div></div></div>
                        <Field label="Quando enviar">
                            <div className="row"><button className={`pill ${when === 'now' ? 'on' : ''}`} onClick={() => setWhen('now')}>Agora</button><button className={`pill ${when === 'later' ? 'on' : ''}`} onClick={() => setWhen('later')}>Programar</button>{when === 'later' && <input type="date" className="input" style={{ width: 190, height: 40 }} value={date} onChange={(e) => setDate(e.target.value)} />}</div>
                        </Field>
                        <div className="row">
                            <button className="btn lg" disabled={!valid} onClick={() => send(when === 'now' ? 'Concluída' : 'Programada')}>{when === 'now' ? <Send size={18} /> : <Clock3 size={18} />}{when === 'now' ? 'Enviar agora' : 'Programar envio'}</button>
                            <button className="btn lg ghost" onClick={() => send('Rascunho')}>Salvar rascunho</button>
                        </div>
                    </div>
                </Card>
                <div className="grid">
                    <Card>
                        <CardHead title="Prévia no celular" />
                        <div className="phone"><div className="ic">D</div><div><div className="small muted">Doe+ · agora</div><b style={{ display: 'block', margin: '4px 0 6px', fontSize: 14 }}>{title || 'Título da campanha'}</b><span className="small" style={{ color: 'var(--text-2)' }}>{msg || 'Mensagem da campanha'}</span></div></div>
                        <p className="small muted" style={{ margin: '14px 0' }}><Smartphone size={14} style={{ verticalAlign: -2 }} /> A mensagem abre o agendamento direto no app. Canais: {channels.join(', ') || 'nenhum'}.</p>
                    </Card>
                    <Card>
                        <CardHead title="Campanhas recentes" />
                        {campaigns.map((c) => (
                            <div className="list-item" key={c.id} style={{ alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}><b>{c.title}</b><div className="small muted" style={{ marginTop: 4 }}>{c.status === 'Rascunho' ? 'Rascunho' : `${c.reach.toLocaleString('pt-BR')} alcançados`}{c.opened ? ` · ${c.opened} aberturas · ${c.booked} agendamentos` : ''}</div></div>
                                <Chip tone={c.status === 'Concluída' ? 'green' : c.status === 'Programada' ? 'blue' : 'gray'}>{c.status}</Chip>
                            </div>
                        ))}
                    </Card>
                </div>
            </div>
        </>
    );
}
