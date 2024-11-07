import { useEffect, useState } from "react";
import "./addaddress.css";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { error_toast, success_toast } from "../../common/services/services";
import { get_login, logData, post_login } from "../../common/services/fetch";
import { Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import ButtonLoader from "../../common/lib/ButtonLoader";

const steps = ["Item", "select address", "Confirm order"];

const AddressForm = ({ data, handleChange, addAddress, goToOrder, nextstep, isLoading }) => (
    <form className="registerForm1" style={{ marginTop: "20px" }}>
        <h3 style={{ marginTop: "5px", textAlign: "center" }}>Add Address</h3>
        <TextField name="name" label="Name" variant="outlined" value={data.name} onChange={handleChange} />
        <TextField name="contactNumber" variant="outlined" value={data.contactNumber} label="Contact number" onChange={handleChange} />
        <TextField name="street" variant="outlined" label="Street" value={data.street}  onChange={handleChange} />
        <TextField name="city" variant="outlined" label="City" value={data.city} onChange={handleChange} />
        <TextField name="state" variant="outlined" label="State" value={data.state} onChange={handleChange} />
        <TextField name="landmark" variant="outlined" label="landmark" value={data.landmark} onChange={handleChange} />
        <TextField name="zipcode" variant="outlined" label="zipcode" value={data.zipcode} onChange={handleChange} />
        <button type="button" onClick={addAddress} className="loginBtn" size="medium">
            <ButtonLoader isLoading={isLoading} buttonText={"SAVE ADDRESS"}></ButtonLoader>
            </button>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Button style={{ marginTop: "10px", marginRight: "20px", color: "#000000" }} size="medium" variant="text" onClick={goToOrder}>BACK</Button>
            <Button style={{ marginTop: "10px", backgroundColor: "#3f51b5" }} size="medium" variant="contained" color="primary" onClick={nextstep}>NEXT</Button>
        </div>
    </form>
);

const AddressSelection = ({ addressList, address, setAddress, isLoading }) => (
    <div style={{ textAlign: "center", height:"100px" }}>
        <p style={{ marginBottom: "20px" }}>Select address:</p>
        {isLoading ? <CircularProgress className="addressLoading" color="primary" size={40} /> :
        <TextField
            name="address"
            id="outlined-select-currency"
            select
            label="Select"
            defaultValue="select"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: "50%", textAlign: "start" }}
        >
            <MenuItem value="">select</MenuItem>
            {addressList.map((e, i) => (
                <MenuItem key={i} value={e}>
                    {`${e.street} ${e.city} ${e.state} ${e.zipcode}`}
                </MenuItem>
            ))}
        </TextField> }
    </div>
);

const ConfirmOrder = ({ details, qty, address, midStep, placeOrder, isLoading }) => (
    <>
        <div className="finalStep">
            {details && (
                <div style={{ width: "60%" }}>
                    <h1>{details.name}</h1>
                    <p>Quantity: {qty}</p>
                    <p>Category: {details.category.toUpperCase()}</p>
                    <p><em>{details.description}</em></p>
                    <h2 style={{ color: "red" }}>Total Price : {details.price * qty}</h2>
                </div>
            )}
            <div style={{ width: "40%", borderLeft: "1px solid #80808045" }}>
                <h1>Address Details :</h1>
                <p>{address.street}</p>
                <p>Contact Number :{address.contactNumber}</p>
                <p>{address.landmark}</p>
                <p>{address.state}</p>
                <p>{address.zipcode}</p>
            </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Button style={{ marginTop: "10px", marginRight: "20px", color: "#000000" }} size="medium" variant="text" onClick={midStep}>BACK</Button>
            <Button style={{ marginTop: "10px", backgroundColor: "#3f51b5" }} size="medium" variant="contained" onClick={placeOrder}>
                <ButtonLoader isLoading={isLoading} buttonText={"PLACE ORDER"}></ButtonLoader>
                </Button>
        </div>
    </>
);

