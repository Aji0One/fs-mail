const express= require ('express');
const dotenv= require('dotenv');
const mongo= require("./connect");
const auth= require("./Module/authModule");
const productRouter= require('./Router/productRouter');
const registerRouter= require('./Router/registerRouter');
const cors= require("cors");

dotenv.config();
const app= express();

mongo.Connect();

app.use(cors());
app.use(express.json())

app.use('/register',registerRouter);

app.use("/",auth.authenticUser);
app.use('/product',productRouter);

app.listen(process.env.PORT);
