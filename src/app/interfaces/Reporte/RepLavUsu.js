import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

async function getLavadosUsuarios() {
    const res = await fetch('http://localhost:3000/api/note/repLavUsu');
    const data = await res.json();
    return data;
}

export const RepLavUsu = () => {
    const [lavadosUsuario, setLavadosUsuarios] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getLavadosUsuarios();
            setLavadosUsuarios(data);
        }
        fetchData();
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Lavados por Usuario', 14, 16);
        autoTable(doc, {
            head: [['Usuario', 'ID_lavado']],
            body: lavadosUsuario.map(lavadoUsuario => [
                lavadoUsuario.usuario,
                lavadoUsuario.ID_lavado
            ]),
            startY: 20,
        });
        doc.save('ReporteLavadosUsuarios.pdf');
    };

    return (
        <>
            <div className="Archivo">
                <button onClick={generatePDF}>Generar PDF</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>ID_lavado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lavadosUsuario.map((lavadoUsuario) => (
                            <tr key={lavadoUsuario.ID_lavado}>
                                <td>{lavadoUsuario.usuario}</td>
                                <td>{lavadoUsuario.id_Lavado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}