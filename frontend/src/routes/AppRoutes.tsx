import { Routes, Route} from "react-router-dom";
import Home from "../pages/Home.tsx";
import Empresas from "../pages/Empresa.tsx";
import Fornecedores from "../pages/Fornecedores.tsx";
import Vinculos from "../pages/Vinculos.tsx";
import Consulta from "../pages/Consulta.tsx";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/vinculos" element={<Vinculos />} />
            <Route path="/consulta" element={<Consulta />} />
        </Routes>
    );
}