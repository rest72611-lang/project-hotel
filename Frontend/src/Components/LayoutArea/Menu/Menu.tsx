import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Menu.css";
import { authService } from "../../../Services/AuthService";
import { UserModel } from "../../../Models/UserModel";

function Menu() {

    const navigate = useNavigate();
    const [user, setUser] = useState<UserModel | null>(() => authService.getUser());
    const isLoggedIn = !!user;
    const isAdmin = user?.role?.toLowerCase() === "admin";

    useEffect(() => {
        // Subscribe once so navigation updates immediately after login/logout in other screens.
        return authService.subscribe(() => {
            setUser(authService.getUser());
        });
    }, []);

    function logout(): void {
        authService.logout();
        navigate("/login");
    }

    return (
        <div className="Menu">
            <NavLink to="/home">Home</NavLink>

            {!isLoggedIn && <NavLink to="/register">Register</NavLink>}
            {!isLoggedIn && <NavLink to="/login">Login</NavLink>}

            {isLoggedIn && <NavLink to="/vacations">Vacations</NavLink>}
            {isLoggedIn && !isAdmin && <NavLink to="/recommendation">AI Recommendation</NavLink>}
            {isLoggedIn && !isAdmin && <NavLink to="/mcp">MCP</NavLink>}

            {isLoggedIn && isAdmin && <NavLink to="/admin/add-vacation">Add Vacation</NavLink>}
            {isLoggedIn && isAdmin && <NavLink to="/admin/vacations-report">Vacations Report</NavLink>}

            {isLoggedIn && <button className="MenuLogout" onClick={logout}>Logout</button>}
        </div>
    );
}

export default Menu;
