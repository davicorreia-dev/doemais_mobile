import { useState } from 'react';
import { ArrowUpRight, CircleCheck, Droplets, HandHeart, Timer } from 'lucide-react';
import { Card, CardHead, Chip, Field, Kpi, Modal, PageHead } from '../components/ui';
import { useStore } from '../state/store';
import { BLOOD, type BagStatus, type Tone } from '../data/mock';

const level = (v: number): { tone: Tone; label: string; color: string } => (v < 20 ? { tone: 'red', label: 'Crítico', color: '#c62828' } : v < 100 ? { tone: 'amber', label: 'Atenção', color: '#d58a18' } : { tone: 'green', label: 'Estável', color: '#2e7d32' });
const bagTone = (s: BagStatus): Tone => (s === 'Disponível' ? 'green' : s === 'Reservada' ? 'blue' : s === 'Vencendo' ? 'amber' : 'gray');

export default function Stock() {
    const { stock, bags, registerExit } = useStore();
    const [filter, setFilter] = useState<'Todas' | BagStatus>('Todas');
    const [modal, setModal] = useState(false);
    const [exit, setExit] = useState({ blood: 'O+', qty: 1, dest: 'Hospital da Restauração' });
    const total = Object.values(stock).reduce((a, b) => a + b, 0);
    const reserved = bags.filter((b) => b.status === 'Reservada').length;
    const expiring = bags.filter((b) => b.status === 'Vencendo').length;
    const shown = bags.filter((b) => filter === 'Todas' || b.status === filter);
    return (
        <>
            <PageHead title="Estoque de sangue" plan="fase2" sub="Posição em tempo real das bolsas coletadas na unidade."
                actions={<button className="btn" onClick={() => setModal(true)}><ArrowUpRight size={18} />Registrar saída</button>} />
            <div className="grid g4">
                <Kpi label="Bolsas em estoque" value={total} delta="+24" tone="green" foot="esta semana" icon={<Droplets size={22} />} />
                <Kpi label="Disponíveis" value={total - 61} delta="85%" tone="blue" foot="do total" icon={<CircleCheck size={22} />} />
                <Kpi label="Reservadas" value={61 + reserved} delta="8 pedidos" tone="blue" foot="hospitais" icon={<HandHeart size={22} />} />
                <Kpi label="Vencem em 7 dias" value={14} delta="atenção" tone="amber" foot="A+ e B+" icon={<Timer size={22} />} />
            </div>
            <div className="grid g4 mt">
                {BLOOD.map((t) => {
                    const l = level(stock[t]);
                    return (
                        <Card key={t} style={{ padding: 20 }}>
                            <div className="row"><span className="type-badge">{t}</span><div><div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{stock[t]}</div><div className="small muted">bolsas</div></div><Chip tone={l.tone}>{l.label}</Chip></div>
                            <div className="hbar" style={{ gridTemplateColumns: '1fr', margin: '14px 0 6px' }}><div className="track"><div className="fill" style={{ width: `${Math.min(100, stock[t])}%`, background: l.color }} /></div></div>
                            <div className="small muted">Vence primeiro: {(BLOOD.indexOf(t) % 3) + 2} dez</div>
                        </Card>
                    );
                })}
            </div>
            <Card className="mt" style={{ padding: 0 }}>
                <div style={{ padding: '18px 22px 0' }}><CardHead title="Bolsas por lote" sub="Clique em um filtro para ver só um status." /></div>
                <div className="pills" style={{ padding: '0 22px 14px' }}>{(['Todas', 'Disponível', 'Reservada', 'Vencendo', 'Descartada'] as const).map((f) => <button key={f} className={`pill ${filter === f ? 'on' : ''}`} style={{ height: 34, fontSize: 12 }} onClick={() => setFilter(f)}>{f}</button>)}</div>
                <table>
                    <thead><tr><th>LOTE</th><th>TIPO</th><th>COLETA</th><th>VALIDADE</th><th>ORIGEM</th><th>STATUS</th></tr></thead>
                    <tbody>{shown.map((b) => <tr key={b.lot}><td><b>{b.lot}</b></td><td><b style={{ color: 'var(--primary)' }}>{b.blood}</b></td><td>{b.collected}</td><td>{b.expires}</td><td>{b.origin}</td><td><Chip tone={bagTone(b.status)}>{b.status}</Chip></td></tr>)}</tbody>
                </table>
            </Card>
            {modal && (
                <Modal title="Registrar saída de bolsas" lead="Baixa no estoque para hospitais parceiros, transferência ou descarte." onClose={() => setModal(false)}
                    footer={<><button className="btn ghost" onClick={() => setModal(false)}>Cancelar</button><button className="btn" disabled={exit.qty < 1 || exit.qty > stock[exit.blood]} onClick={() => { registerExit(exit.blood, exit.qty, exit.dest); setModal(false); }}>Registrar saída</button></>}>
                    <div className="grid">
                        <div className="grid g2">
                            <Field label="Tipo sanguíneo"><select className="select" value={exit.blood} onChange={(e) => setExit({ ...exit, blood: e.target.value })}>{BLOOD.map((t) => <option key={t}>{t}</option>)}</select></Field>
                            <Field label="Quantidade" hint={`Disponível: ${stock[exit.blood]}`} error={exit.qty > stock[exit.blood] ? 'Maior que o estoque.' : ''}><input className="input" type="number" min={1} value={exit.qty} onChange={(e) => setExit({ ...exit, qty: Number(e.target.value) })} /></Field>
                        </div>
                        <Field label="Destino"><select className="select" value={exit.dest} onChange={(e) => setExit({ ...exit, dest: e.target.value })}><option>Hospital da Restauração</option><option>Hospital Esperança</option><option>Real Hospital Português</option><option>Transferência para Olinda</option><option>Descarte (vencimento)</option></select></Field>
                    </div>
                </Modal>
            )}
        </>
    );
}
