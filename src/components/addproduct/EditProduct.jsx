import { useEffect, useState } from "react";
import { error_toast, success_toast } from "../../common/services/services";
import { get_login, logData, put_login } from "../../common/services/fetch";
import { CircularProgress, MenuItem, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ButtonLoader from "../../common/lib/ButtonLoader";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        category: "",
        price: 0,
        description: "",
        manufacturer: "",
        availableItems: "",
        imageUrl: "",
    });
    const [productCategories, setProductCategories] = useState([]);
    const editProduct = () => {
        if (
            data.name.trim().length === 0 ||
            data.category.trim().length === 0 ||
            Number(data.price) === 0 ||
            data.description.trim().length === 0 ||
            data.manufacturer.trim().length === 0 ||
            data.imageUrl.trim().length === 0
        ) {
            error_toast("Fill all the details");
            return;
        }
        setButtonLoading(true);
        put_login("/products/" + id, data)
            .then((res) => {
                success_toast("Updated successfully");
                navigate("/products");
            })
            .catch((e) => {
                console.log(e);
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
    const getProductData = async () => {
        setLoading(true);
        await get_login("/products/" + id)
            .then((res) => {
                let a = res.data;
                setData({
                    ...data,
                    name: a.name,
                    category: a.category,
                    price: a.price,
                    manufacturer: a.manufacturer,
                    description: a.description,
                    availableItems: a.availableItems,
                    imageUrl: a.imageUrl,
                });
            })
            .catch((e) => {
                error_toast(e.response.data.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        getProductData();
    }, [id]);
    useEffect(() => {
        if (!logData()) {
            navigate("/login");
        } else {
            getProductData();
            fetchCategories();
        }
    }, [id]);

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
    return loading ? (
        <div className="productsPageLoader">
            <CircularProgress size={40} />
        </div>
    ) : (
        <div>
            <form className="registerForm">
                <h3 style={{ marginTop: "5px" }}>Modify Product</h3>
                <TextField
                    name="name"
                    label="Name"
                    variant="outlined"
                    value={data.name}
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
                    value={data.manufacturer}
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
                <TextField
                    name="price"
                    type="number"
                    variant="outlined"
                    label="Price"
                    value={data.price}
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
                <TextField
                    name="availableItems"
                    variant="outlined"
                    label="availableItems"
                    value={data.availableItems}
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
                <TextField
                    name="imageUrl"
                    variant="outlined"
                    label="Image Url"
                    value={data.imageUrl}
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
                <TextField
                    name="description"
                    variant="outlined"
                    label="description"
                    value={data.description}
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
                <button
                    type="button"
                    onClick={editProduct}
                    className="loginBtn"
                >
                    <ButtonLoader
                        isLoading={buttonLoading}
                        buttonText={"Modify Product"}
                    ></ButtonLoader>
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
