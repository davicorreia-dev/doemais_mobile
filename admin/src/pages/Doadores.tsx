import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ClipboardCheck, Download, Mail, Search } from 'lucide-react';
import { Avatar, Card, Chip, Drawer, PageHead, Pager, toneOfDonor, downloadCsv } from '../components/ui';
import { useStore } from '../state/store';
import type { Donor, DonorStatus } from '../data/mock';

type F = 'Todos' | 'Apto' | 'Inapto temporário' | 'Em triagem' | 'Bloqueada';
const PAGE = 9;

export default function Donors() {
    const nav = useNavigate();
    const [params] = useSearchParams();
    const { donors, triages, log, toast } = useStore();
    const [f, setF] = useState<F>('Todos');
    const [q, setQ] = useState(params.get('busca') ?? '');
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState<Donor | null>(null);
    const rows = useMemo(() => {
        const s = q.trim().toLowerCase();
        return donors.filter((d) => (f === 'Todos' || d.status === f) && (!s || d.name.toLowerCase().includes(s) || d.cpf.includes(s) || d.email.includes(s)));
    }, [donors, f, q]);
    const pages = Math.max(1, Math.ceil(rows.length / PAGE));
    const shown = rows.slice((page - 1) * PAGE, page * PAGE);
    const base = 3482;
    const cnt = (s: DonorStatus) => donors.filter((d) => d.status === s).length;
    const mask = (cpf: string) => `***.${cpf.slice(4, 7)}.${cpf.slice(8, 11)}-**`;
    const exportCsv = () => {
        downloadCsv('doadores-doemais.csv', [['Nome', 'CPF (mascarado)', 'Tipo', 'Cidade', 'Última doação', 'Status'], ...rows.map((d) => [d.name, mask(d.cpf), d.blood, d.city, d.lastDonation ?? '—', d.status])]);
        log('Exportou lista de doadores', `${rows.length} registros (CPF mascarado)`, 'Exportações');
        toast('CSV gerado com CPF mascarado e registrado na auditoria.');
    };
    return (
        <>
            <PageHead title="Doadores" plan="mvp" sub="Base de doadores cadastrados no app, com aptidão, histórico e contato." actions={<button className="btn ghost" onClick={exportCsv}><Download size={18} />Exportar CSV</button>} />
            <div className="row" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
                <div className="pills">
                    {([['Todos', base], ['Apto', 2104 + cnt('Apto')], ['Inapto temporário', 311 + cnt('Inapto temporário')], ['Em triagem', 421 + cnt('Em triagem')], ['Bloqueada', 12 + cnt('Bloqueada')]] as [F, number][]).map(([k, n]) => <button key={k} className={`pill ${f === k ? 'on' : ''}`} onClick={() => { setF(k); setPage(1); }}>{k === 'Bloqueada' ? 'Bloqueados' : k === 'Apto' ? 'Aptos' : k === 'Inapto temporário' ? 'Inaptos temporários' : k}  {n.toLocaleString('pt-BR')}</button>)}
                </div>
                <div className="input-wrap right" style={{ width: 300 }}><Search size={20} style={{ top: 12 }} /><input className="input" style={{ height: 44 }} placeholder="Nome, CPF ou e-mail" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div>
            </div>
            <Card style={{ padding: 0 }}>
                <table>
                    <thead><tr><th>DOADOR</th><th>TIPO</th><th>CIDADE</th><th>ÚLTIMA DOAÇÃO</th><th>STATUS</th></tr></thead>
                    <tbody>
                        {shown.map((d) => (
                            <tr key={d.id} className="click" onClick={() => setOpen(d)}>
                                <td><div className="cell-name"><Avatar name={d.name} /><div><b>{d.name}</b><span>{d.email}</span></div></div></td>
                                <td><b>{d.blood}</b></td><td>{d.city}</td><td>{d.lastDonation ?? '—'}{d.donations ? ` · ${d.donations} doação${d.donations > 1 ? 'ões' : ''}`.replace('doaçãoões', 'doações') : ' · nunca doou'}</td>
                                <td><Chip tone={toneOfDonor(d.status)}>{d.status === 'Inapto temporário' && d.until ? `Inapto · até ${d.until.replace(' 2027', '')}` : d.status}</Chip></td>
                            </tr>
                        ))}
                        {shown.length === 0 && <tr><td colSpan={5}><div className="empty">Nenhum doador encontrado.</div></td></tr>}
                    </tbody>
                </table>
                <div className="row between"><span className="small muted" style={{ padding: '0 16px' }}>Mostrando {shown.length} de {rows.length} (amostra do protótipo; base real: {base.toLocaleString('pt-BR')})</span><Pager page={page} pages={pages} onChange={setPage} /></div>
            </Card>
            {open && (
                <Drawer onClose={() => setOpen(null)}>
                    <div className="row" style={{ gap: 16 }}><Avatar name={open.name} size="lg" /><div><b style={{ fontSize: 20 }}>{open.name}</b><div style={{ marginTop: 8 }}><Chip tone={toneOfDonor(open.status)}>{open.status}</Chip></div></div></div>
                    <dl className="dl mt2">
                        <dt>Tipo sanguíneo</dt><dd>{open.blood}</dd><dt>CPF</dt><dd>{mask(open.cpf)}</dd><dt>E-mail</dt><dd>{open.email}</dd><dt>Telefone</dt><dd>{open.phone}</dd>
                        <dt>Cidade</dt><dd>{open.city} · PE</dd><dt>Idade · gênero</dt><dd>{open.age} anos · {open.gender}</dd><dt>Peso</dt><dd>{open.weight} kg</dd><dt>Última doação</dt><dd>{open.lastDonation ?? 'Nunca doou'}</dd><dt>Total de doações</dt><dd>{open.donations}</dd>
                    </dl>
                    <div className="note gray mt">Dados pessoais completos só aparecem aqui para quem tem o papel adequado, e cada visualização fica registrada na auditoria.</div>
                    <div className="grid mt2">
                        <button className="btn" onClick={() => { const t = triages.find((x) => x.donorId === open.id); if (t) nav(`/triagens/${t.id}`); else toast('Este doador ainda não enviou triagem.', 'err'); }}><ClipboardCheck size={18} />Ver triagem</button>
                        <button className="btn outline" onClick={() => { log('Enviou mensagem ao doador', open.name, 'Dados pessoais'); toast(`Mensagem enviada para ${open.name} (simulado).`); }}><Mail size={18} />Enviar mensagem</button>
                    </div>
                </Drawer>
            )}
        </>
    );
}
