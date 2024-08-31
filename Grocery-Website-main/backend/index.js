const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const Stripe = require('stripe')
const { Int32 } = require('mongodb')

const app = express()
app.use(cors())

app.use(express.json({limit : "10mb"}))

const PORT = process.env.PORT || 8080

//mongodb connection
console.log(process.env.MONGODB_URL)
mongoose.set('strictQuery' , false)
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log("Connected to database"))
.catch((err) => console.log(err))

//schema
const userSchema = mongoose.Schema({
    firstName : String,
    lastName : String,
    email : {
        type: String,
        unique : true
    },
    password : String,
    confirmPassword : String,
    image : String
})

//model
const userModel = mongoose.model("user", userSchema)

//api

app.get("/" , (req, res) =>{
    res.send("Server is running")
})

//signup api
app.post("/signup", async(req, res)=>{
    console.log(req.body)
    const {email} = req.body


    try{
        const result = await userModel.findOne({email : email})

        console.log(result)

        if(result){
            res.send({message : "Email id is already registered", alert : false})
        }
        else{
            const data = userModel(req.body)
            const save = await data.save()
            res.send({message : "Successfully signed up", alert: true})
        }
    }
    catch(err){
        console.log(err)
    }
})

// api login
app.post("/login", async(req, res) =>{
    console.log(req.body)
    const {email} = req.body 
    try{
    const result = await userModel.findOne({email : email})
        if(result){
            const dataSend = {
                _id: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                image: result.image,
            }
            console.log(dataSend)
            res.send({message : "Successfuly Logged In" , alert : true, data : dataSend})
        }
        else{
            res.send({message : "Email not Registered! Please Sign up." , alert : false})
        }
    }
    catch(err){
        console.log(err)
    }
})

// product section
const productSchema = mongoose.Schema({
    name : String,
    category : String,
    image : String,
    price : Number,
    description : String,
})

const productModel = mongoose.model("product", productSchema)

// save product in database
// api
app.post("/uploadProduct", async(req, res) =>{
    console.log(req.body)
    const products = req.body.map(productData => new productModel(productData));
    const savedProducts = await productModel.insertMany(products);
    // const data = await productModel(req.body)
    // const dataSave = await data.save()

    res.send({message : "Added"})
})

// 
app.get("/product", async(req, res) =>{
    // print("HI POOKIE")
    const data = await productModel.find({})
    res.send(JSON.stringify(data))
})

const productInsightsSchema = mongoose.Schema({
    name: String,
    serving_size: String,
    calories: Number,
    protein: String,
    fat: String,
    carbohydrate: String,
    sugars: String,
    fiber: String
  });
  const productInsightsModel = mongoose.model(
    "productInsights",
    productInsightsSchema
  );
  
  app.post("/uploadInsights", async (req, res) => {
    const data = req.body.map(
      (productInsightsData) => new productInsightsModel(productInsightsData)
    );
    const savedData = await productInsightsModel.insertMany(data);
    res.send({ message: "Added" });
  });
  const success = {
    SUCCESS: true,
    FAILURE: false,
  };
  
  const ResponseStatus = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    PAYMENT_REQUIRED: 402,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    ACCESS_DENIED: 440,
    INTERNAL_ERROR: 500,
  };

  const successResponse = (res, msg, data) => {
    if (data) {
      res.status(ResponseStatus.SUCCESS).send({
        msg,
        data,
      });
      return;
    }
    res.status(ResponseStatus.SUCCESS).send({
      msg,
    });
  };

  app.post("/getInsights", async (req, res) => {
    const { productName } = req.body;
    
    const productDetails = await productInsightsModel.findOne({ name: productName })

    console.log(productDetails);
    return successResponse(res,"Product Details",productDetails)
    
  })


  app.post("/getAllInsights", async (req, res) => {
    const { listOfProducts } = req.body;
    products_details = [];
    for (let i = 0; i < listOfProducts.length; i++) {
      prod_detail = await productInsightsModel.findOne({
        name: listOfProducts[i],
      });
      products_details.push(prod_detail);
    }
    return successResponse(res, "All product Details", products_details);
  });

  app.post("/similarItems", async (req,res) => {
    const { listOfCategories } = req.body;
    const similarItems = await productModel.find({
        category: { $in: listOfCategories}
    });
    return successResponse(res, "Similar Products",similarItems)
  })


app.listen(PORT, () => console.log("Server is running at port : " + PORT))