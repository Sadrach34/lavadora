import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

export const CambiarContra = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');
    const { data: session } = useSession();
    
        const texts = {
            es: {
                cambiarContra: 'Cambiar Contraseña',
                introduceContraActual: 'Introduce tu contraseña actual:',
                introduceContraNueva: 'Introduce la contraseña nueva:',
                repiteContraNueva: 'Repite la contraseña nueva:',
                cambiar: 'Cambiar',
                contrasNoCoinciden: 'Las contraseñas nuevas no coinciden',
                errorCambiarContra: 'Error al cambiar la contraseña',
                alert: 'Las contraseñas nuevas no coinciden',
            },
            en: {
                cambiarContra: 'Change Password',
                introduceContraActual: 'Enter your current password:',
                introduceContraNueva: 'Enter the new password:',
                repiteContraNueva: 'Repeat the new password:',
                cambiar: 'Change',
                contrasNoCoinciden: 'The new passwords do not match',
                errorCambiarContra: 'Error changing the password',
                alert: 'The new passwords do not match',
            }
        }
    
        const language = session?.user?.Idioma === 2 ? 'en' : 'es';
        const t = texts[language];
    

    const handleChangePassword = async () => {
        if (newPassword !== repeatNewPassword) {
            alert(t.alert);
            return;
        }

        try {
            const response = await fetch('/api/note/upContra', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error(error);
            alert(t.errorCambiarContra);
        }
    };

    return (
        <div className="preferencias">
            <div className="">
                <h1>{t.cambiarContra}</h1>
                <h3>{t.introduceContraActual}</h3>
                <input
                    className="inpIdio"
                    type="password"
                    placeholder="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
            </div>

            <div className="">
                <h3>{t.introduceContraNueva}</h3>
                <input
                    className="inpIdio"
                    type="password"
                    placeholder="Contraseña nueva"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <h3>{t.repiteContraNueva}</h3>
                <input
                    className="inpIdio"
                    type="password"
                    placeholder="Repetir nueva contraseña"
                    value={repeatNewPassword}
                    onChange={(e) => setRepeatNewPassword(e.target.value)}
                />
            </div>

            <div>
                <button className="btnIdio" onClick={handleChangePassword}>{t.cambiar}</button>
            </div>
        </div>
    );
};