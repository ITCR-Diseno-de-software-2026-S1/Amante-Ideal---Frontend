import { useState } from "react";
import api from "../api/api";

export default function BuscarAmantes() {
  const [resultado, setResultado] = useState([]);

  const buscar = async () => {
    const res = await api.get("/amantes?interes=cine");
    setResultado(res.data);
  };

  return (
    <div>
      <h2>Buscar por interés</h2>

      <button onClick={buscar}>Buscar</button>

      <ul>
        {resultado.map((a) => (
          <li key={a._id}>{a.nombre}</li>
        ))}
      </ul>
    </div>
  );
}