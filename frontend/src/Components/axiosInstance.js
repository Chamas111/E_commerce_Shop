import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.REACT_APP_SERVER_BASE_URL ||
    "https://e-commerce-shop-jf35.onrender.com",
});

export default instance;
