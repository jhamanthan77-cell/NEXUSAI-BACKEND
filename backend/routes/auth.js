import express from "express"
import User from "../src/models/user.js"
const router = express.Router();
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { generateOTP, hashOTP, getOTPExpiry } from "../src/service/otp_service.js";
import { sendOtpEmail } from "../src/service/Email_service.js";

//register the user!!!!
    router.post("/register", async (req, res) => {
    try {
        const{name,email,password}=req.body;
       if (!name.trim() || !email.trim() || !password){
            return res.status(400).json({
                success:false,
                message:"Name,Email and password is required"
            })
        } 
        if (password.length < 8) {
    return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
    });
}
        const normalizedEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const ExistingUser= await User.findOne({ 
            email:normalizedEmail
}


        )
        if (!emailRegex.test(normalizedEmail)) {
return res.status(400).json({
success: false,
message: "Please enter a valid email address"
});
}

        if(ExistingUser){
            return res.status(409).json({
                success:false,
                message:"Email is aleready registered"
            })
        }
         const HashedPassword=await bcrypt.hash(password,10)
         const otp= generateOTP();
         const OtpHash= hashOTP(otp);
         const OtpExpiry=getOTPExpiry();
         console.log("OTP generated at:", new Date());
console.log("OTP expires at:", OtpExpiry);
         const NewUser=await User.create({
            name:name.trim(),
            email:normalizedEmail,
             password:HashedPassword,
             isEmailVerified:false,
             emailOtpHash:OtpHash,
             emailOtpExpires:OtpExpiry,
             
         })
         await sendOtpEmail(normalizedEmail,otp)
         return res.status(201).json({
            
            success:true,
            message:"User registered successfully..Please verify your email usint the otp send to registerd email id",
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
// email verification!!!
router.post("/verify-email",async (req,res)=>{
    try {
        const {email,otp}=req.body;
        if(!email||!otp){
            return res.status (400).json({
                success:false,
                message:"email and otp are required"
            })
        }
        const normalizedEmail=email.trim().toLowerCase();
        const user =await User.findOne({
            email:normalizedEmail
        });
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"

            })
        }
        if(user.isEmailVerified=== true){
            return res.status(400).json({
                success:false,
                message:"Email is aleready verified"
            })
        }
        console.log("OTP hash exists:", Boolean(user.emailOtpHash));
console.log("OTP expiry:", user.emailOtpExpires);
console.log("Current time:", new Date());
        if(
            !user.emailOtpHash||!user.emailOtpExpires||user.emailOtpExpires<new Date()
        ){
            return res.status (400).json({
                success:false,
                message:"OTP invalid or expired"
            })
        }
        const submittedOtpHash=hashOTP(otp);
        if(submittedOtpHash!==user.emailOtpHash){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }
         user.isEmailVerified = true;
        user.emailOtpHash = null;
        user.emailOtpExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });


        
    } catch (error) {
        console.log("Email verification error", error);
        return res.status(500).json({
            success:false,
            message:"Internal server Error"
        });
        
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
    //logi route security gate
    if(!user.isEmailVerified){
        return res.status(403).json({
            success:false,
            message:"please verify your email before logging in"
        })
    };
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