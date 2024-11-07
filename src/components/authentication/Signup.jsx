import { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { error_toast, success_toast } from "../../common/services/services";
import { post_data } from "../../common/services/fetch";
import { TextField, Typography } from "@mui/material";
import { useNavigate, NavLink } from "react-router-dom";
import ButtonLoader from "../../common/lib/ButtonLoader";
const Signup = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirm_password: "",
        role: ["admin"],
        contactNumber: "",
    });
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});

    const signUp = async () => {
        // Validate all required fields
        const requiredFields = [
            { field: 'firstName', label: 'First Name' },
            { field: 'lastName', label: 'Last Name' },
            { field: 'email', label: 'Email' },
            { field: 'password', label: 'Password' },
            { field: 'confirm_password', label: 'Confirm Password' },
            { field: 'contactNumber', label: 'Contact Number' }
        ];

        for (const { field, label } of requiredFields) {
            if (!data[field]?.trim()) {
                error_toast(`${label} is required`);
                return;
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            error_toast("Please enter a valid email address");
            return;
        }

        // Validate password strength
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPasswordRegex.test(data.password)) {
            error_toast("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character");
            return;
        }

        // Validate password match
        if (data.confirm_password !== data.password) {
            error_toast("Confirm password does not match with password");
            return;
        }

        // Validate contact number format
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(data.contactNumber)) {
            error_toast("Please enter a valid 10-digit contact number");
            return;
        }
        setLoading(true);
        post_data("/auth/signup", data, {}).then((response)=>{
            success_toast(response.data.message);
            navigate("/login");
        }).catch((error)=>{
            error_toast(error.response?.data?.message || "Signup failed. Please try again.");
        }).finally(()=>{
            setLoading(false)
        })
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
    };

    return (
        <div>
            <form className="registerForm">
                <span className="lock">
                    <LockOutlinedIcon />
                </span>
                <h3 style={{ marginTop: "5px", textAlign: "center" }}>
                    Sign up
                </h3>
                <TextField
                    name="firstName"
                    label="First Name*"
                    variant="outlined"
                    
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                />
                <TextField
                    type="text"
                    name="lastName"
                    variant="outlined"
                    label="Last Name*"
                    
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                />
                <TextField
                    type="email"
                    name="email"
                    variant="outlined"
                    label="Email Address*"
                    
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                />
                <TextField
                    type="password"
                    name="password"
                    variant="outlined"
                    label="Password*"
                    
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                />
                <TextField
                    type="password"
                    name="confirm_password"
                    variant="outlined"
                    label="Confirm Password*"
                    
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                />
                <TextField
                    type="text"
                    name="contactNumber"
                    variant="outlined"
                    label="Contact Number*"
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                />
                <button type="button" onClick={signUp} className="loginBtn">
                    <ButtonLoader isLoading={loading} buttonText={"SIGN UP"}></ButtonLoader>
                </button>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "right",
                        marginTop: "30px",
                    }}
                >
                    <NavLink to="/login">
                        <Typography variant="body1">
                            Already have an account? Sign in
                        </Typography>
                    </NavLink>
                </div>
            </form>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "30px",
                    width: "100%",
                }}
            >
                <Typography variant="body2">
                    Copyright ©
                    <a href="https://www.upgrad.com/" target="blank">
                        upGrad
                    </a>{" "}
                    2023.
                </Typography>
            </div>
        </div>
    );
};

export default Signup;
