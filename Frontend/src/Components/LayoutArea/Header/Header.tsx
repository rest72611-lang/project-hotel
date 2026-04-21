import { useEffect, useState } from "react";
import { authService } from "../../../Services/AuthService";
import { UserModel } from "../../../Models/UserModel";
import "./Header.css";

function Header() {
    const [user, setUser] = useState<UserModel | null>(() => authService.getUser());

    useEffect(() => {
        // Subscribe once so the greeting updates immediately after auth changes elsewhere in the app.
        return authService.subscribe(() => {
            setUser(authService.getUser());
        });
    }, []);

    return (
        <div className="Header">
            <div className="HeaderBrand">
                <span className="HeaderEyebrow">Travel Dashboard</span>
                <h1>Vacation System</h1>
            </div>

            <div className="HeaderUser">
                {user ? (
                    <span className="HeaderUserBadge">
                        Hello {user.firstName} {user.lastName} ({user.role})
                    </span>
                ) : (
                    <span className="HeaderUserBadge">Hello Guest</span>
                )}
            </div>
        </div>
    );
}

export default Header;
