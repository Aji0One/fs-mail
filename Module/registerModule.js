const mongo= require('../connect');
const bcrypt= require('bcrypt');
const nodemailer= require('nodemailer');
const jwt= require('jsonwebtoken');
const ObjectId= require('mongodb');

exports.signup= async (req,res,next) => {
    console.log(req.body.email);
    try{
        //Email Validation
        const existUser= await mongo.selectedDb.collection('users').findOne({email:req.body.email});
        if(existUser){
            res.status(400).send({msg:"your are already an existing user. Kindly signin"});
        }

        //Password Validation
        const isSamePassword= checkPassword(req.body.password,req.body.confirmPassword);
        if(!isSamePassword){
            res.status(400).send({msg:"password doesn't match"});
        }
        else delete req.body.confirmPassword;

        //password hashing
        const randomString= await bcrypt.genSalt(10);
        req.body.password= await bcrypt.hash(req.body.password,randomString);

        //save in Db
        const insertedResponse= await mongo.selectedDb.collection("users").insertOne({...req.body});
        res.send(insertedResponse);
    }
    catch(err){
        console.error(err);
        res.status(500).send(err);
    }

}

const checkPassword =(password,confirmPassword) => {
    return password !== confirmPassword ? false : true;
};

exports.signin= async (req,res,next) => {
    //req.body. email || password
    console.log(req.body.email);
    //Email Verification
    const existUser= await mongo.selectedDb.collection("users").findOne({email:req.body.email});
        res.status(200).send({body: existUser})
    if(!existUser){
        res.status(400).send({msg:"Email doesn't match"});
    }

    //password incorrect
    const isPassword= await bcrypt.compare(req.body.password,existUser.password);
    console.log(isPassword);
    if(!isPassword){
        res.status(400).send({msg:"Incorrect Password"});
    }

    //generate token and send it as response
    const token= jwt.sign(existUser,process.env.SECRET_KEY,{expiresIn:'1hr'});
    res.send(token);

}

exports.forgotpassword= async (req, res) => {
    //check email
    const existUser= await mongo.selectedDb.collection("users").findOne({email:req.body.email});
    if(!existUser){
        res.status(400).send({msg:"Kindly enter the valid email"});

    }
    var transporter= nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: 'ajithkumarmspva@gmail.com',
            pass: process.env.AUTH
        }
    });


    const secret= process.env.SECRET_KEY + existUser.password;
    const token=jwt.sign(existUser,secret,{expiresIn:'15m'});
    const link=`http://localhost:3002/register/resetpassword/${existUser._id}/${token}`;
    
    var mailOption={
        from:'ajithkumarmspva@gmail.com',
        to: existUser.email,
        subject:'Password reset link',
        html:`<p>The password reset link as been provided below.</p>
                <a href=${link}>click here</a> `
    }
    console.log(link);
    transporter.sendMail(mailOption,(err,info)=>{
        if(err){
            console.error(err);
        }
        else{
            res.status(200).send({msg: info.response});
            console.log('Email sent', info.response);
        }
    })
    
res.send("Reset Link has been sent to your email..")
}

exports.resetpassword= async (req,res)=>{

    
    const {id, token}= req.params;
    const existUser= await mongo.selectedDb.collection('users').find().toArray();
   
    const user= existUser.filter((ele) => id==ele._id);
    
    if(id!=user[0]._id){
        res.send("Invalid Id");
        return;
    }
    const secret=process.env.SECRET_KEY + user[0].password;
    try{
        const payload= jwt.verify(token,secret);
        res.send('resetpassword');
    }catch(err){
        console.error(err);
        res.send(err.message);
    }
    
    
}

exports.resetpasswordpost= async (req,res) => {
    const {id, token}= req.params;
    const{password,confirmPassword}= req.body;
    const existUser= await mongo.selectedDb.collection('users').find().toArray();
   
    const user= existUser.filter((ele) => id==ele._id);
    
    if(id!=user[0]._id){
        res.send("Invalid Id");
        return;
    }
    const secret=process.env.SECRET_KEY + user[0].password;
    try{
        const payload= jwt.verify(token,secret);
        const isSamePassword= checkPassword(password,confirmPassword);
        if(!isSamePassword){
            res.status(400).send({msg:"password doesn't match"});
        }
        else delete req.body.confirmPassword;

        //password hashing
        const randomString= await bcrypt.genSalt(10);
        password= await bcrypt.hash(req.body.password,randomString);

        user.password= password;
        res.send(user[0]);
    }catch(err){
        console.error(err);
        res.send(err.message);
    }
}