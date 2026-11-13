import { useState } from 'react';
import { Check } from 'lucide-react';
import { Card, CardHead, Field, PageHead } from '../components/ui';
import { useStore, type UnitConfig } from '../state/store';

export default function Settings() {
    const { config, saveConfig, unit } = useStore();
    const [c, setC] = useState<UnitConfig>({ ...config, slots: { ...config.slots } });
    const dirty = JSON.stringify(c) !== JSON.stringify(config);
    const num = (k: keyof UnitConfig) => (e: React.ChangeEvent<HTMLInputElement>) => setC({ ...c, [k]: Number(e.target.value.replace(',', '.')) });
    const txt = (k: keyof UnitConfig) => (e: React.ChangeEvent<HTMLInputElement>) => setC({ ...c, [k]: e.target.value });
    const canEdit = unit.role === 'Gestor';
    return (
        <>
            <PageHead title="Configurações da unidade" plan="fase2" sub={`Regras de triagem, capacidade e metas · ${unit.name}.`}
                actions={<button className="btn" disabled={!dirty || !canEdit} onClick={() => saveConfig(c)}><Check size={18} />Salvar alterações</button>} />
            {!canEdit && <div className="note amber" style={{ marginBottom: 16 }}>Somente gestores alteram as configurações. Troque de unidade pelo menu do perfil para editar.</div>}
            {dirty && canEdit && <div className="note blue" style={{ marginBottom: 16 }}>Você tem alterações não salvas.</div>}
            <fieldset disabled={!canEdit} style={{ border: 0, padding: 0, margin: 0 }}>
                <div className="grid g2">
                    <Card>
                        <CardHead title="Dados da unidade" />
                        <div className="grid">
                            <Field label="Nome"><input className="input" value={c.name} onChange={txt('name')} /></Field>
                            <Field label="Endereço"><input className="input" value={c.address} onChange={txt('address')} /></Field>
                            <div className="grid g2"><Field label="Telefone"><input className="input" value={c.phone} onChange={txt('phone')} /></Field><Field label="Horário"><input className="input" value={c.hours} onChange={txt('hours')} /></Field></div>
                        </div>
                    </Card>
                    <Card>
                        <CardHead title="Capacidade de agendamento" />
                        {Object.entries(c.slots).map(([h, v]) => (
                            <div className="list-item" key={h}><b style={{ flex: 1 }}>{h}</b><input className="input" type="number" min={0} style={{ width: 120, height: 42 }} value={v} onChange={(e) => setC({ ...c, slots: { ...c.slots, [h]: Number(e.target.value) } })} /><span className="small muted">vagas</span></div>
                        ))}
                    </Card>
                    <Card>
                        <CardHead title="Regras de triagem" sub="Mudanças valem para novas triagens e ficam registradas na auditoria." />
                        <div className="grid g2">
                            <Field label="Intervalo mínimo · homens (dias)"><input className="input" type="number" value={c.menInterval} onChange={num('menInterval')} /></Field>
                            <Field label="Intervalo mínimo · mulheres (dias)"><input className="input" type="number" value={c.womenInterval} onChange={num('womenInterval')} /></Field>
                            <Field label="Hemoglobina mínima (g/dL)"><input className="input" value={c.hemoglobin} onChange={num('hemoglobin')} /></Field>
                            <Field label="Peso mínimo (kg)"><input className="input" type="number" value={c.weight} onChange={num('weight')} /></Field>
                            <Field label="Validade da bolsa (dias)"><input className="input" type="number" value={c.bagValidity} onChange={num('bagValidity')} /></Field>
                        </div>
                    </Card>
                    <Card>
                        <CardHead title="Metas e alertas" />
                        <div className="grid">
                            <Field label="Prazo para analisar correções (horas)"><input className="input" type="number" value={c.slaHours} onChange={num('slaHours')} /></Field>
                            <Field label="Estoque mínimo por tipo (bolsas)"><input className="input" type="number" value={c.minStock} onChange={num('minStock')} /></Field>
                            <Field label="Alerta de vencimento (dias antes)"><input className="input" type="number" value={c.expiryAlert} onChange={num('expiryAlert')} /></Field>
                        </div>
                    </Card>
                </div>
            </fieldset>
        </>
    );
}
