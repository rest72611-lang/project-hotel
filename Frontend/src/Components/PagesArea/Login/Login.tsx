import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { authService } from "../../../Services/AuthService";
import { notify } from "../../../Utils/Notify";
import "../AuthForm.css";

function Login() {
    if (authService.isLoggedIn()) {
        return <Navigate to="/vacations" />;
    }

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CredentialsModel>();

    async function submit(credentials: CredentialsModel): Promise<void> {
        try {
            await authService.login(credentials);
            notify.success("Login successful");
            // Successful login lands on the vacations list, which is the main authenticated entry point.
            navigate("/vacations");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="AuthPage">
            <div className="AuthCard">
                <div className="AuthIntro">
                    <span className="AuthEyebrow">Welcome Back</span>
                    <h2>Sign in to continue your vacation journey.</h2>
                    <p>
                        Access your saved likes, browse available trips, and use the
                        traveler tools designed for this platform.
                    </p>
                </div>

                <div className="AuthFormPanel">
                    <div className="AuthPanelHeader">
                        <h3>Login</h3>
                        <p>Use your account details to enter the system.</p>
                    </div>

                    <form onSubmit={handleSubmit(submit)}>
                        <div className="AuthFieldGroup">
                            <label htmlFor="login-email">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="name@example.com"
                                {...register("email", {
                                    required: "Email is required.",
                                    pattern: {
                                        value: /^\S+@\S+\.\S+$/,
                                        message: "Email is invalid."
                                    }
                                })}
                            />
                            <div className="AuthError">{errors.email?.message}</div>
                        </div>

                        <div className="AuthFieldGroup">
                            <label htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Password is required.",
                                    minLength: {
                                        value: 4,
                                        message: "Password must be at least 4 characters."
                                    }
                                })}
                            />
                            <div className="AuthError">{errors.password?.message}</div>
                        </div>

                        <button className="AuthPrimaryButton" type="submit">
                            Login
                        </button>
                    </form>

                    <p className="AuthFooterText">
                        New here? <Link to="/register">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
