const mongo = require("../connect");
const {ObjectId}= require("mongodb");

module.exports.getProduct= async(req,res,next) => {
    try{
        const productData= await mongo.selectedDb.collection("product").find().toArray();
        console.log(productData);
        res.send(productData);
    }
    catch(err){
        console.error(err);
        res.status(500).send(err);
    }
 
};

//note: next is not required

module.exports.updateProduct= async (req,res) => {
    try{
        const id=req.params.id;
        const updatedData= await mongo.selectedDb.collection("product").findOneAndUpdate({_id: ObjectId(id)},{$set: {...req.body.product}},{returnDocument:'after'});
        res.send(updatedData);
    }
    catch (err){
        console.error(err);
        res.status(500).send(err);
    }

};

module.exports.createProduct= async (req,res) => {
    try{
        console.log(req.body);
        const insertedResponse= await mongo.selectedDb.collection("product").insertOne(req.body.product);
        res.send(insertedResponse);

    }
    catch(err){
        console.error(err);
        res.status(500).send(err);
    }
};

module.exports.deleteProduct= async (req,res) => {
    try{
        const id= req.params.id;
        const deletedData= await mongo.selectedDb.collection("product").remove({_id: ObjectId(id)});
        res.send(deletedData);
    }
    catch(err){
        console.error(err);
        res.status(500).send(err);
    }
};