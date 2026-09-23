import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Clientes from './pages/Clientes';
import Dashboard from './pages/Dashboard';
import OrdensServico from './pages/OrdensServico';
import Veiculos from './pages/Veiculos';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/ordens-servico" element={<OrdensServico />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
