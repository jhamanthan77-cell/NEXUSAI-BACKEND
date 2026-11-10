import mongoose from "mongoose"
const UserSchema= new mongoose.Schema({
name:{
    type:String,
    required:true,
    trim:true
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
},
password:{
    type:String,
    required:true,
},
isEmailVerified:{
    type:Boolean,
    default:false
},
emailOtpHash:{
    type:String,
    default:null
},
emailOtpExpires:{
    type:Date,
    default:null
}

},
{
      timestamps:true
}
);

const User= mongoose.model("User",UserSchema)
export default User;