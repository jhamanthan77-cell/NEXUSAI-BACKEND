import express from "express"
import User from "../src/models/user.js"
const router = express.Router();
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


    router.post("/register", async (req, res) => {
    try {
        const{name,email,password}=req.body;
        if(!name||!password||!email){
            return res.status(400).json({
                success:false,
                message:"name.email.password is required"
            })
        }
        const normalizedEmail = email.trim().toLowerCase();
        const ExistingUser= await User.findOne({email})
        if(ExistingUser){
            return res.status(409).json({
                success:false,
                message:"Email is aleready registered"
            })
        }
         const HashedPassword=await bcrypt.hash(password,10)
         const NewUser=await User.create({
            name,email,
             password:HashedPassword,
             
         })
         return res.status(201).json({
            success:true,
            message:"User registered successfully",
            User:{
                id:NewUser._id,
                name:NewUser.name,
                email:NewUser.email


            }
         })
        
    } catch (error) {
        console.error("Registration Error", error)
        if(error.code===11000){
            return res.status(409).json({
                success:false,
                message:"email is aleready registered"
            })
        }

        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
        
        
    }
})
//login router
router.post("/login",async(req,res)=>{
    try {
       const {email,password}= req.body 
       if(!email||!password){
        return res.status(400).json({
            status:false,
            message:"email and password are required"
        })
       }
       //retreive data and find data from mongodb
       const user= await User.findOne({
        email:email.trim().toLowerCase()
       })
       if(!user){
        return res.status(401).json({
            success:false,
            message: "invalid email or password"
        })
       }
        const isPasswordCorrect= await bcrypt.compare(
            password,user.password
    )
    if(!isPasswordCorrect){
        return res.status(401).json({
            success:false,
            message:"invalid email or password"
        })
    }
    const token =jwt.sign(
        {userId:user._id},
        process.env.JWT_SECRET,
         { expiresIn:"1h"}       

    );
    return res.status(200).json({
        success:true,
        message:"LOGGED IN SUCCESSFULLY",
        token,
        user:{
            id:user._id,
            name: user.name,
            email:user.email

        }
    });
    } catch (error) {
        console.log("login error", error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
        
    }
})
export default router;