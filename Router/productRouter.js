const express= require("express");
const productModules= require("../Module/productModule");
const auth= require ("../Module/authModule")
const router=express.Router();

router.get("/get", productModules.getProduct)
   
router.post("/create", auth.authoriseUser, productModules.createProduct);

router.put("/update/:id", auth.authoriseUser, productModules.updateProduct);

router.delete("/delete/:id", auth.authoriseUser, productModules.deleteProduct);

module.exports=router;