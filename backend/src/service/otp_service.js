import {randomInt,createHmac} from "node:crypto"
import nodemailer from "nodemailer"

export function generateOTP(){
    return randomInt(100000, 1000000).toString();
}
export function getOTPExpiry(){
    return new Date(Date.now()+5*60*1000)
      
}
export function hashOTP(otp){
    const secret=process.env.OTP_SECRET;
    if(!secret){
        throw new Error("OTP_SECRET is missing from env variables")
    }
    return createHmac("sha256", secret).update(otp).digest("hex");
}