import dotenv from "dotenv";
dotenv.config();
import {randomInt,createHash} from "node:crypto"
import nodemailer from "nodemailer"
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },


})
export async  function sendOtpEmail(Email,Otp){
  return await transporter. sendMail({
    from: process.env.EMAIL_USER,
    to:Email,
    subject:"your MANTRIX verification code ",
    text:`your MANTRIX verification code is ${Otp}. It expires in 5 minutes.`
 })
}