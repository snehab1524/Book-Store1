const mongoose = require('mongoose');

const user  = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true 
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true   
    },
    avatar:{
        type:String,
       default:"https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Picture.png"
    },
    role:{
        type:String,
        default:"user",
        enum: ["user","admin"]
    },
    favorites:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Book"
        }
    ],
    cart:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book"
        }
      ],
    orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Order"
        }
    ]



},
{timestamps:true}
);
module.exports=mongoose.model("User",user);