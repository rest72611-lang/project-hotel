import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RegisterModel } from "../../../Models/RegisterModel";
import { authService } from "../../../Services/AuthService";
import { notify } from "../../../Utils/Notify";

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
            window.location.reload();
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <h2>Register</h2>

            <label>First Name:</label>
            <br />
            <input
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
            <div>{errors.firstName?.message}</div>
            <br />

            <label>Last Name:</label>
            <br />
            <input
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
            <div>{errors.lastName?.message}</div>
            <br />

            <label>Email:</label>
            <br />
            <input
                type="email"
                placeholder="Email"
                {...register("email", {
                    required: "Email is required.",
                    pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Email is invalid."
                    }
                })}
            />
            <div>{errors.email?.message}</div>
            <br />

            <label>Password:</label>
            <br />
            <input
                type="password"
                placeholder="Password"
                {...register("password", {
                    required: "Password is required.",
                    minLength: {
                        value: 4,
                        message: "Password must be at least 4 characters."
                    }
                })}
            />
            <div>{errors.password?.message}</div>
            <br />

            <button type="submit">Register</button>
        </form>
    );
}

export default Register;