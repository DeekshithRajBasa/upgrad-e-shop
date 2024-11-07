import { CircularProgress } from "@mui/material";

const ButtonLoader = ({ isLoading, buttonText, size = 20 }) => {
    return (
        <>
            {isLoading ? (
                <CircularProgress color="inherit" size={size} />
            ) : (
                buttonText
            )}
        </>
    );
};

export default ButtonLoader;