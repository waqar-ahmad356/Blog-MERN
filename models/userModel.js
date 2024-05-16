const mongoose =require("mongoose");
const validator=require("validator")

const userSchema=new mongoose.Schema({
    name:{type:String,
        required:true,
        minLength:[3,"Name must be contain 3 characters"],
        maxLength:[32,"Name cannot exceed 32 characters"]
    },
    email:{type:String,
        required:true,
        validate:[validator.isEmail,"Please enter a valid email"]

    },
    password:{type:String,
        required:true,
       
    },
    role:{type:String,
        required:true,
        enum:["Author","Reader"]
    },
    education:{type:String,
        required:true,},
    phone:{type:Number,
        required:true,},
    avatar:{
        public_id:{type:String},
        url:{type:String}
    },
    createdOn:{
        type:Date,
        default:Date.now,
    }
 });


const userModel=mongoose.model.user || mongoose.model("user",userSchema);
module.exports=userModel;