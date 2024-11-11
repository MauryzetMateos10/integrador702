import React, { useEffect, useState } from 'react';
import '../App.css';
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(LinearScale, CategoryScale, BarElement, ArcElement, Tooltip, Legend);

const ListaDocentes = () => {
    const [docentes, setDocentes] = useState([]);

    useEffect(() => {
        const fetchDocentes = async () => {
            try {
                const response = await fetch('http://localhost/apiprueba/api.php');
                const data = await response.json();
                setDocentes(data);
            } catch (error) {
                console.error('Error fetching docentes:', error);
            }
        };

        // Llama a la función una vez cuando el componente se monta
        fetchDocentes();

        // Crea un intervalo que llama a la función cada 2 segundos
        const interval = setInterval(fetchDocentes, 2000);

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(interval);
    }, []);

    // Preparar datos para la gráfica de barras de claves issemyn
    const barChartData = {
        labels: docentes.map(docente => docente.nombre), // Los nombres de los docentes como etiquetas en el eje X
        datasets: [
            {
                label: 'Clave ISSEMYN de Docentes',
                data: docentes.map(docente => docente.issemyn), // Los valores de la clave ISSEMYN de cada docente
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Color de fondo de las barras
                borderColor: 'rgba(54, 162, 235, 1)', // Color de los bordes de las barras
                borderWidth: 1, // Ancho del borde de las barras
            },
        ],
    };

    // Opciones para la gráfica de barras
    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // Preparar datos para la gráfica de pastel (distribución de issemyn)
    const pieChartData = {
        labels: docentes.map(docente => docente.nombre), // Nombres de los docentes
        datasets: [
            {
                label: 'Distribución de Claves ISSEMYN',
                data: docentes.map(docente => docente.issemyn), // Datos de las claves issemyn
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)', // Color para cada sección del gráfico de pastel
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)', // Color de los bordes
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1, // Ancho del borde
            },
        ],
    };

    // Opciones para la gráfica de pastel
    const pieChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
    };

    return (
        <div>
            <h1 className="App App-link">DOCENTES INGENIERÍA INFORMÁTICA TESSFP</h1>
            <div className="card-container">
                {docentes.map((docente) => (
                    <div key={docente.issemyn} className="card">
                        <div className="card-content">
                            <p>Clave ISSEMYN: <strong>{docente.issemyn}</strong></p>
                            <p>Nombre: <strong>{docente.nombre}</strong></p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráfico de Barras */}
            <div className="global-chart-container" style={{ maxWidth: '600px', height: '300px', margin: '20px auto' }}>
                <h2>Gráfica de Clave ISSEMYN de Docentes (Barras)</h2>
                <Bar data={barChartData} options={chartOptions} />
            </div>

            {/* Gráfico de Pastel */}
            <div className="global-chart-container" style={{ maxWidth: '600px', height: '300px', margin: '20px auto' }}>
                <h2>Distribución de Claves ISSEMYN (Pastel)</h2>
                <Pie data={pieChartData} options={pieChartOptions} />
            </div>
        </div>
    );
};

export default ListaDocentes;
