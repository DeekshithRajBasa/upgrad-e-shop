import { useEffect, useState } from "react";
import { error_toast, success_toast } from "../../common/services/services";
import { get_login, logData, post_login } from "../../common/services/fetch";
import { MenuItem, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "../../common/lib/ButtonLoader";

const AddProduct = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        category: "",
        price: 0,
        description: "",
        manufacturer: "",
        availableItems: "",
        imageUrl: "",
    });
    const [buttonLoading, setButtonLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [productCategories, setProductCategories] = useState([]);
    const addProduct = async () => {
        if (
            data.name.trim().length === 0 ||
            data.category.trim().length === 0 ||
            Number(data.price) === 0 ||
            data.description.trim().length === 0 ||
            data.manufacturer.trim().length === 0 ||
            data.availableItems.trim().length === 0 ||
            data.imageUrl.trim().length === 0
        ) {
            error_toast("Fill all the details");
            return;
        }
        setButtonLoading(true);
        await post_login("/products", data)
            .then((res) => {
                success_toast("Product added successfully");
                navigate("/products");
            })
            .catch((e) => {
                error_toast("something went wrong");
            })
            .finally(() => {
                setButtonLoading(false);
            });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };
    useEffect(() => {
        if (!logData()) {
            navigate("/login");
        } else {
            fetchCategories();
        }
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        await get_login("/products/categories")
            .then((res) => {
                let updatedCategories = res.data;
                setProductCategories(updatedCategories);
            })
            .catch((e) => {
                error_toast(e.response.data.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    return (
        <div>
            <form className="registerForm">
                <h3 style={{ marginTop: "5px" }}>Add Product</h3>
                <TextField
                    name="name"
                    label="Name"
                    variant="outlined"
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
                <TextField
                    name="category"
                    id="outlined-select-currency"
                    select
                    label="Category"
                    defaultValue="Select"
                    value={data.category}
                    onChange={(e) => handleChange(e)}
                    style={{ textAlign: "start" }}
                >
                    <MenuItem value="">select</MenuItem>
                    {productCategories.map((e, i) => (
                        <MenuItem key={i} value={e}>
                            {e}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    name="manufacturer"
                    variant="outlined"
                    label="manufacturer"
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
                <TextField
                    name="price"
                    type="number"
                    variant="outlined"
                    label="Price"
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
                <TextField
                    name="availableItems"
                    variant="outlined"
                    label="availableItems"
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
                <TextField
                    name="imageUrl"
                    variant="outlined"
                    label="Image Url"
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
                <TextField
                    name="description"
                    variant="outlined"
                    label="description"
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
                <button type="button" onClick={addProduct} className="loginBtn">
                    <ButtonLoader
                        isLoading={buttonLoading}
                        buttonText={"Save Product"}
                    ></ButtonLoader>
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
