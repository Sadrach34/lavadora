import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

async function getLavadosClientes() {
    const res = await fetch('http://localhost:3000/api/note/repLavCli');
    const data = await res.json();
    return data;
}

export const RepLavCli = () => {
    const [lavadosClientes, setLavadosClientes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getLavadosClientes();
            setLavadosClientes(data);
        }
        fetchData();
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Lavados por Cliente', 14, 16);
        autoTable(doc, {
            head: [['Cliente', 'id_lavados']],
            body: lavadosClientes.map(lavadoCliente => [
                lavadoCliente.cliente,
                lavadoCliente.id_lavados
            ]),
            startY: 20,
        });
        doc.save('ReporteLavadosClientes.pdf');
    };

    return (
        <>
            <div className="Archivo">
                <button onClick={generatePDF}>Generar PDF</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>id_lavados</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lavadosClientes.map((lavadoCliente) => (
                            <tr key={lavadoCliente.id_lavados}>
                                <td>{lavadoCliente.cliente}</td>
                                <td>{lavadoCliente.id_lavados}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}