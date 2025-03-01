import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

async function getClientes() {
    const res = await fetch('http://localhost:3000/api/note?table=clientes');
    const data = await res.json();
    return data;
}

export const RepClientes = () => {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getClientes();
            setClientes(data);
        }
        fetchData();
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Clientes', 14, 16);
        autoTable(doc, {
            head: [['ID_cliente', 'Cliente', 'tipoCarro', 'Direccion', 'Telefono', 'Activo']],
            body: clientes.map(cliente => [
                cliente.ID_cliente,
                cliente.cliente,
                cliente.tipoCarro,
                cliente.direccion,
                cliente.Telefono,
                cliente.Activo
            ]),
            startY: 20,
        });
        doc.save('ReporteClientes.pdf');
    };

    return (
        <>
            <div className="Archivo">
                <button onClick={generatePDF}>Generar PDF</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID_cliente</th>
                            <th>Cliente</th>
                            <th>tipoCarro</th>
                            <th>Direccion</th>
                            <th>Telefono</th>
                            <th>Activo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.ID_cliente}>
                                <td>{cliente.ID_cliente}</td>
                                <td>{cliente.cliente}</td>
                                <td>{cliente.tipoCarro}</td>
                                <td>{cliente.direccion}</td>
                                <td>{cliente.Telefono}</td>
                                <td>{cliente.Activo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
