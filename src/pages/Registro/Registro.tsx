import { useState } from "react";
import "./Registro.css";

import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../../services/authService";

function Registro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setError("");

  if (password !== confirmPassword) {
    setError("Las contraseñas no coinciden.");
    return;
  }

  if (password.length < 6) {
    setError("La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  try {
    setCargando(true);

    await registrarUsuario(
      nombre,
      apellido,
      email,
      password
      
    );

    navigate("/");

  } catch (error: any) {

    console.error(error);

    if (error.code === "auth/email-already-in-use") {
      setError("Este correo ya está registrado.");
    } else if (error.code === "auth/invalid-email") {
      setError("El correo electrónico no es válido.");
    } else if (error.code === "auth/weak-password") {
      setError("La contraseña es demasiado débil.");
    } else {
      setError("No fue posible crear la cuenta.");
    }

  } finally {
    setCargando(false);
  }
};

{error && (
  <div className="form-error">
    {error}
  </div>
)}

  return (
    <div className="register-page">

      {/* =====================================
          PANEL IZQUIERDO
      ====================================== */}

      <section className="register-info">

        <div className="register-brand">
          <div className="register-brand-icon">Ψ</div>
          <span>LAPSUCC</span>
        </div>

        <div className="register-info-content">

          <span className="register-tag">
            CREA TU CUENTA
          </span>

          <h1>
            Comienza tu
            <br />
            <span>experiencia.</span>
          </h1>

          <p>
            Crea tu cuenta para acceder a los escenarios interactivos,
            realizar actividades y consultar tu progreso.
          </p>

          <div className="register-features">

            <div className="register-feature">
              <div className="register-feature-icon">
                ✓
              </div>

              <div>
                <strong>Acceso personalizado</strong>
                <span>
                  Guarda tus actividades y resultados.
                </span>
              </div>
            </div>

            <div className="register-feature">
              <div className="register-feature-icon">
                ◈
              </div>

              <div>
                <strong>Escenarios interactivos</strong>
                <span>
                  Explora diferentes actividades de evaluación.
                </span>
              </div>
            </div>

            <div className="register-feature">
              <div className="register-feature-icon">
                ◉
              </div>

              <div>
                <strong>Seguimiento</strong>
                <span>
                  Consulta tu progreso a través de la plataforma.
                </span>
              </div>
            </div>

          </div>

        </div>

        <div className="register-info-footer">
          © 2026 LAPSUCC · Universidad Católica de Colombia
        </div>

      </section>


      {/* =====================================
          FORMULARIO
      ====================================== */}

      <section className="register-form-section">

        <div className="register-container">

          {/* Logo para móvil */}

          <div className="register-mobile-logo">

            <div className="register-brand-icon">
              Ψ
            </div>

            <span>LAPSUCC</span>

          </div>


          {/* Encabezado */}

          <div className="register-header">

            <h2>
              Crear una cuenta
            </h2>

            <p>
              Completa tus datos para comenzar.
            </p>

          </div>


          <form onSubmit={handleRegistro} className="register-form">


            {/* Nombre */}

            <div className="register-row">

              <div className="register-input-group">

                <label htmlFor="firstName">
                  Nombre
                </label>

                <input
                  id="firstName"
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />

              </div>


              {/* Apellido */}

              <div className="register-input-group">

                <label htmlFor="lastName">
                  Apellido
                </label>

                <input
                  id="lastName"
                  type="text"
                  placeholder="Tu apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />

              </div>

            </div>


            {/* Correo */}

            <div className="register-input-group">

              <label htmlFor="email">
                Correo electrónico
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  ✉
                </span>

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


            {/* Contraseña */}

            <div className="register-input-group">

              <label htmlFor="password">
                Contraseña
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  ●
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "◉" : "○"}
                </button>

              </div>

              <span className="register-hint">
                Usa al menos 8 caracteres.
              </span>

            </div>


            {/* Confirmar contraseña */}

            <div className="register-input-group">

              <label htmlFor="confirmPassword">
                Confirmar contraseña
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  ●
                </span>

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? "◉" : "○"}
                </button>

              </div>

            </div>


            {/* Términos */}

            <label className="register-terms">

              <input
                type="checkbox"
                required
              />

              <span>
                Acepto los{" "}
                <a href="#">
                  términos y condiciones
                </a>{" "}
                de uso de la plataforma.
              </span>

            </label>


            {/* Botón */}

            <button
              type="submit"
              className="register-button"
              disabled={cargando}>
                {cargando ? "Creando cuenta..." : "Crear cuenta"}

              <span>
                →
              </span>
            </button>

          </form>


          {/* Login */}

          <p className="register-login">

            ¿Ya tienes una cuenta?

            {" "}

            <a href="/login">
              Iniciar sesión
            </a>

          </p>

        </div>

      </section>

    </div>
  );
}

export default Registro;