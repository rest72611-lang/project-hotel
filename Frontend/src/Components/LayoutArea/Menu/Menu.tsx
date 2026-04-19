import { NavLink, useNavigate } from "react-router-dom";
import "./Menu.css";
import { authService } from "../../../Services/AuthService";

function Menu() {

    const navigate = useNavigate();
    const isLoggedIn = authService.isLoggedIn();
    const isAdmin = authService.isAdmin();

    function logout(): void {
        authService.logout();
        navigate("/login");
        window.location.reload();
    }

    return (
        <div className="Menu">
            <NavLink to="/home">Home</NavLink>

            {!isLoggedIn && <NavLink to="/register">Register</NavLink>}
            {!isLoggedIn && <NavLink to="/login">Login</NavLink>}

            {isLoggedIn && <NavLink to="/vacations">Vacations</NavLink>}
            {isLoggedIn && <NavLink to="/recommendation">AI Recommendation</NavLink>}
            {isLoggedIn && <NavLink to="/mcp">MCP</NavLink>}

            {isLoggedIn && isAdmin && <NavLink to="/admin/add-vacation">Add Vacation</NavLink>}
            {isLoggedIn && isAdmin && <NavLink to="/admin/vacations-report">Vacations Report</NavLink>}

            {isLoggedIn && <button onClick={logout}>Logout</button>}
        </div>
    );
}

export default Menu;
