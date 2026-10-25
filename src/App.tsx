//import heroImg from './assets/hero.png'
//import reactLogo from './assets/react.svg'
//import viteLogo from './assets/vite.svg'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Inicio from "./pages/Inicio/Inicio";
import Catalogo from "./pages/Catalogo/Catalogo";
import Escenario from "./pages/Escenario/Escenario";
import Resultados from "./pages/Resultados/Resultados";
import Administracion from "./pages/Administracion/Administracion";
import Registro from './pages/Registro/Registro'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedAdmin from './components/ProtectedAdmin' 
import NuevoEscenario from "./pages/NuevoEscenario/NuevoEscenario";
import FormularioInicial from './pages/FormularioInicial/FormularioInicial';
import OnboardingGuard from './routes/OnboardingGuard';
import Perfil from './pages/Perfil/perfil';

import Prueba from './pages/Escenario/datos';


function App() {
  //const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path='/registro' element={<Registro />} />

        <Route path='/prueba' element={<Prueba />} />


        <Route path="/" element={<OnboardingGuard><Inicio /></OnboardingGuard>} />

        

        <Route path="/catalogo" element={<OnboardingGuard><Catalogo /></OnboardingGuard>} />

        <Route path="/escenario/:id" element={<OnboardingGuard><Escenario /></OnboardingGuard> } />

        <Route path="/resultados" element={<OnboardingGuard><Resultados /></OnboardingGuard>} />

        <Route path="/administracion" element={<ProtectedAdmin><Administracion /></ProtectedAdmin>} />
        <Route path='/perfil' element={<OnboardingGuard><Perfil /></OnboardingGuard>} />

        <Route path="/administracion/nuevo-escenario" element={<ProtectedAdmin><NuevoEscenario /></ProtectedAdmin>}/>

        

        <Route path="/formularioinicial" element={<ProtectedRoute><FormularioInicial /></ProtectedRoute>} />




      </Routes>
    </BrowserRouter>
  )
}

export default App
