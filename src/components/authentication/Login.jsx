import { useState, useCallback } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { error_toast, success_toast } from "../../common/services/services";
import { post_data } from "../../common/services/fetch";
import {
    TextField,
    Box,
    Typography,
    Button,
    CircularProgress,
} from "@mui/material";
import { useNavigate, NavLink } from "react-router-dom";
import ButtonLoader from "../../common/lib/ButtonLoader";

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        username: "",
        password: "",
    });

    const signIn = useCallback(async () => {
        const { username, password } = data;
        if (!username.trim() || !password.trim()) {
            error_toast("Fill all the details");
            return;
        }
        setLoading(true);
        post_data("/auth/signin", data)
            .then((res) => {
                const { headers, data: resData } = res;
                localStorage.setItem("token", headers["x-auth-token"]);
                localStorage.setItem("role", resData.roles);
                localStorage.setItem(
                    "user",
                    JSON.stringify({ email: resData.email, id: resData.id })
                );
                success_toast("Login Successfully.");
                navigate("/products");
            })
            .catch((err) => {
                error_toast(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [data, navigate]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    }, []);

    return (
        <Box>
            <form className="registerForm">
                <span className="lock">
                    <LockOutlinedIcon />
                </span>
                <Typography variant="h5" align="center" gutterBottom>
                    Sign In
                </Typography>
                <TextField
                    type="email"
                    name="username"
                    variant="outlined"
                    label="Email Address*"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                />
                <TextField
                    type="password"
                    name="password"
                    variant="outlined"
                    label="Password*"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={signIn}
                    className="loginBtn"
                >
                    <ButtonLoader isLoading={loading} buttonText={"SIGN IN"} />
                </Button>

                <Box display="flex" justifyContent="flex-start" mt={3}>
                    <NavLink to="/signup">
                        <Typography variant="body1">
                            Don't have an account? Sign Up
                        </Typography>
                    </NavLink>
                </Box>
            </form>

            <Box display="flex" justifyContent="center" mt={3} width="100%">
                <Typography variant="body2">
                    Copyright ©
                    <a
                        href="https://www.upgrad.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        upGrad
                    </a>{" "}
                    2023.
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;
