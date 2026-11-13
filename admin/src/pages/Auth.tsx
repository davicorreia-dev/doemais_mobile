import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BadgeCheck, CheckCircle2, Circle, ClipboardCheck, Clock3, Droplets, Eye, EyeOff, Hospital, Info, Lock, LogOut, Mail, QrCode, ShieldCheck, Smartphone, Timer } from 'lucide-react';
import { Logo } from '../components/Logo';
import { PlanTag, Toasts, Field } from '../components/ui';
import { useStore } from '../state/store';
import { UNITS } from '../data/mock';

function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="auth">
            <div className="brand-panel">
                <Logo width={180} color="#fff" />
                <div className="eyebrow">PAINEL DO AGENTE DE SAÚDE</div>
                <h2>Cuide de quem doa.</h2>
                <p className="lead">Triagens, correções, agenda e estoque do seu hemocentro em um só lugar.</p>
                <div style={{ marginTop: 40 }}>
                    <div className="benefit"><span className="ic"><ShieldCheck size={22} /></span>Acesso restrito a profissionais credenciados</div>
                    <div className="benefit"><span className="ic"><ClipboardCheck size={22} /></span>Triagens e correções em tempo real</div>
                    <div className="benefit"><span className="ic"><Droplets size={22} /></span>Estoque e campanhas integrados</div>
                </div>
                <div className="lgpd"><Lock size={16} />Acesso monitorado · conformidade LGPD</div>
            </div>
            <div className="form-side"><span className="plan-corner"><PlanTag plan="mvp" /></span>{children}</div>
            <Toasts />
        </div>
    );
}

export function Login() {
    const nav = useNavigate();
    const { toast } = useStore();
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [show, setShow] = useState(false);
    const [err, setErr] = useState<{ email?: string; pwd?: string }>({});
    const submit = (e: FormEvent) => {
        e.preventDefault();
        const next: typeof err = {};
        if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Informe um e-mail institucional válido.';
        if (pwd.length < 4) next.pwd = 'Informe a senha.';
        setErr(next);
        if (Object.keys(next).length === 0) nav('/2fa');
    };
    return (
        <AuthLayout>
            <form className="form" onSubmit={submit} noValidate>
                <h1>Acesse o painel</h1>
                <p className="lead">Use seu e-mail institucional e a senha do hemocentro.</p>
                <div className="stack">
                    <Field label="E-mail institucional" error={err.email}>
                        <div className="input-wrap"><Mail size={22} /><input className={`input ${err.email ? 'invalid' : ''}`} placeholder="nome@hemocentro.pe.gov.br" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                    </Field>
                    <Field label="Senha" error={err.pwd}>
                        <div className="input-wrap"><Lock size={22} /><input className={`input ${err.pwd ? 'invalid' : ''}`} type={show ? 'text' : 'password'} placeholder="Sua senha" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                            <button type="button" className="eye" onClick={() => setShow(!show)}>{show ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>
                    </Field>
                    <div className="row between small">
                        <label className="check"><input type="checkbox" defaultChecked /> Manter conectado neste dispositivo</label>
                        <Link to="/recuperar" style={{ color: 'var(--primary)', fontWeight: 600 }}>Esqueci minha senha</Link>
                    </div>
                    <button className="btn lg block" type="submit">Entrar</button>
                </div>
                <div className="or">ou</div>
                <button className="btn lg block outline" type="button" onClick={() => { toast('gov.br simulado: redirecionando para a verificação.'); nav('/2fa'); }}><BadgeCheck size={20} />Entrar com gov.br</button>
                <div className="note red" style={{ marginTop: 22 }}><Info size={22} style={{ flex: 'none' }} /><span>Primeiro acesso? Solicite as credenciais ao gestor da sua unidade. Todas as ações no painel ficam registradas para auditoria. <Link to="/primeiro-acesso" style={{ fontWeight: 700 }}>Tenho um convite</Link></span></div>
            </form>
        </AuthLayout>
    );
}

export function TwoFactor() {
    const nav = useNavigate();
    const { toast } = useStore();
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [left, setLeft] = useState(300);
    const [app, setApp] = useState(false);
    const refs = useRef<(HTMLInputElement | null)[]>([]);
    useEffect(() => { const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000); return () => clearInterval(t); }, []);
    const set = (i: number, v: string) => {
        const c = v.replace(/\D/g, '').slice(-1);
        setDigits((d) => d.map((x, k) => (k === i ? c : x)));
        if (c && i < 5) refs.current[i + 1]?.focus();
    };
    const full = digits.every(Boolean);
    const mm = String(Math.floor(left / 60)).padStart(2, '0');
    const ss = String(left % 60).padStart(2, '0');
    return (
        <AuthLayout>
            <div className="form">
                <span className="avatar soft lg" style={{ borderRadius: 24 }}><Smartphone size={34} /></span>
                <h1 style={{ marginTop: 22 }}>Verificação em duas etapas</h1>
                <p className="lead">{app ? 'Digite o código de 6 dígitos gerado no seu aplicativo autenticador.' : 'Digite o código de 6 dígitos enviado para m***@hemocentro.pe.gov.br.'}</p>
                <div className="otp">
                    {digits.map((d, i) => (
                        <input key={i} ref={(el) => { refs.current[i] = el; }} value={d} inputMode="numeric" autoFocus={i === 0} onChange={(e) => set(i, e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus(); }} />
                    ))}
                </div>
                <div className="row between small bold" style={{ margin: '18px 0 26px', color: '#666' }}>
                    <span><Timer size={14} style={{ verticalAlign: -2 }} /> {left > 0 ? `O código expira em ${mm}:${ss}` : 'Código expirado'}</span>
                    <button className="btn sm ghost" style={{ border: 0, color: 'var(--primary)' }} onClick={() => { setLeft(300); toast('Novo código enviado.'); }}>Reenviar código</button>
                </div>
                <button className="btn lg block" disabled={!full || left === 0} onClick={() => nav('/unidade')}>Verificar e entrar</button>
                <p className="small" style={{ textAlign: 'center', marginTop: 22 }}><button className="btn sm ghost" style={{ border: 0, color: 'var(--primary)' }} onClick={() => setApp(!app)}>{app ? 'Receber código por e-mail' : 'Usar aplicativo autenticador'}</button></p>
                <p className="small" style={{ textAlign: 'center' }}><Link to="/login" className="muted">Voltar ao login</Link></p>
                <p className="small muted" style={{ textAlign: 'center', marginTop: 14 }}>Protótipo: qualquer código de 6 dígitos é aceito.</p>
            </div>
        </AuthLayout>
    );
}

