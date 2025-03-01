"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

function LoginPage() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const router = useRouter();
    const [error, setError] = useState(null);
    const { data: session } = useSession();
    
        const texts = {
            es: {
                User: 'Usuario',
                Password: 'Contraseña',
                Login: 'Ingresar',
                Required: 'El campo es requerido',
                Error: 'Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo.'
            },
            en: {
                User: 'User',
                Password: 'Password',
                Login: 'Login',
                Required: 'The field is required',
                Error: 'An error occurred during login. Please try again.'
            }
        }

    const language = session?.user?.Idioma === 2 ? 'en' : 'es';
    const t = texts[language];

    const onSubmit = handleSubmit(async (data) => {
        try {
            const res = await signIn('credentials', {
                username: data.Usuario,
                password: data.Clave,
                redirect: false
            });

            if (res?.error) {
                setError(res.error);
            } else {
                router.push('/');
            }
        } catch (err) {
            console.error('Error during sign-in:', err);
            setError(t.Error);
        }
    });

    return (
        <form onSubmit={onSubmit}>
            {error && (
                <p className="bg-red-500 p-3 rounded text-center max-w-max">{error}</p>
            )}
            <div className="loginContainer">
                <Image src="/logo.png" alt="logo" width={170} height={170} />
                <div className="loginForm">
                    <label>{t.User}</label>
                    <input
                        type="text"
                        placeholder="Nombre de usuario..."
                        {...register("Usuario", {
                            required: {
                                value: true,
                                message: t.Required
                            },
                        })}
                    />
                    {errors.Usuario && (
                        <span className="text-black p-2">{errors.Usuario.message as string}</span>
                    )}

                    <label>{t.Password}</label>
                    <input
                        type="password"
                        placeholder="Contraseña..."
                        {...register("Clave", {
                            required: {
                                value: true,
                                message: t.Required
                            },
                        })}
                    />
                    {errors.Clave && (
                        <span className="text-black p-5">{errors.Clave.message as string}</span>
                    )}
                    <button>{t.Login}</button>
                </div>
            </div>
        </form>
    );
}

export default LoginPage;