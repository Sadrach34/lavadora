import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

export const CambiarIdio = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newLanguage, setNewLanguage] = useState(1);
    const { data: session } = useSession();
        
    const texts = {
        es: {
            alert: 'Error al cambiar el idioma',
            title: 'Cambiar Idioma',
            currentPassword: 'Introduce tu contraseña actual:',
            newLanguage: 'Selecciona tu nuevo idioma:',
            spanish: 'Español',
            english: 'Ingles',
            change: 'Cambiar'
        },
        en: {
            alert: 'Error changing language',
            title: 'Change Language',
            currentPassword: 'Enter your current password:',
            newLanguage: 'Select your new language:',
            spanish: 'Spanish',
            english: 'English',
            change: 'Change'
        }
    }

    const language = session?.user?.Idioma === 2 ? 'en' : 'es';
    const t = texts[language];

    const handleChangeLanguage = async () => {
        try {
            const response = await fetch('/api/note/upIdioma', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newLanguage }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error(error);
            alert(t.alert);
        }
    };

    return (
        <div className="preferencias">
            <div>
                <h1>{t.title}</h1>
                <h3>{t.currentPassword}</h3>
                <input
                    className="inpIdio"
                    type="password"
                    placeholder="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <h3>{t.newLanguage}</h3>
                <select
                    className="inpIdio"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(parseInt(e.target.value))}
                >
                    <option value={1}>{t.spanish}</option>
                    <option value={2}>{t.english}</option>
                </select>
            </div>
            <div>
                <button className="btnIdio" onClick={handleChangeLanguage}>{t.change}</button>
            </div>
        </div>
    );
};