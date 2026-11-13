import { useState } from 'react';
import { Check, Minus, ShieldCheck, ShieldOff, UserPlus } from 'lucide-react';
import { Avatar, Card, CardHead, Chip, Field, Modal, PageHead } from '../components/ui';
import { useStore } from '../state/store';
import { UNITS, type Role } from '../data/mock';

const PERMS: [string, Role[]][] = [
    ['Triagens e correções', ['Gestor', 'Agente']], ['Atendimento e agenda', ['Gestor', 'Agente']], ['Estoque (editar)', ['Gestor']],
    ['Pedidos e campanhas', ['Gestor', 'Agente']], ['Relatórios', ['Gestor']], ['Equipe e auditoria', ['Gestor']],
];

export default function Team() {
    const { members, inviteMember, setMemberRole, toggleMember, unit } = useStore();
    const [modal, setModal] = useState(false);
    const [f, setF] = useState({ name: '', email: '', title: '', role: 'Agente' as Role, unit: UNITS[0].short });
    const canEdit = unit.role === 'Gestor';
    const valid = f.name.trim().length > 2 && /^\S+@\S+\.\S+$/.test(f.email);
    return (
        <>
            <PageHead title="Equipe e permissões" plan="mvp" sub="Gerencie quem acessa o painel, com papéis, 2FA e unidades."
                actions={<button className="btn" onClick={() => setModal(true)} disabled={!canEdit} title={canEdit ? '' : 'Apenas gestores convidam'}><UserPlus size={18} />Convidar agente</button>} />
            {!canEdit && <div className="note amber" style={{ marginBottom: 16 }}>Você está em uma unidade onde seu papel é Agente: só gestores alteram a equipe. Troque de unidade pelo menu do perfil para testar o fluxo de gestor.</div>}
            <div className="grid" style={{ gridTemplateColumns: '1fr 320px', alignItems: 'start' }}>
                <Card style={{ padding: 0 }}>
                    <table>
                        <thead><tr><th>AGENTE</th><th>PAPEL</th><th>2FA</th><th>ÚLTIMO ACESSO</th><th>STATUS</th></tr></thead>
                        <tbody>
                            {members.map((m) => (
                                <tr key={m.id} style={{ opacity: m.status === 'Inativo' ? 0.55 : 1 }}>
                                    <td><div className="cell-name"><Avatar name={m.name} /><div><b>{m.name}</b><span>{m.title} · {m.unit}</span></div></div></td>
                                    <td>{canEdit && m.id !== 1 ? <select className="select" style={{ height: 36, width: 120, fontSize: 12 }} value={m.role} onChange={(e) => setMemberRole(m.id, e.target.value as Role)}><option>Gestor</option><option>Agente</option><option>Leitura</option></select> : <Chip tone={m.role === 'Gestor' ? 'amber' : m.role === 'Agente' ? 'blue' : 'gray'}>{m.role}</Chip>}</td>
                                    <td>{m.twofa ? <ShieldCheck size={22} color="#2e7d32" /> : <ShieldOff size={22} color="#c62828" />}</td>
                                    <td className="small">{m.lastAccess}</td>
                                    <td><div className="row"><Chip tone={m.status === 'Ativo' ? 'green' : m.status === 'Inativo' ? 'gray' : 'amber'}>{m.status}</Chip>{canEdit && m.id !== 1 && <button className="btn sm ghost" onClick={() => toggleMember(m.id)}>{m.status === 'Inativo' ? 'Reativar' : 'Desativar'}</button>}</div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
                <Card>
                    <CardHead title="Papéis e permissões" />
                    <table style={{ fontSize: 12 }}>
                        <thead><tr><th style={{ padding: '8px 0', background: 'none' }} /><th style={{ padding: 6, background: 'none' }}>Gestor</th><th style={{ padding: 6, background: 'none' }}>Agente</th><th style={{ padding: 6, background: 'none' }}>Leit.</th></tr></thead>
                        <tbody>{PERMS.map(([p, roles]) => <tr key={p}><td style={{ padding: '14px 0', fontWeight: 600 }}>{p}</td>{(['Gestor', 'Agente', 'Leitura'] as Role[]).map((r) => <td key={r} style={{ padding: 6, textAlign: 'center' }}>{roles.includes(r) ? <Check size={18} color="#2e7d32" /> : <Minus size={18} color="#c8c2ba" />}</td>)}</tr>)}</tbody>
                    </table>
                    <p className="small muted mt">Leitura: apenas visualização, sem dados pessoais sensíveis.</p>
                </Card>
            </div>
            {modal && (
                <Modal title="Convidar agente" lead="A pessoa recebe um e-mail para criar a senha e ativar o 2FA." onClose={() => setModal(false)}
                    footer={<><button className="btn ghost" onClick={() => setModal(false)}>Cancelar</button><button className="btn" disabled={!valid} onClick={() => { inviteMember(f); setModal(false); setF({ ...f, name: '', email: '', title: '' }); }}>Enviar convite</button></>}>
                    <div className="grid">
                        <Field label="Nome completo"><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
                        <Field label="E-mail institucional"><input className="input" placeholder="nome@hemocentro.pe.gov.br" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
                        <Field label="Cargo"><input className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
                        <div className="grid g2">
                            <Field label="Papel"><select className="select" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as Role })}><option>Agente</option><option>Gestor</option><option>Leitura</option></select></Field>
                            <Field label="Unidade"><select className="select" value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })}>{UNITS.map((u) => <option key={u.id}>{u.short}</option>)}</select></Field>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
