import { useState, useEffect } from "react";
import supabase from "./supabase"; // 👈 asegúrate que en supabase.js uses `export default`
import PerfilUsuario from "./components/PerfilUsuario";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados de login/registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [modoRegistro, setModoRegistro] = useState(false);

  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");

  // 👇 nuevo estado para alternar entre lista y perfil
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Registro
  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          fecha_Nacimiento,
          telefono,
        },
      },
    });
    if (error) alert(error.message);
    else alert("✅ Usuario registrado. Verifica tu correo.");
  };

  // Login
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Tareas
  const agregarTarea = () => {
    if (nuevaTarea.trim() === "") return;
    setTareas([...tareas, { texto: nuevaTarea, completada: false }]);
    setNuevaTarea("");
  };

  const toggleTarea = (index) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index].completada = !nuevasTareas[index].completada;
    setTareas(nuevasTareas);
  };

  const eliminarTarea = (index) => {
    setTareas(tareas.filter((_, i) => i !== index));
  };

  const completadas = tareas.filter((t) => t.completada).length;

  if (loading) return <p>Cargando...</p>;

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>{modoRegistro ? "📝 Registro" : "🔑 Login"}</h2>

          <input type="email" placeholder="Correo"
            value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
          <input type="password" placeholder="Contraseña"
            value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />

          {modoRegistro && (
            <>
              <input type="text" placeholder="Nombre"
                value={nombre} onChange={(e) => setNombre(e.target.value)} style={styles.input} />
              <input type="date" placeholder="Fecha de nacimiento"
                value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} style={styles.input} />
              <input type="tel" placeholder="Teléfono"
                value={telefono} onChange={(e) => setTelefono(e.target.value)} style={styles.input} />
            </>
          )}

          {modoRegistro ? (
            <button onClick={handleRegister} style={styles.addButton}>Registrarse</button>
          ) : (
            <button onClick={handleLogin} style={styles.addButton}>Iniciar sesión</button>
          )}

          <p onClick={() => setModoRegistro(!modoRegistro)}
             style={{ marginTop: "10px", cursor: "pointer", color: "#4f46e5" }}>
            {modoRegistro ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
          </p>
        </div>
      </div>
    );
  }

  // 👇 cuando el usuario quiera ver su perfil
  if (mostrarPerfil) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <PerfilUsuario user={user} />
        </div>

        <button
          style={styles.bottomButton}
          onClick={() => setMostrarPerfil(false)}
        >
          Volver a mis tareas
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✅ Lista de Tareas</h1>
        <p>Hola {user.user_metadata?.nombre || "Usuario"} 👋</p>
        <button onClick={handleLogout} style={styles.deleteButton}>Cerrar sesión</button>

        <div style={styles.inputGroup}>
          <input type="text" value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)} placeholder="Escribe una tarea..." style={styles.input} />
          <button onClick={agregarTarea} style={styles.addButton}>➕</button>
        </div>

        <ul style={styles.list}>
          {tareas.map((t, i) => (
            <li key={i}
                style={{
                  ...styles.listItem,
                  backgroundColor: t.completada ? "#d1fae5" : "#f9fafb",
                  textDecoration: t.completada ? "line-through" : "none",
                }}>
              <span onClick={() => toggleTarea(i)} style={styles.taskText}>
                {t.texto}
              </span>
              <button onClick={() => eliminarTarea(i)} style={styles.deleteButton}>❌</button>
            </li>
          ))}
        </ul>

        {tareas.length > 0 && (
          <p style={styles.footer}>
            Completadas: {completadas} / {tareas.length}
          </p>
        )}
      </div>

      {/* 👇 botón fijo para ir al perfil */}
      <button
        style={styles.bottomButton}
        onClick={() => setMostrarPerfil(true)}
      >
        Ver mis datos
      </button>
    </div>
  );
}

// 🎨 Estilos CSS en JS
const styles = {
  container: {
    minHeight: "100vh",
    minWidth: "100vw", // 🔥 asegura que también ocupe todo el ancho
    background: "linear-gradient(to bottom right, #6366f1, #9333ea)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // centra verticalmente
    alignItems: "center", // centra horizontalmente
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
    color: "#1f2937",
  },
  inputGroup: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "10px",
  },
  addButton: {
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
  },
  taskText: {
    flex: 1,
    marginRight: "10px",
    cursor: "pointer",
  },
  deleteButton: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: "16px",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
  },
  bottomButton: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 20px",
    borderRadius: "8px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
};
