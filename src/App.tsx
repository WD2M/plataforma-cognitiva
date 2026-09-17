import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
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

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />

        <Route path="/login" element={<Login />} />

        <Route path="/catalogo" element={<ProtectedRoute><Catalogo /></ProtectedRoute>} />

        <Route path="/escenario/:id" element={<ProtectedRoute><Escenario /></ProtectedRoute> } />

        <Route path="/resultados" element={<ProtectedRoute><Resultados /></ProtectedRoute>} />

        <Route path="/administracion" element={<ProtectedAdmin><Administracion /></ProtectedAdmin>} />

        <Route path="/administracion/nuevo-escenario" element={<ProtectedAdmin><NuevoEscenario /></ProtectedAdmin>}/>

        <Route path='/registro' element={<Registro />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
