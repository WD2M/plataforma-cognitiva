import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../../services/authService";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [, setError] = useState("");
  const [, setCargando] = useState(false);

  const handleLogin = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setError("");

  try {
    setCargando(true);

    await iniciarSesion(email, password);

    navigate("/");

  } catch (error: any) {

    console.error(error);

    if (
      error.code === "auth/invalid-credential"
    ) {
      setError("Correo o contraseña incorrectos.");
    } else {
      setError("No fue posible iniciar sesión.");
    }

  } finally {
    setCargando(false);
  }
};
  return (
    <div className="login-page">

      {/* Panel izquierdo */}
      <section className="login-info">

        <div className="brand">
          <div className="brand-icon">Ψ</div>
          <span>LAPSUCC</span>
        </div>

        <div className="info-content">
          <span className="welcome-tag">PLATAFORMA INTERACTIVA</span>

          <h1>
            Explora.
            <br />
            Aprende.
            <br />
            <span>Descubre.</span>
          </h1>

          <p>
            Plataforma web de escenarios interactivos para el estudio
            y evaluación de constructos psicológicos.
          </p>

          <div className="info-features">
            <div className="feature">
              <div className="feature-icon">◈</div>
              <div>
                <strong>Escenarios interactivos</strong>
                <span>Experiencias diseñadas para el aprendizaje.</span>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">◉</div>
              <div>
                <strong>Seguimiento de resultados</strong>
                <span>Consulta tu progreso y desempeño.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="info-footer">
          © 2026 LAPSUCC · Universidad Católica de Colombia
        </div>

      </section>


      {/* Panel derecho */}
      <section className="login-form-section">

        <div className="login-container">

          <div className="mobile-logo">
            <div className="brand-icon">Ψ</div>
            <span>LAPSUCC</span>
          </div>

          <div className="login-header">
            <h2>Bienvenido de nuevo</h2>
            <p>
              Ingresa a tu cuenta para continuar.
            </p>
          </div>


          <form onSubmit={handleLogin} className="login-form">

            <div className="input-group">
              <label htmlFor="email">
                Correo electrónico
              </label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>


            <div className="input-group">
              <div className="password-label">
                <label htmlFor="password">
                  Contraseña
                </label>

                <a href="#">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">●</span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Mostrar contraseña"
                >
                  {showPassword ? "◉" : "○"}
                </button>
              </div>
            </div>


            <div className="login-options">

              <label className="remember">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>

            </div>


            <button
              type="submit"
              className="login-button"
            >
              Iniciar sesión
              <span>→</span>
            </button>

          </form>


          <div className="divider">
            <span>o</span>
          </div>


          <button className="guest-button">
            Explorar como invitado
          </button>


          <p className="register-text">
            ¿Aún no tienes una cuenta?{" "}
            <a href="/registro">
              Crear cuenta
            </a>
          </p>

        </div>

      </section>

    </div>
  );
}

export default Login;