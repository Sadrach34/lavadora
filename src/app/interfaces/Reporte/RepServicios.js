import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

async function getServicios() {
    const res = await fetch('http://localhost:3000/api/note?table=servicios');
    const data = await res.json();
    return data;
}

export const RepServicios = () => {
    const [servicios, setServicios] = useState([]);
    
    useEffect(() => {
        async function fetchData() {
            const data = await getServicios();
            setServicios(data);
        }
        fetchData();
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Servicios', 14, 16);
        autoTable(doc, {
            head: [['id_servicio', 'Servicio', 'Precio', 'Disponible']],
            body: servicios.map(servicio => [
                servicio.id_servicio,
                servicio.servicio,
                servicio.Precio,
                servicio.Disponible
            ]),
            startY: 20,
        });
        doc.save('ReporteServicios.pdf');
    };

    return (
        <>
            <div className="Archivo">
                <button onClick={generatePDF}>Generar PDF</button>
                <div className="busqueda">
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>id_servicio</th>
                            <th>Servicio</th>
                            <th>Precio</th>
                            <th>Disponible</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicios.map((servicio) => (
                            <tr key={servicio.id_servicio}>
                                <td>{servicio.id_servicio}</td>
                                <td>{servicio.servicio}</td>
                                <td>{servicio.Precio}</td>
                                <td>{servicio.Disponible}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}