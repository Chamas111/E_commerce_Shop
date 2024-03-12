require("dotenv").config();
const express = require("express");
const { JsonWebTokenError } = require("jsonwebtoken");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const { runInNewContext } = require("vm");

app.use(express.json());
app.use(cors());

//Database Connection with MongoDb
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_ATLAS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
connectDB().then(() => {
  app.listen(process.env.Port, () => {
    console.log(`Server is runing on port ${process.env.Port}`);
  });
});
// API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

//Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Schema creating user model

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: { type: String, unique: true },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//creating endpoint for registering user
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "existing user found, the email or username is already exist",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });
    await user.save();
    const data = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(data, "secret_ecom");
    res.json({ success: true, token });
  }
});

//user login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password!!!" });
    }
  } else {
    res.json({ success: false, errors: "Wrong email ID" });
  }
});

const upload = multer({ storage: storage });

//Creating Upload Endpoint for Images
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

//creating endpoint for newcollection

app.get("/newcollections", async (req, res) => {
  try {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
  } catch (error) {
    console.error("Error fetching new collection:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
//creating endpoint for popular in women section

app.get("/popularinwomen", async (req, res) => {
  try {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("popular_in_women Fetched");
    res.send(popular_in_women);
  } catch (error) {
    console.error("Error fetching new collection:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//middelware to fetch user

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ error: "Please authenticate valid token" });
    }
  }
};

//creating endpoint to get cartdata

app.post("/getcart", fetchUser, async (req, res) => {
  console.log("getCart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

//creating endpoint for adding products in cartdata

app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });
    let itemId = req.body.itemId;

    // Initialize cartData if it doesn't exist
    if (!userData.cartData) {
      userData.cartData = {};
    }

    // Initialize quantity to 0 if the product doesn't exist in cartData
    if (!userData.cartData[itemId]) {
      userData.cartData[itemId] = 0;
    }

    // Increment quantity by 1
    userData.cartData[itemId] += 1;

    // Update the user document with the modified cartData
    await Users.findByIdAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );

    res.send("Added");
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).send("Internal Server Error");
  }
});
//creating path to remove product from cartdata
app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });
    let itemId = req.body.itemId;

    // Initialize cartData if it doesn't exist
    if (!userData.cartData) {
      userData.cartData = {};
    }

    // Initialize quantity to 0 if the product doesn't exist in cartData
    if (!userData.cartData[itemId]) {
      userData.cartData[itemId] = 0;
    }

    // Increment quantity by 1
    userData.cartData[itemId] -= 1;

    // Update the user document with the modified cartData
    await Users.findByIdAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );

    res.send("Removed", req.body.itemId);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

//Schema for Creating products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: { type: String, required: true },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

//Creating API to Add products
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("save");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API to delete product
app.delete("/removeproduct/:id", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });

  console.log("Removed");

  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for getting all products

app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});
