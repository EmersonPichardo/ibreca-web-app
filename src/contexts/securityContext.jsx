import { createContext, useState } from 'react';

export const SecurityContext = createContext();

export default function SecurityContextProvider(props) {
    const [sesion, _setSesion] = useState();
    const [callbackRoute, setCallbackRoute] = useState('/');

    const setSesion = (sesion) => {
        if (!sesion) return false;

        localStorage.setItem('sesion', JSON.stringify(sesion));
        _setSesion(sesion);

        return true;
    }

    const getSesion = () => {
        const localStorageSesion = localStorage.getItem('sesion');
        if (localStorageSesion) return JSON.parse(localStorageSesion);

        if (sesion) {
            localStorage.setItem('sesion', JSON.stringify(sesion));
            return sesion;
        }

        return null;
    }

    const logout = () => {
        localStorage.removeItem('sesion');
        _setSesion(null);
    }

    return (
        <SecurityContext.Provider value={{ getSesion, setSesion, logout, callbackRoute, setCallbackRoute }}>
            {props.element}
        </SecurityContext.Provider>
    )
}