export function UnitSelect() {
    const nav = useNavigate();
    const { chooseUnit, authed, unitId, logout } = useStore();
    const [sel, setSel] = useState(authed ? unitId : 'rec');
    const chosen = UNITS.find((u) => u.id === sel)!;
    return (
        <div style={{ minHeight: '100%', background: 'var(--bg)' }}>
            <div style={{ background: 'var(--dark)', height: 88, display: 'flex', alignItems: 'center', padding: '0 48px', gap: 16 }}>
                <Logo width={110} color="#fff" />
                <span className="right small" style={{ color: '#d7d0c8', fontWeight: 500 }}>Dra. Marina Lopes · Agente de saúde</span>
                <button className="icon-btn" style={{ color: '#d7d0c8' }} onClick={() => { logout(); nav('/login'); }}><LogOut size={22} /></button>
            </div>
            <div style={{ padding: '56px 24px', textAlign: 'center' }}>
                <h1 style={{ fontSize: 34, fontWeight: 800, color: '#1f2937' }}>Selecione a unidade de trabalho <PlanTag plan="mvp" /></h1>
                <p style={{ color: '#666', margin: '12px 0 40px' }}>Você tem acesso a mais de uma unidade. Escolha onde vai atuar neste turno.</p>
                <div className="units">
                    {UNITS.map((u) => (
                        <button key={u.id} className={`unit-card ${sel === u.id ? 'on' : ''}`} onClick={() => setSel(u.id)}>
                            <div className="ic"><Hospital size={32} /></div>
                            <div className="row between"><b style={{ fontSize: 18 }}>{u.name}</b>{sel === u.id && <CheckCircle2 color="#e0323c" />}</div>
                            <p className="muted small" style={{ margin: '10px 0 16px' }}>{u.address}</p>
                            <span className={`chip ${u.role === 'Gestor' ? 'amber' : 'blue'}`}>{u.role}</span>
                            <div className="row small bold" style={{ marginTop: 18, color: u.open ? 'var(--green)' : 'var(--red)' }}><Clock3 size={16} />{u.hours}</div>
                        </button>
                    ))}
                </div>
                <button className="btn lg" style={{ marginTop: 40, minWidth: 320 }} onClick={() => { chooseUnit(sel); nav('/visao-geral'); }}>Continuar para {chosen.short}</button>
                <p className="small muted" style={{ marginTop: 18 }}>Você pode trocar de unidade depois, pelo menu do perfil.</p>
            </div>
            <Toasts />
        </div>
    );
}

