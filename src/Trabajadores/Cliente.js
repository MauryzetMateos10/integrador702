import React, { useEffect, useState } from 'react';
import '../App.css';  // Asegúrate de que el archivo CSS esté correctamente importado
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);

const Cliente = () => {
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState(null);

    // Función para generar colores aleatorios
    const generateRandomColor = () => {
        const randomColor = () => Math.floor(Math.random() * 256);
        return `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.6)`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://alex.starcode.com.mx/apiAlumnos.php');
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                setClientes(data);
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000); // Actualizar cada 2 segundos
        return () => clearInterval(interval); // Limpiar intervalo al desmontar el componente
    }, []);

    // Datos para las gráficas
    const nombresPracticas = Object.keys(clientes[0]?.practicas || {});

    // Gráfico de barras con calificación promedio por estudiante
    const barChartData = {
        labels: clientes.map(cliente => cliente.nombre),
        datasets: [
            {
                label: 'Calificación Promedio',
                data: clientes.map(cliente => {
                    const calificaciones = Object.values(cliente.practicas).map(Number);
                    return calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length;
                }),
                backgroundColor: clientes.map(() => generateRandomColor()), // Colores aleatorios para cada barra
                borderColor: clientes.map(() => generateRandomColor()), // Colores aleatorios para cada barra
                borderWidth: 2,
                barThickness: 40, // Grosor de las barras
                hoverBackgroundColor: clientes.map(() => generateRandomColor()), // Color de hover
                hoverBorderColor: clientes.map(() => generateRandomColor()),
                hoverBorderWidth: 2,
            },
        ],
    };

    // Gráfico de pastel para cada estudiante
    const pieChartsData = clientes.map((cliente, index) => {
        return {
            labels: nombresPracticas,
            datasets: [{
                label: `${cliente.nombre} - Distribución por práctica`,
                data: nombresPracticas.map(practica => Number(cliente.practicas[practica])),
                backgroundColor: nombresPracticas.map(() => generateRandomColor()),
                borderColor: nombresPracticas.map(() => generateRandomColor()),
                borderWidth: 1,
            }],
        };
    });

    // Gráfico de líneas para cada estudiante
    const lineChartsData = clientes.map((cliente, index) => {
        return {
            labels: nombresPracticas,
            datasets: [{
                label: cliente.nombre,
                data: nombresPracticas.map(practica => Number(cliente.practicas[practica])),
                borderColor: generateRandomColor(),
                backgroundColor: generateRandomColor(),
                borderWidth: 1,
                tension: 0.3,
                fill: true,
            }],
        };
    });

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    boxWidth: 0,
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                    padding: 10,
                    font: {
                        size: 14,
                    },
                },
                grid: {
                    drawBorder: false,
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                ticks: {
                    padding: 10,
                    font: {
                        size: 14,
                    },
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            }
        },
    };

    // Función para asignar color a las celdas de la tabla basado en la calificación
    const getCellColor = (calificacion) => {
        const value = Number(calificacion);
        if (value >= 9) return generateRandomColor();  // Colores aleatorios para calificaciones altas
        if (value >= 7) return generateRandomColor();  // Colores aleatorios para calificaciones medias
        return generateRandomColor();  // Colores aleatorios para calificaciones bajas
    };

    return (
        <div className="container">
            <h1 className="App App-link">Prácticas de Clientes</h1>
            {error ? (
                <div className="error">Error: {error.message}</div>
            ) : (
                <>
                    <div className="clientes-grid">
                        {clientes.map(cliente => (
                            <div className="cliente-card" key={cliente.id}>
                                <p><strong>ID:</strong> {cliente.id}</p>
                                <p><strong>Nombre:</strong> {cliente.nombre}</p>
                                <p><strong>Teléfono:</strong> {cliente.telefono || 'N/A'}</p>
                                <p><strong>Sexo:</strong> {cliente.sexo || 'N/A'}</p>
                            </div>
                        ))}
                    </div>

                    <div className="charts-container">
                        <div className="bar-chart-container" style={{ maxWidth: '500px', height: '300px', margin: '20px' }}>
                            <h2>Promedio de Calificaciones por Estudiante</h2>
                            <Bar data={barChartData} options={chartOptions} />
                        </div>

                        {pieChartsData.map((data, index) => (
                            <div key={index} className="pie-chart-container" style={{ maxWidth: '500px', height: '300px', margin: '20px' }}>
                                <h2>{clientes[index].nombre} - Distribución por Práctica</h2>
                                <Pie data={data} options={chartOptions} />
                            </div>
                        ))}

                        {lineChartsData.map((data, index) => (
                            <div key={index} className="line-chart-container" style={{ maxWidth: '500px', height: '300px', margin: '20px' }}>
                                <h2>{clientes[index].nombre} - Calificaciones por Práctica</h2>
                                <Line data={data} options={chartOptions} />
                            </div>
                        ))}
                    </div>

                    {/* Tabla de calificaciones de las prácticas por estudiante */}
                    <div className="tabla-container" style={{ marginTop: '40px' }}>
                        <h2>Calificaciones de las Prácticas por Estudiante</h2>
                        <table className="calificaciones-table">
                            <thead>
                                <tr>
                                    <th>Estudiante</th>
                                    {nombresPracticas.map((practica, index) => (
                                        <th key={index}>{practica}</th>
                                    ))}
                                    <th>Promedio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map(cliente => {
                                    const calificaciones = Object.values(cliente.practicas).map(Number);
                                    const promedio = calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length;
                                    return (
                                        <tr key={cliente.id}>
                                            <td>{cliente.nombre}</td>
                                            {nombresPracticas.map((practica, index) => (
                                                <td key={index} style={{ backgroundColor: getCellColor(cliente.practicas[practica]), border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                                    {cliente.practicas[practica]}
                                                </td>
                                            ))}
                                            <td style={{ border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                                {promedio.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cliente;
