"use client";
import { useForm } from 'react-hook-form';
import CryptoJS from 'crypto-js';

export function FormUsuario() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = handleSubmit(async (data) => {
        try {
            data.Idioma = parseInt(data.Idioma, 10);
            data.Nivel = parseInt(data.Nivel, 10);
            data.status = parseInt(data.status, 10);

            if (isNaN(data.Idioma)) {
                throw new Error('El campo Idioma debe ser un número válido');
            }

            if (isNaN(data.Nivel)) {
                throw new Error('El campo Nivel debe ser un número válido');
            }

            if (isNaN(data.status) || (data.status !== 0 && data.status !== 1)) {
                throw new Error('El campo status debe ser un número válido (0 o 1)');
            }

            // Cifrar la clave en SHA-256 usando crypto-js
            data.Clave = CryptoJS.SHA256(data.Clave).toString(CryptoJS.enc.Hex);

            console.log('Enviando datos:', data);
            const res = await fetch('/api/note?table=usuarios', { // Aquí se agrega el parámetro table
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Error en la respuesta del servidor: ${res.status} ${res.statusText} - ${errorText}`);
            }

            const resJson = await res.json();
            console.log('Respuesta del servidor:', resJson);
            reset(); // Reset form fields
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert(`Error al enviar el formulario: ${error.message}`);
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <div className="FormUsuarios">
                <div>
                    <input
                        className="w-full"
                        type="text"
                        placeholder="Usuario"
                        {...register("Usuario", {
                            required: {
                                value: true,
                                message: "El campo es requerido"
                            },
                        })}
                    />
                    <br/>
                    {errors.Usuario && (
                        <span className="text-red-500 m-5">
                            {errors.Usuario.message as string}
                        </span>
                    )}
                </div>
                <div>
                    <input
                        className="w-full"
                        type="text"
                        placeholder="Cuenta"
                        {...register("Cuenta", {
                            required: {
                                value: true,
                                message: "El campo es requerido"
                            },
                        })}
                    />
                    <br/>
                    {errors.Cuenta && (
                        <span className="text-red-500 m-5">{errors.Cuenta.message as string}</span>
                    )}
                </div>
                <div>
                    <input
                        className="w-full"
                        type="password"
                        placeholder="Clave"
                        {...register("Clave", {
                            required: {
                                value: true,
                                message: "El campo es requerido"
                            },
                        })}
                    />
                    <br/>
                    {errors.Clave && (
                        <span className="text-red-500 m-5">{errors.Clave.message as string}</span>
                    )}
                </div>
                <div>
                    <input
                        className="w-full"
                        type="text"
                        placeholder="Nivel"
                        {...register("Nivel", {
                            required: {
                                value: true,
                                message: "El campo es requerido"
                            },
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "El Nivel debe ser un número"
                            }
                        })}
                    />
                    <br/>
                    {errors.Nivel && (
                        <span className="text-red-500 m-5">{errors.Nivel.message as string}</span>
                    )}
                </div>
                <div>
                    <input
                        className="w-full"
                        type="text"
                        placeholder="Idioma"
                        {...register("Idioma", {
                            required: {
                                value: true,
                                message: "El campo es requerido"
                            },
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "El Idioma debe ser un número"
                            }
                        })}
                    />
                    <br/>
                    {errors.Idioma && (
                        <span className="text-red-500 m-5">{errors.Idioma.message as string}</span>
                    )}
                </div>
                <div>
                    <input
                        className="w-full"
                        type="text"
                        placeholder="Status"
                        {...register("status", {
                            required: {
                                value: true,
                                message: "El campo es requerido"
                            },
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "El status debe ser un número"
                            },
                            validate: value => value === '0' || value === '1' || "El status debe ser 0 o 1"
                        })}
                    />
                    <br/>
                    {errors.status && (
                        <span className="text-red-500 m-5">{errors.status.message as string}</span>
                    )}
                </div>
                <div>
                    <button className='w-full'>Agregar</button>
                </div>
            </div>
        </form>
    );
}