export function Recover() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [err, setErr] = useState('');
    const { toast } = useStore();
    return (
        <AuthLayout>
            <div className="form">
                {!sent ? (
                    <form onSubmit={(e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) { setErr('Informe um e-mail institucional válido.'); return; } setSent(true); }} noValidate>
                        <h1>Recuperar acesso</h1>
                        <p className="lead">Informe seu e-mail institucional. Enviaremos um link para redefinir a senha.</p>
                        <div className="stack">
                            <Field label="E-mail institucional" error={err}><div className="input-wrap"><Mail size={22} /><input className={`input ${err ? 'invalid' : ''}`} placeholder="nome@hemocentro.pe.gov.br" value={email} onChange={(e) => { setEmail(e.target.value); setErr(''); }} /></div></Field>
                            <button className="btn lg block">Enviar link de redefinição</button>
                            <div className="note gray"><Timer size={22} style={{ flex: 'none' }} /><span>O link expira em 15 minutos e só pode ser usado uma vez. Por segurança, o 2º fator será solicitado ao entrar.</span></div>
                        </div>
                    </form>
                ) : (
                    <div>
                        <span className="avatar lg" style={{ background: '#00c853', borderRadius: '50%' }}><CheckCircle2 size={40} /></span>
                        <h1 style={{ marginTop: 22 }}>Verifique seu e-mail</h1>
                        <p className="lead">Se <b>{email}</b> estiver cadastrado, você receberá um link para criar uma nova senha em instantes.</p>
                        <button className="btn lg block ghost" onClick={() => toast('Link reenviado.')}>Reenviar link</button>
                    </div>
                )}
                <p className="small" style={{ textAlign: 'center', marginTop: 26 }}><Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Voltar ao login</Link></p>
            </div>
        </AuthLayout>
    );
}

export function FirstAccess() {
    const nav = useNavigate();
    const { chooseUnit } = useStore();
    const [pwd, setPwd] = useState('');
    const [conf, setConf] = useState('');
    const [code, setCode] = useState('');
    const rules = [
        ['Ao menos 10 caracteres', pwd.length >= 10],
        ['Letra maiúscula e minúscula', /[a-z]/.test(pwd) && /[A-Z]/.test(pwd)],
        ['Um número e um símbolo', /\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)],
    ] as const;
    const ok = rules.every((r) => r[1]) && pwd === conf && code.length === 6;
    return (
        <AuthLayout>
            <div className="form">
                <h1>Primeiro acesso</h1>
                <p className="lead">Defina uma senha forte e configure a verificação em duas etapas.</p>
                <div className="stack" style={{ gap: 14 }}>
                    <Field label="Nova senha"><div className="input-wrap"><Lock size={22} /><input className="input" type="password" placeholder="Mínimo 10 caracteres" value={pwd} onChange={(e) => setPwd(e.target.value)} /></div></Field>
                    <Field label="Confirmar senha" error={conf && pwd !== conf ? 'As senhas não conferem.' : ''}><div className="input-wrap"><Lock size={22} /><input className="input" type="password" placeholder="Repita a senha" value={conf} onChange={(e) => setConf(e.target.value)} /></div></Field>
                    <div>{rules.map(([t, v]) => <div key={t} className={`rule ${v ? 'ok' : ''}`}>{v ? <CheckCircle2 size={18} /> : <Circle size={18} />}{t}</div>)}</div>
                    <div className="card row" style={{ alignItems: 'flex-start', gap: 20, padding: 20 }}>
                        <div style={{ width: 130, height: 130, borderRadius: 12, background: 'var(--gray-bg)', display: 'grid', placeItems: 'center', flex: 'none' }}><QrCode size={64} /></div>
                        <div style={{ flex: 1 }}>
                            <b>Escaneie no seu app autenticador</b>
                            <p className="small muted" style={{ margin: '6px 0 12px', lineHeight: 1.4 }}>Google Authenticator, Microsoft Authenticator ou similar. Depois digite o código de 6 dígitos.</p>
                            <input className="input" style={{ height: 44 }} placeholder="Código de 6 dígitos" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
                        </div>
                    </div>
                    <button className="btn lg block" disabled={!ok} onClick={() => { chooseUnit('rec'); nav('/visao-geral'); }}>Ativar e entrar</button>
                    <p className="small" style={{ textAlign: 'center' }}><Link to="/login" className="muted">Voltar ao login</Link></p>
                </div>
            </div>
        </AuthLayout>
    );
}
