import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup= async (req,res)=>{
    const {fullName,email,password}=req.body
    try{
        if(password.length<6){
            return res.send(400).json({message:"Password must be at least 6 characters"});
        }
        const existinguser=await User.findOne({email})
        if(existinguser) return res.status(400).json({msg:"Email already exists"});

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=await User.create(
            {
            fullName,
            email,
            password:hashedPassword
        });

        if(newUser){
            //user found and valdiate jwt token here 
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201);
        }
        else{
            return res.status(400).json({msg:"Invalid user data"});
        }
    }
    catch(error){

    }
}
export const login=(req,res)=>{
    res.send("login route");
}
export const logout=(req,res)=>{
    res.send("logout route");
}

