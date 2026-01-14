
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("index.tsx: Iniciando montagem do React...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("index.tsx: Elemento 'root' não encontrado no index.html!");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("index.tsx: Renderização inicial disparada.");
} catch (err) {
  console.error("index.tsx: Falha fatal na renderização do React:", err);
}
