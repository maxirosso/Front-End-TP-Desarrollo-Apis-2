import { useRouteError } from "react-router-dom";

export default function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h1>¡Ups! Algo salió mal 😢</h1>
      <p>Ocurrió un error inesperado en la aplicación.</p>
      {error && <pre style={{ color: "#c00", marginTop: 16 }}>{error.statusText || error.message}</pre>}
      <a href="/" style={{ color: '#007bff', textDecoration: 'underline' }}>Volver al inicio</a>
    </div>
  );
}
