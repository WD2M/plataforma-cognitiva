import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScenarioCard from "../../components/ScenarioCard/ScenarioCard";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import "./Catalogo.css";

interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  url: string;
}

const defaultImages: Record<string, string> = {
  memoria:
    "https://images.unsplash.com/photo-1544717305-2782549b5136",
  atención:
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
  "funciones ejecutivas":
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",
};

function Catalogo() {
  const { perfil } = useAuth();

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function cargarEscenarios() {
      try {
        setLoading(true);
        setError("");

        const consulta = query(
          collection(db, "escenarios"),
          where("activo", "==", true)
        );

        const resultado = await getDocs(consulta);

        const escenariosCargados: Scenario[] =
          resultado.docs.map((documento) => {
            const data = documento.data();

            const categoria =
              data.categoria ?? data.category ?? "General";

            const titulo =
              data.titulo ?? data.title ?? "Escenario sin título";

            const claveCategoria = String(categoria).toLowerCase();

            return {
              id: documento.id,
              title: titulo,
              description:
                data.descripcion ??
                data.description ??
                "Explora esta actividad interactiva.",
              category: categoria,
              image:
                data.image ??
                data.imagen ??
                defaultImages[claveCategoria] ??
                defaultImages.memoria,
              // Abre el escenario dentro de la plataforma.
              url: `/escenario/${documento.id}`,
            };
          });

        if (!cancelado) {
          setScenarios(escenariosCargados);
        }
      } catch (err) {
        console.error("Error cargando escenarios:", err);

        if (!cancelado) {
          setError(
            "No fue posible cargar los escenarios. Intenta nuevamente."
          );
        }
      } finally {
        if (!cancelado) {
          setLoading(false);
        }
      }
    }

    cargarEscenarios();

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <div className="home-page">
      <header className="home-navbar">
        <Link to="/" className="home-brand">
          <div className="home-brand-icon">Ψ</div>
          <span>Increase</span>
        </Link>

        <nav className="home-nav">
          <Link to="/">Inicio</Link>
          <Link to="/catalogo" className="active">
            Escenarios
          </Link>
          <Link to="/resultados">Mi progreso</Link>
        </nav>

        <div className="home-user">
          <div className="home-user-info">
            <strong>
              {perfil
                ? perfil.nombre
                : "Cargando..."}
            </strong>

            <span>
              {perfil
                ? perfil.rol
                : "Cargando..."}
            </span>
          </div>

          <Link
            to="/perfil"
            className="home-avatar"
            aria-label="Ver mi perfil"
          >
            {perfil?.nombre?.charAt(0).toUpperCase() ?? "U"}
          </Link>
        </div>
      </header>

      <main className="catalogo">
        <section className="catalogo-heading">
          <div>
            <span className="catalogo-eyebrow">
              PLATAFORMA COGNITIVA
            </span>

            <h1>Explora los escenarios</h1>

            <p>
              Descubre actividades interactivas para explorar
              diferentes procesos cognitivos.
            </p>
          </div>

          {!loading && !error && (
            <span className="catalogo-count">
              {scenarios.length}{" "}
              {scenarios.length === 1
                ? "escenario disponible"
                : "escenarios disponibles"}
            </span>
          )}
        </section>

        {loading && (
          <div className="catalogo-message">
            Cargando escenarios...
          </div>
        )}

        {!loading && error && (
          <div className="catalogo-message catalogo-error">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Volver a intentar
            </button>
          </div>
        )}

        {!loading && !error && scenarios.length === 0 && (
          <div className="catalogo-message">
            <h2>Aún no hay escenarios disponibles</h2>
            <p>
              Cuando se publiquen nuevos escenarios, aparecerán aquí.
            </p>
          </div>
        )}

        {!loading && !error && scenarios.length > 0 && (
          <section className="scenario-grid">
            {scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default Catalogo;