import React, { useEffect, useState } from 'react';
import '../App.css';
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
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    const lineChartData = {
        labels: clientes.map(cliente => cliente.nombre),
        datasets: [
            {
                label: 'ID de Clientes',
                data: clientes.map(cliente => cliente.id),
                borderColor: 'rgba(226, 125, 36, 1)',
                backgroundColor: 'rgba(226, 125, 36, 0.4)',
                borderWidth: 1,
                fill: true,
                tension: 0.2,
            },
        ],
    };

    const sexoCount = clientes.reduce((acc, cliente) => {
        acc[cliente.sexo] = (acc[cliente.sexo] || 0) + 1;
        return acc;
    }, {});

    const totalClientes = clientes.length;
    const sexoPorcentaje = Object.keys(sexoCount).map(sexo => 
        ((sexoCount[sexo] / totalClientes) * 100).toFixed(2)
    );

    const pieChartData = {
        labels: Object.keys(sexoCount),
        datasets: [
            {
                label: 'Porcentaje por Sexo',
                data: sexoPorcentaje,
                backgroundColor: [
                    'rgba(255, 51, 249 , 0.6)',
                    'rgba(255, 227, 48 , 0.6)',
                    'rgba(85, 203, 227, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 51, 249 , 1)',
                    'rgba(255, 227, 48 , 1)',
                    'rgba(85, 203, 227, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const barChartData = {
        labels: Object.keys(sexoCount),
        datasets: [
            {
                label: 'Conteo por Sexo',
                data: Object.values(sexoCount),
                backgroundColor: [
                    'rgba(255, 51, 249 , 0.6)',
                    'rgba(255, 227, 48 , 0.6)',
                    'rgba(85, 203, 227, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 51, 249 , 1)',
                    'rgba(255, 227, 48 , 1)',
                    'rgba(85, 203, 227, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

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
                }
            },
            x: {
                ticks: {
                    padding: 10,
                }
            }
        },
    };

    return (
        <div className="container">
            <h1 className="App App-link">Lista de Clientes</h1>
            
            <div className="card-container">
                {error ? (
                    <div className="error">Error: {error.message}</div>
                ) : (
                    clientes.map(cliente => (
                        <div key={cliente.id} className="card">
                            <div className="card-content">
                                <h2>ID: {cliente.id}</h2>
                                <p><strong>Nombre:</strong> {cliente.nombre}</p>
                                <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                                <p><strong>Sexo:</strong> {cliente.sexo}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
    
            <div className="charts-container">
                <div className="line-chart-container" style={{ maxWidth: '500px', height: '300px', margin: '20px' }}>
                    <h2>Gráfica de IDs de Todos los Clientes</h2>
                    <Line data={lineChartData} options={chartOptions} />
                </div>
    
                <div className="bar-chart-container" style={{ maxWidth: '500px', height: '300px', margin: '20px' }}>
                    <h2>Gráfica de Sexo de los Clientes</h2>
                    <Bar data={barChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
                </div>

                <div className="pie-chart-container" style={{ maxWidth: '500px', height: '300px', margin: '20px' }}>
                    <h2>Porcentaje de Clientes por Sexo</h2>
                    <Pie data={pieChartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Cliente;
