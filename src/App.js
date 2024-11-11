import React from 'react';
import './App.css';
import Cliente from './Trabajadores/Cliente'; // Importa Cliente

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Clientes Api´s</h1>
            </header>
            <main>
                <Cliente /> {/* Renderiza Cliente */}
            </main>
        </div>
    );
}

export default App;
