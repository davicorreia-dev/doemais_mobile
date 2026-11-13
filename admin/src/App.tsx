import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/Shell';
import { FirstAccess, Login, Recover, TwoFactor, UnitSelect } from './pages/Auth';
import Overview from './pages/Overview';
import { TriageDetail, Triages } from './pages/Triagens';
import Corrections from './pages/Correcoes';
import Agenda from './pages/Agenda';
import Attendance from './pages/Atendimento';
import Stock from './pages/Estoque';
import Requests from './pages/Pedidos';
import Donors from './pages/Doadores';
import Campaigns from './pages/Campanhas';
import Reports from './pages/Relatorios';
import Team from './pages/Equipe';
import Audit from './pages/Auditoria';
import Settings from './pages/Configuracoes';

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/2fa" element={<TwoFactor />} />
            <Route path="/unidade" element={<UnitSelect />} />
            <Route path="/recuperar" element={<Recover />} />
            <Route path="/primeiro-acesso" element={<FirstAccess />} />
            <Route element={<Shell />}>
                <Route path="/visao-geral" element={<Overview />} />
                <Route path="/triagens" element={<Triages />} />
                <Route path="/triagens/:id" element={<TriageDetail />} />
                <Route path="/correcoes" element={<Corrections />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/atendimento" element={<Attendance />} />
                <Route path="/estoque" element={<Stock />} />
                <Route path="/pedidos" element={<Requests />} />
                <Route path="/doadores" element={<Donors />} />
                <Route path="/campanhas" element={<Campaigns />} />
                <Route path="/relatorios" element={<Reports />} />
                <Route path="/equipe" element={<Team />} />
                <Route path="/auditoria" element={<Audit />} />
                <Route path="/configuracoes" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/visao-geral" replace />} />
        </Routes>
    );
}
