import { useState, type FormEvent } from "react";
//import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import "./FormularioInicial.css";

const objetivos = [
  "Mejorar mis capacidades cognitivas",
  "Mejorar mi memoria",
  "Mejorar mi atención y concentración",
  "Mejorar mis funciones ejecutivas",
  "Mejorar mi velocidad de procesamiento",
  "Mantener mi autonomía",
  "Estimular mis procesos cognitivos cotidianamente",
  "Explorar mis capacidades cognitivas",
];

const escalaLikert = [
  "Nunca",
  "Casi nunca",
  "A veces",
  "Casi siempre",
  "Siempre",
];

function FormularioInicial() {
  const { user } = useAuth();
  //const navigate = useNavigate();

  const [documento, setDocumento] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [escolaridad, setEscolaridad] = useState("");
  const [ocupacionActual, setOcupacionActual] = useState("");
  const [ocupacionAnterior, setOcupacionAnterior] = useState("");
  const [idiomaMaterno, setIdiomaMaterno] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [olvidos, setOlvidos] = useState("");
  const [atencion, setAtencion] = useState("");
  const [objetivosSeleccionados, setObjetivosSeleccionados] =
    useState<string[]>([]);
  const [consentimiento, setConsentimiento] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  function alternarObjetivo(objetivo: string) {
    setObjetivosSeleccionados((actuales) =>
      actuales.includes(objetivo)
        ? actuales.filter((item) => item !== objetivo)
        : [...actuales, objetivo]
    );
  }

  async function guardarFormulario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!user) {
      setError("Tu sesión no está activa. Inicia sesión nuevamente.");
      return;
    }

    if (!consentimiento) {
      setError("Debes confirmar que has leído el aviso de privacidad.");
      return;
    }

    if (objetivosSeleccionados.length === 0) {
      setError("Selecciona al menos un objetivo.");
      return;
    }

    setGuardando(true);

    try {
      const lote = writeBatch(db);
      const referenciaUsuario = doc(db, "users", user.uid);
      const referenciaCaracterizacion = doc(
        collection(db, "caracterizaciones"),
        user.uid
      );

      lote.set(referenciaCaracterizacion, {
        usuarioId: user.uid,
        documento: documento.trim(),
        edad: Number(edad),
        genero,
        escolaridad,
        ocupacionActual: ocupacionActual.trim(),
        ocupacionAnterior: ocupacionAnterior.trim(),
        idiomaMaterno: idiomaMaterno.trim(),
        ciudad: ciudad.trim(),
        diagnosticoDificultad: diagnostico,
        frecuenciaOlvidos: Number(olvidos),
        percepcionDificultadesAtencion: Number(atencion),
        objetivos: objetivosSeleccionados,
        consentimientoPrivacidad: true,
        fechaActualizacion: serverTimestamp(),
      });

      const datosUpdateUsuario: Record<string, any> = {
        estado: true,
      };
      if (documento.trim()) {
        datosUpdateUsuario.documento = documento.trim();
      }
      lote.update(referenciaUsuario, datosUpdateUsuario);

      await lote.commit();

      // Recarga el perfil de AuthContext para que la aplicación
      // reconozca el formulario como completado.
      window.location.replace("/");
    } catch (err) {
      console.error("Error guardando caracterización:", err);
      setError(
        "No se pudieron guardar tus respuestas. Revisa tu conexión e inténtalo de nuevo."
      );
      setGuardando(false);
    }
  }

  return (
    <main className="formulario-page">
      <form className="formulario-card" onSubmit={guardarFormulario}>
        <header className="formulario-header">
          <span className="formulario-etiqueta">
            INCREASE · PERFIL INICIAL
          </span>
          <h1>Conozcámonos mejor</h1>
          <p>
            Cuéntanos un poco sobre ti y tus objetivos. Esta información
            nos ayudará a personalizar tu experiencia en la plataforma.
          </p>
          <div className="formulario-progreso">
            <span />
          </div>
          <small>Formulario inicial · Aproximadamente 5 minutos</small>
        </header>

        <section className="formulario-seccion">
          <h2>01. Información personal</h2>
          <p className="seccion-descripcion">
            Completa tus datos generales.
          </p>

          <div className="formulario-grid">
            <label>
              Número de documento
              <input
                type="text"
                placeholder="Ej. 1002345678"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                required
              />
            </label>

            <label>
              Edad
              <input
                type="number"
                min="1"
                max="120"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                required
              />
            </label>

            <label>
              Género
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="No binario">No binario</option>
                <option value="Otro">Otro</option>
                <option value="Prefiero no responder">
                  Prefiero no responder
                </option>
              </select>
            </label>

            <label>
              Escolaridad
              <select
                value={escolaridad}
                onChange={(e) => setEscolaridad(e.target.value)}
                required
              >
                <option value="">Selecciona tu nivel</option>
                <option value="Primaria">Primaria</option>
                <option value="Bachillerato">Bachillerato</option>
                <option value="Técnico o tecnológico">
                  Técnico o tecnológico
                </option>
                <option value="Universitario">Universitario</option>
                <option value="Posgrado">Posgrado</option>
                <option value="Otro">Otro</option>
              </select>
            </label>

            <label>
              Idioma materno
              <input
                value={idiomaMaterno}
                onChange={(e) => setIdiomaMaterno(e.target.value)}
                placeholder="Ej. Español"
                required
              />
            </label>

            <label>
              Ciudad donde vives
              <input
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Ej. Bogotá"
                required
              />
            </label>

            <label>
              Ocupación actual
              <input
                value={ocupacionActual}
                onChange={(e) => setOcupacionActual(e.target.value)}
                placeholder="Ej. Estudiante, docente..."
                required
              />
            </label>

            <label className="campo-completo">
              Ocupación anterior
              <input
                value={ocupacionAnterior}
                onChange={(e) => setOcupacionAnterior(e.target.value)}
                placeholder="Si no has tenido otra, escribe «Ninguna»"
                required
              />
            </label>
          </div>
        </section>

        <section className="formulario-seccion">
          <h2>02. Percepción cognitiva</h2>
          <p className="seccion-descripcion">
            No hay respuestas correctas o incorrectas. Responde según
            tu experiencia.
          </p>

          <fieldset className="pregunta">
            <legend>
              ¿Has sido diagnosticado por un profesional con alguna
              dificultad relacionada con la atención o la memoria?
            </legend>

            {[
              ["si", "Sí"],
              ["no", "No"],
              ["no-se", "No estoy seguro/a"],
              ["prefiero-no", "Prefiero no responder"],
            ].map(([valor, texto]) => (
              <label className="opcion-radio" key={valor}>
                <input
                  type="radio"
                  name="diagnostico"
                  value={valor}
                  checked={diagnostico === valor}
                  onChange={(e) => setDiagnostico(e.target.value)}
                  required
                />
                {texto}
              </label>
            ))}
          </fieldset>

          <fieldset className="pregunta">
            <legend>
              ¿Con qué frecuencia olvidas lo que ibas a hacer?
            </legend>

            <div className="likert-opciones">
              {escalaLikert.map((opcion, index) => (
                <label className="likert-opcion" key={opcion}>
                  <input
                    type="radio"
                    name="olvidos"
                    value={index + 1}
                    checked={olvidos === String(index + 1)}
                    onChange={(e) => setOlvidos(e.target.value)}
                    required
                  />
                  <span>{index + 1}</span>
                  <small>{opcion}</small>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="pregunta">
            <legend>
              ¿Con qué frecuencia consideras que tienes problemas
              de atención?
            </legend>

            <div className="likert-opciones">
              {escalaLikert.map((opcion, index) => (
                <label className="likert-opcion" key={opcion}>
                  <input
                    type="radio"
                    name="atencion"
                    value={index + 1}
                    checked={atencion === String(index + 1)}
                    onChange={(e) => setAtencion(e.target.value)}
                    required
                  />
                  <span>{index + 1}</span>
                  <small>{opcion}</small>
                </label>
              ))}
            </div>
          </fieldset>

          <p className="formulario-nota">
            Estas preguntas recogen tu percepción personal y no
            constituyen una evaluación ni un diagnóstico clínico.
          </p>
        </section>

        <section className="formulario-seccion">
          <h2>03. Tus objetivos</h2>
          <p className="seccion-descripcion">
            ¿Qué te gustaría conseguir al utilizar Increase? Puedes
            seleccionar varias opciones.
          </p>

          <div className="objetivos-grid">
            {objetivos.map((objetivo) => (
              <label className="objetivo-opcion" key={objetivo}>
                <input
                  type="checkbox"
                  checked={objetivosSeleccionados.includes(objetivo)}
                  onChange={() => alternarObjetivo(objetivo)}
                />
                <span>{objetivo}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="formulario-consentimiento">
          <label>
            <input
              type="checkbox"
              checked={consentimiento}
              onChange={(e) => setConsentimiento(e.target.checked)}
              required
            />
            <span>
              He leído el aviso de privacidad y entiendo para qué se
              utilizará esta información.
            </span>
          </label>
          <small>
            "Aqui va el aviso de politica de datos !!!!OJO!!!!"
          </small>
        </section>

        {error && (
          <div className="formulario-error" role="alert">
            {error}
          </div>
        )}

        <footer className="formulario-footer">
          <span>Revisa tus respuestas antes de continuar.</span>
          <button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar y continuar"}
          </button>
        </footer>
      </form>
    </main>
  );
}

export default FormularioInicial;