const authModel = require("../models/authModel");
const jwt = require("jsonwebtoken");

async function loginUser(req,res,next){
    try{
    const {username,password} = req.body;
        if(!username || !password){
            return res.status(400).json({success:false,message:"Username and password are required"});
        }
        const user = await authModel.login(username,password);
        if(!user){
            return res.status(401).json({success:false,message:"Invalid username or password"});
        }
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"24h"});
        res.status(200).json({success:true,message:"Login successful",token});
    }catch(err){
        next({status:500,message:err.message});
    }
}

module.exports={loginUser};