import { Outlet } from "react-router-dom";

import './loginLayout.css';

export default function loginLayout() {
    return (
        <div className="login-container">
            <div className="login-child">
                <Outlet />
            </div>
        </div>
    )
}