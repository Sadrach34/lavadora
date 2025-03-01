import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

async function getLavadosServicios() {
    const res = await fetch('http://localhost:3000/api/note/repLavServi');
    const data = await res.json();
    return data;
}

export const RepLavServi = () => {
    const [lavadosServicios, setLavadosServicios] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getLavadosServicios();
            setLavadosServicios(data);
        }
        fetchData();
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Lavados por Servicio', 14, 16);
        autoTable(doc, {
            head: [['Servicio', 'id_lavados']],
            body: lavadosServicios.map(lavadoServicio => [
                lavadoServicio.servicio,
                lavadoServicio.id_lavados
            ]),
            startY: 20,
        });
        doc.save('ReporteLavadosServicios.pdf');
    };

    return (
        <>
            <div className="Archivo">
                <button onClick={generatePDF}>Generar PDF</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Servicio</th>
                            <th>id_lavados</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lavadosServicios.map((lavadoServicio) => (
                            <tr key={lavadoServicio.id_lavados}>
                                <td>{lavadoServicio.servicio}</td>
                                <td>{lavadoServicio.id_lavados}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}