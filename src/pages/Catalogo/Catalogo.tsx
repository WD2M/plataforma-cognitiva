import { Link } from "react-router-dom";
import ScenarioCard from "../../components/ScenarioCard/ScenarioCard";
import "./Catalogo.css";

const scenarios = [
  {
    id: "memoria-001",
    title: "Memoria visual",
    description:
      "Escenario interactivo orientado a evaluar procesos relacionados con la memoria.",
    category: "Memoria",
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136",
      
    url: "https://wd2m.github.io/PruebaWebGL/"
  },

  {
    id: "atencion-001",
    title: "Atención selectiva",
    description:
      "Actividad interactiva enfocada en procesos relacionados con la atención.",
    category: "Atención",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    url: "https://wd2m.github.io/Landing_me/"
  },

  {
    id: "ejecutivo-001",
    title: "Funciones ejecutivas",
    description:
      "Escenario diseñado para trabajar diferentes procesos de las funciones ejecutivas.",
    category: "Funciones ejecutivas",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",
    url: "https://wd2m.github.io/PruebaWebGL/"
  },
  {
    id: "memoria-002",
    title: "Memoria visual",
    description:
      "Escenario interactivo orientado a evaluar procesos relacionados con la memoria.",
    category: "Memoria",
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136",
    url: "https://wd2m.github.io/PruebaWebGL/"
  },

  {
    id: "atencion-002",
    title: "Atención selectiva",
    description:
      "Actividad interactiva enfocada en procesos relacionados con la atención.",
    category: "Atención",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    url: "https://wd2m.github.io/PruebaWebGL/"
  },

  {
    id: "ejecutivo-002",
    title: "Funciones ejecutivas",
    description:
      "Escenario diseñado para trabajar diferentes procesos de las funciones ejecutivas.",
    category: "Funciones ejecutivas",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",
    url: "https://wd2m.github.io/PruebaWebGL/"
  },

  {
    id: "atencion-003",
    title: "Atención selectiva",
    description:
      "Actividad interactiva enfocada en procesos relacionados con la atención.",
    category: "Atención",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    url: "https://wd2m.github.io/PruebaWebGL/"
  },

  {
    id: "ejecutivo-003",
    title: "Funciones ejecutivas",
    description:
      "Escenario diseñado para trabajar diferentes procesos de las funciones ejecutivas.",
    category: "Funciones ejecutivas",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",
    url: "https://wd2m.github.io/PruebaWebGL/"
  }
];


function Catalogo() {
  return (
    <div className="home-page">

      {/* =====================================
          NAVBAR
      ====================================== */}

      <header className="home-navbar">

        <Link to="/" className="home-brand">
          <div className="home-brand-icon">
            Ψ
          </div>

          <span>LAPSUCC</span>
        </Link>


        <nav className="home-nav">

          <Link to="/" >
            Inicio
          </Link>

          <Link to="/catalogo" className="active">
            Escenarios
          </Link>

          <Link to="/resultados">
            Mi progreso
          </Link>

        </nav>


        <div className="home-user">

          <div className="home-user-info">
            <strong>
              Usuario
            </strong>

            <span>
              Participante
            </span>
          </div>

          <div className="home-avatar">
            U
          </div>

        </div>

      </header>

       <main className="catalogo">

        <section className="scenario-grid">

          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario} />
          ))}

        </section>

      </main>
    </div>
   
  );
}

export default Catalogo;