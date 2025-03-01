import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

async function getUsuarios() {
    const res = await fetch('http://localhost:3000/api/note?table=usuarios');
    const data = await res.json();
    return data;
}

export const RepUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    
    useEffect(() => {
        async function fetchData() {
            const data = await getUsuarios();
            setUsuarios(data);
        }
        fetchData();
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Usuarios', 14, 16);
        autoTable(doc, {
            head: [['id_usuario', 'Usuario', 'Cuenta', 'Clave', 'Nivel', 'Idioma', 'status']],
            body: usuarios.map(usuario => [
                usuario.id_usuario,
                usuario.Usuario,
                usuario.Cuenta,
                usuario.Clave,
                usuario.Nivel,
                usuario.Idioma,
                usuario.status
            ]),
            startY: 20,
        });
        doc.save('ReporteUsuarios.pdf');
    };

    return (
        <>
            <div className="Archivo">
                <button onClick={generatePDF}>Generar PDF</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>id_usuario</th>
                            <th>Usuario</th>
                            <th>Cuenta</th>
                            <th>Clave</th>
                            <th>Nivel</th>
                            <th>Idioma</th>
                            <th>status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id_usuario}>
                                <td>{usuario.id_usuario}</td>
                                <td>{usuario.Usuario}</td>
                                <td>{usuario.Cuenta}</td>
                                <td>{usuario.Clave}</td>
                                <td>{usuario.Nivel}</td>
                                <td>{usuario.Idioma}</td>
                                <td>{usuario.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}