const AddAddress = () => {
    const { id, qty } = useParams();
    const navigate = useNavigate();
    const [addressList, setAddressList] = useState([]);
    const [activeKey, setActiveKey] = useState(1);
    const [address, setAddress] = useState({});
    const [confirmOrder, setconfirmOrder] = useState(false);
    const [data, setData] = useState({
        name: "",
        contactNumber: "",
        street: "",
        city: "",
        state: "",
        landmark: "",
        zipcode: "",
    });
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const addAddress = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        // await get_login("/users/"+user?.id).then((res)=>{
        //     console.log(res.data);
        // })
        if (
            data.name.trim().length === 0 ||
            data.contactNumber.trim().length === 0 ||
            data.street.trim().length === 0 ||
            data.city.trim().length === 0 ||
            data.state.trim().length === 0 ||
            data.landmark.trim().length === 0 ||
            data.zipcode.trim().length === 0
        ) {
            error_toast("Fill all the details");
            return;
        }
        setLoading(true);
        await post_login("/addresses", data)
            .then((res) => {
                success_toast("address added successfully");
                setData({
                    ...data,
                    name: "",
                    contactNumber: "",
                    city: "",
                    state: "",
                    street: "",
                    landmark: "",
                    zipcode: "",
                });
                getAddresList();
            })
            .catch((e) => {
                error_toast("something went wrong");
            }).finally(()=> {
                setLoading(false);
            });
    };

    const placeOrder = async () => {
        let json = {
            quantity: 2,
            product: id,
            address: address.id,
        };
        setLoading(true);
        await post_login("/orders", json)
            .then((res) => {
                success_toast("Your order is confirmed.");
                navigate("/products");
            })
            .catch((e) => {
                error_toast("something went wrong");
            }).finally(()=> {
                setLoading(false);
            });
    };

    const goToOrder = () => {
        navigate("/product/" + id);
    };

    const getAddresList = async () => {
        setLoading(true);
        await get_login("/addresses")
            .then((res) => {
                let a = res.data;
                a = a.map((e) => {
                    let obj = {
                        state: e.state,
                        city: e.city,
                        street: e.street,
                        landmark: e.landmark,
                        zipcode: e.zipcode,
                        contactNumber: e.contactNumber,
                        user: e.user,
                        id: e.id
                    };
                    return obj;
                });
                setAddressList(a);
            })
            .catch((e) => {
                error_toast("something  went wrong");
            }).finally(()=> {
                setLoading(false);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const nextstep = () => {
        if (address === "") {
            error_toast("please select address");
            return;
        }
        setActiveKey(2);
        setconfirmOrder(true);
    };

    const midStep = () => {
        navigate("/addaddress/" + id + "/2");
    };

    const getProductDetails = async () => {
        setLoading(true);
        await get_login("/products/" + id)
            .then((res) => {
                let a = res.data;
                setDetails(a);
            })
            .catch((e) => {
                error_toast("something  went wrong");
            }).finally(()=> {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAddresList();
    }, []);

    useEffect(() => {
        if (!logData()) {
            navigate("/login");
        }
    });

    useEffect(() => {
        getProductDetails();
    }, [id]);

    return (
        <div>
            <Box sx={{ width: "80%", margin: "auto", marginY: "20px" }}>
                <Stepper activeStep={activeKey} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            {!confirmOrder && (
                <>
                    <AddressSelection addressList={addressList} address={address} setAddress={setAddress} isLoading={loading} />
                    <p style={{ textAlign: "center" }}>OR</p>
                    <AddressForm data={data} handleChange={handleChange} addAddress={addAddress} goToOrder={goToOrder} nextstep={nextstep} isLoading={loading} />
                </>
            )}
            {confirmOrder && (
                <ConfirmOrder details={details} qty={qty} address={address} midStep={midStep} placeOrder={placeOrder} isLoading={loading} />
            )}
        </div>
    );
};

export default AddAddress;
