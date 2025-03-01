import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

async function getLavados() {
    const res = await fetch('http://localhost:3000/api/note?table=lavados');
    const data = await res.json();
    return data;
}

export const RepLavados = () => {
    const [lavados, setLavados] = useState([]);
    
    useEffect(() => {
        async function fetchData() {
            const data = await getLavados();
            setLavados(data);
        }
        fetchData();
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Lavados', 14, 16);
        autoTable(doc, {
            head: [['ID_lavado', 'ID_cliente', 'ID_servicio', 'ID_usuario', 'fecha', 'Inactivo']],
            body: lavados.map(lavado => [
                lavado.ID_lavado,
                lavado.ID_cliente,
                lavado.ID_servicio,
                lavado.ID_usuario,
                lavado.fecha,
                lavado.Inactivo
            ]),
            startY: 20,
        });
        doc.save('ReporteLavados.pdf');
    };

    return (
        <>
            <div className="Archivo">
                <button onClick={generatePDF}>Generar PDF</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID_lavado</th>
                            <th>ID_cliente</th>
                            <th>ID_servicio</th>
                            <th>ID_usuario</th>
                            <th>fecha</th>
                            <th>Inactivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lavados.map((lavado) => (
                            <tr key={lavado.ID_lavado}>
                                <td>{lavado.ID_lavado}</td>
                                <td>{lavado.ID_cliente}</td>
                                <td>{lavado.ID_servicio}</td>
                                <td>{lavado.ID_usuario}</td>
                                <td>{lavado.fecha}</td>
                                <td>{lavado.Inactivo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}