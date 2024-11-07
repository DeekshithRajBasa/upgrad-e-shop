import { useEffect, useState } from "react";
import { delete_login, get_login, logData } from "../../common/services/fetch";
import { useLocation, useNavigate } from "react-router-dom";
import {
    error_toast,
    success_toast,
    confirm_toast,
} from "../../common/services/services";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./home.css";
import {
    CircularProgress,
    MenuItem,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
const Home = () => {
    const userData = logData();
    const location = useLocation();
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productCategories, setProductCategories] = useState(["ALL"]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const handleCategoryChange = (event, newCategory) => {
        if (newCategory === "ALL") {
            fetchProducts();
        } else {
            let filteredList = [...allProducts];
            filteredList = filteredList.filter(
                (product) => product.category === newCategory
            );
            setFilteredProducts(filteredList);
        }
        setSelectedCategory(newCategory);
    };
    const fetchProducts = async () => {
        setLoading(true);
        await get_login("/products")
            .then((res) => {
                setAllProducts(res.data);
                setFilteredProducts(res.data);
            })
            .catch((e) => {
                error_toast(e.response.data.message);
            }).finally(()=> {
                setLoading(false);
            });
    };
    const handleSortChange = (e) => {
        let sortedProducts = [...filteredProducts];
        if (e.target.value === "asc") {
            sortedProducts.sort(
                (a, b) => parseFloat(a.price) - parseFloat(b.price)
            );
            setFilteredProducts(sortedProducts);
        }
        if (e.target.value === "desc") {
            sortedProducts.sort(
                (a, b) => parseFloat(b.price) - parseFloat(a.price)
            );
            setFilteredProducts(sortedProducts);
        }
        if (e.target.value === "new") {
            sortedProducts.reverse();
            setFilteredProducts(sortedProducts);
        }
    };
    const fetchCategories = async () => {
        setLoading(true);
        await get_login("/products/categories")
            .then((res) => {
                let updatedCategories = ["ALL", ...res.data];
                setProductCategories(updatedCategories);
            })
            .catch((e) => {
                error_toast(e.response.data.message);
            }).finally(()=> {
            setLoading(false);
            });
    };
    const confirmDelete = (id) => {
        let callback = (result) => {
            if (result.isConfirmed) {
                deleteProduct(id);
            }
        };
        confirm_toast(callback);
    };

    const deleteProduct = async (id) => {
        setLoading(true);
        await delete_login("/products/" + id)
            .then((res) => {
                fetchProducts();
                success_toast("Product deleted Successfully");
            })
            .catch((e) => {
                error_toast("something went wrong");
            }).finally(()=> {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!userData) {
            navigate("/login");
        } else {
            fetchCategories();
        }
    }, []);

    useEffect(() => {
        let searchResults = [...filteredProducts];
        if (location.pathname.split("/").length > 2) {
            searchResults = searchResults.filter((product) => {
                return product.name
                    .toLowerCase()
                    .includes(location.pathname.split("/")[2].toLowerCase());
            });
            setFilteredProducts(searchResults);
        } else {
            fetchProducts();
        }
    }, [location]);

    return (
       (loading ? <> <div className="productsPageLoader">
        <CircularProgress color="primary" size={40} />
   </div></> : <div>
            <ToggleButtonGroup
                color="primary"
                value={selectedCategory}
                exclusive
                onChange={handleCategoryChange}
                aria-label="Platform"
                style={{
                    marginTop: "30px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {productCategories.map((category, index) => (
                    <ToggleButton key={index} value={category}>
                        {category}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <div style={{ marginLeft: "50px" }}>
                <p style={{ marginBottom: "20px" }}>Sort by:</p>
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Select"
                    defaultValue="def"
                    onChange={(e) => {
                        handleSortChange(e);
                    }}
                    style={{ width: "200px", textAlign: "start" }}
                >
                    <MenuItem value="def">Default</MenuItem>
                    <MenuItem value="asc">Price:Low to High</MenuItem>
                    <MenuItem value="desc">Price:High to Low</MenuItem>
                    <MenuItem value="new">Newest</MenuItem>
                </TextField>
            </div>
            <div className="card-parent">
                {filteredProducts.map((product) => (
                    <Card
                        key={product.id}
                        sx={{ maxWidth: 345, padding: "10px", display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between" }}
                    >
                        <CardMedia
                            component="img"
                            alt="green iguana"
                            height="250"
                            image={product.imageUrl}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>{product.name}</span>
                                <span>₹ {product.price}</span>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {product.description.length > 100
                                    ? product.description.slice(1, 100) + "..."
                                    : product.description}
                            </Typography>
                        </CardContent>
                        <CardActions 
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                style={{ backgroundColor: "#3f51b5" }}
                                size="small"
                                variant="contained"
                                onClick={() => {
                                    navigate("/product/" + product.id);
                                }}
                            >
                                Buy
                            </Button>
                            {userData?.role === "ADMIN" && (
                                <div>
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            navigate(
                                                "/editproduct/" + product.id
                                            );
                                        }}
                                    >
                                        <EditIcon />
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            confirmDelete(product.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </div>
                            )}
                        </CardActions>
                    </Card>
                ))}
            </div>
        </div>)
    );
};

export default Home;
