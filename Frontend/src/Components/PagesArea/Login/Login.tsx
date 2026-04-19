import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { authService } from "../../../Services/AuthService";
import { notify } from "../../../Utils/Notify";

function Login() {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState<CredentialsModel>({
        email: "",
        password: ""
    });

    async function submit(): Promise<void> {
        try {
            await authService.login(credentials);
            notify.success("Login successful");
            navigate("/vacations");
            window.location.reload();
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div>
            <h2>Login</h2>

            <input
                type="email"
                placeholder="Email"
                value={credentials.email}
                onChange={e => setCredentials({ ...credentials, email: e.target.value })}
            />
            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
            />
            <br /><br />

            <button onClick={submit}>Login</button>
        </div>
    );
}

export default Login;