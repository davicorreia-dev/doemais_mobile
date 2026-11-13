import { useState } from 'react';
import { ClipboardCheck, Download, Droplet, Timer, CalendarDays } from 'lucide-react';
import { Card, CardHead, Kpi, PageHead, downloadCsv } from '../components/ui';
import { useStore } from '../state/store';
import { BLOCK_REASONS, MONTHS } from '../data/mock';

const PERIODS: Record<string, { label: string; don: string; delta: string; appr: string; ad: string; sla: string; sd: string; miss: string; md: string; vs: string }> = {
    out: { label: 'Outubro de 2026', don: '612', delta: '+8%', appr: '78%', ad: '-3 pp', sla: '19h', sd: '-6h', miss: '7%', md: '-2 pp', vs: 'vs. setembro' },
    set: { label: 'Setembro de 2026', don: '567', delta: '+3%', appr: '81%', ad: '+1 pp', sla: '25h', sd: '+2h', miss: '9%', md: '+1 pp', vs: 'vs. agosto' },
    tri: { label: 'Último trimestre', don: '1.727', delta: '+11%', appr: '80%', ad: '+2 pp', sla: '22h', sd: '-3h', miss: '8%', md: '-1 pp', vs: 'vs. trimestre anterior' },
};

export default function Reports() {
    const { log, toast } = useStore();
    const [p, setP] = useState('out');
    const d = PERIODS[p];
    const exportIt = () => {
        downloadCsv(`relatorio-${p}.csv`, [['Indicador', 'Valor'], ['Doações no período', d.don], ['Taxa de aprovação', d.appr], ['Tempo de análise', d.sla], ['Faltas em agenda', d.miss], ...BLOCK_REASONS.map(([m, v]) => [`Bloqueio: ${m}`, `${v}%`])]);
        log('Exportou relatório', `Relatórios · ${d.label}`, 'Exportações');
        toast('Relatório exportado e registrado na auditoria.');
    };
    return (
        <>
            <PageHead title="Relatórios" plan="fase2" sub={`Indicadores da unidade · ${d.label}.`}
                actions={<><select className="select" style={{ width: 220 }} value={p} onChange={(e) => setP(e.target.value)}>{Object.entries(PERIODS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select><button className="btn" onClick={exportIt}><Download size={18} />Exportar CSV</button></>} />
            <div className="grid g4">
                <Kpi label="Doações no período" value={d.don} delta={d.delta} tone="green" foot={d.vs} icon={<Droplet size={22} />} />
                <Kpi label="Taxa de aprovação" value={d.appr} delta={d.ad} tone={d.ad.startsWith('-') ? 'amber' : 'green'} foot="na triagem" icon={<ClipboardCheck size={22} />} />
                <Kpi label="Tempo de análise" value={d.sla} delta={d.sd} tone={d.sd.startsWith('-') ? 'green' : 'amber'} foot="correções" icon={<Timer size={22} />} />
                <Kpi label="Faltas em agenda" value={d.miss} delta={d.md} tone={d.md.startsWith('-') ? 'green' : 'amber'} foot={d.vs} icon={<CalendarDays size={22} />} />
            </div>
            <div className="grid mt" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                <Card>
                    <CardHead title="Doações por mês (últimos 12 meses)" />
                    <div className="mini-bars">{MONTHS.map(([m, v], i) => <div key={m} className={`col ${i === 11 ? 'last' : ''}`}><b>{v}</b><i style={{ height: `${(v / 650) * 100}%` }} /><span>{m}</span></div>)}</div>
                </Card>
                <Card>
                    <CardHead title="Motivos de bloqueio na triagem" />
                    {BLOCK_REASONS.map(([m, v]) => <div key={m} style={{ padding: '10px 0' }}><div className="row between"><b style={{ fontSize: 13 }}>{m}</b><b style={{ color: 'var(--primary)' }}>{v}%</b></div><div className="hbar" style={{ gridTemplateColumns: '1fr', padding: '8px 0 0' }}><div className="track"><div className="fill" style={{ width: `${(v / 35) * 100}%`, background: 'var(--primary)' }} /></div></div></div>)}
                </Card>
            </div>
        </>
    );
}
