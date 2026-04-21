import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RegisterModel } from "../../../Models/RegisterModel";
import { authService } from "../../../Services/AuthService";
import { notify } from "../../../Utils/Notify";
import "../AuthForm.css";

function Register() {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterModel>();

    async function submit(user: RegisterModel): Promise<void> {
        try {
            await authService.register(user);
            notify.success("Register successful");
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
                    <span className="AuthEyebrow">Create Account</span>
                    <h2>Join the platform and start planning your next trip.</h2>
                    <p>
                        Build your traveler profile, explore vacation offers, and unlock
                        personalized tools for finding your next destination.
                    </p>
                </div>

                <form className="AuthFormPanel" onSubmit={handleSubmit(submit)}>
                    <div className="AuthPanelHeader">
                        <h3>Register</h3>
                        <p>Create your account to access the vacations area.</p>
                    </div>

                    <div className="AuthGrid">
                        <div className="AuthFieldGroup">
                            <label htmlFor="register-first-name">First Name</label>
                            <input
                                id="register-first-name"
                                type="text"
                                placeholder="First Name"
                                {...register("firstName", {
                                    required: "First name is required.",
                                    minLength: {
                                        value: 2,
                                        message: "First name must be at least 2 characters."
                                    }
                                })}
                            />
                            <div className="AuthError">{errors.firstName?.message}</div>
                        </div>

                        <div className="AuthFieldGroup">
                            <label htmlFor="register-last-name">Last Name</label>
                            <input
                                id="register-last-name"
                                type="text"
                                placeholder="Last Name"
                                {...register("lastName", {
                                    required: "Last name is required.",
                                    minLength: {
                                        value: 2,
                                        message: "Last name must be at least 2 characters."
                                    }
                                })}
                            />
                            <div className="AuthError">{errors.lastName?.message}</div>
                        </div>
                    </div>

                    <div className="AuthFieldGroup">
                        <label htmlFor="register-email">Email</label>
                        <input
                            id="register-email"
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
                        <label htmlFor="register-password">Password</label>
                        <input
                            id="register-password"
                            type="password"
                            placeholder="At least 4 characters"
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

                    <button className="AuthPrimaryButton" type="submit">Register</button>

                    <p className="AuthFooterText">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
