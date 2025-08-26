import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function PerfilUsuario() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulación: obtener usuario de Supabase
  useEffect(() => {
    const fetchPerfil = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error al obtener usuario:", error);
      } else {
        setPerfil(user);
      }
      setLoading(false);
    };

    fetchPerfil();
  }, []);

  if (loading) return <p>Cargando perfil...</p>;

  if (!perfil) return <p>No hay usuario autenticado</p>;

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Perfil de Usuario</h2>

      <div className="flex flex-col items-center">
        <p className="text-lg font-semibold">
          {perfil.user_metadata?.nombre || "Sin nombre"}
        </p>
        <p className="text-gray-600">{perfil.email}</p>
        <p className="text-gray-600">
          📞 {perfil.user_metadata?.telefono || "No registrado"}
        </p>

      </div>
    </div>
  );
}
