import { useState } from "react";
import api from "../api/api";

export default function CrearAmante() {
  const [nombre, setNombre] = useState("");

  const enviar = async () => {
    await api.post("/amantes", {
      nombre,
      edad: 25,
      intereses: ["cine"]
    });

    alert("Amante creado");
  };

  return (
    <div>
      <h2>Crear Amante</h2>

      <input
        placeholder="Nombre"
        onChange={(e) => setNombre(e.target.value)}
      />

      <button onClick={enviar}>Crear</button>
    </div>
  );
}