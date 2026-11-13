import { useState } from 'react';
import { Download } from 'lucide-react';
import { Card, PageHead, downloadCsv } from '../components/ui';
import { useStore } from '../state/store';
import type { AuditEntry } from '../data/mock';

type F = 'Todas' | AuditEntry['kind'];

export default function Audit() {
    const { audit, log, toast } = useStore();
    const [f, setF] = useState<F>('Todas');
    const rows = audit.filter((a) => f === 'Todas' || a.kind === f);
    const exportIt = () => {
        downloadCsv('auditoria.csv', [['Data', 'Agente', 'Ação', 'Alvo', 'Origem'], ...rows.map((a) => [a.at, a.agent, a.action, a.target, a.origin])]);
        log('Exportou registro de auditoria', `${rows.length} eventos`, 'Exportações');
        toast('Registro exportado.');
    };
    return (
        <>
            <PageHead title="Auditoria" plan="mvp" sub="Registro imutável de ações no painel, para conformidade com a LGPD. As ações que você faz no protótipo aparecem aqui."
                actions={<button className="btn ghost" onClick={exportIt}><Download size={18} />Exportar registro</button>} />
            <div className="pills" style={{ marginBottom: 16 }}>{(['Todas', 'Dados pessoais', 'Decisões', 'Acessos', 'Exportações'] as F[]).map((k) => <button key={k} className={`pill ${f === k ? 'on' : ''}`} onClick={() => setF(k)}>{k}</button>)}</div>
            <Card style={{ padding: 0 }}>
                <table>
                    <thead><tr><th>DATA E HORA</th><th>AGENTE</th><th>AÇÃO</th><th>ALVO</th><th>ORIGEM</th></tr></thead>
                    <tbody>
                        {rows.map((a) => (
                            <tr key={a.id}>
                                <td className="small" style={{ color: a.at === 'agora' ? 'var(--primary)' : undefined, fontWeight: a.at === 'agora' ? 800 : 500 }}>{a.at}</td>
                                <td><b>{a.agent}</b></td><td style={{ fontWeight: 600 }}>{a.action}</td><td className="muted">{a.target}</td><td className="small muted">{a.origin}</td>
                            </tr>
                        ))}
                        {rows.length === 0 && <tr><td colSpan={5}><div className="empty">Nenhum registro neste filtro.</div></td></tr>}
                    </tbody>
                </table>
                <p className="small muted" style={{ padding: 18 }}>Registros são imutáveis e mantidos por 5 anos · acesso a dados pessoais é sempre registrado.</p>
            </Card>
        </>
    );
}
