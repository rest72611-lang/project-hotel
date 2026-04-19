
import { authService } from "../../../Services/AuthService";
import "./Header.css";

function Header() {

    const user = authService.getUser();

    return (
        <div className="Header">
            <h1>Vacation System</h1>

            <div>
                {user ? (
                    <span>
                        Hello {user.firstName} ({user.role})
                    </span>
                ) : (
                    <span>Hello Guest</span>
                )}
            </div>
        </div>
    );
}

export default Header;
