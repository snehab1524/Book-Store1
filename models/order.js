const mongoose = require('mongoose');

const order = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,    
        ref:"User",
        required:true
    },
    books:[{
        book: {
            type:mongoose.Schema.Types.ObjectId,    
            ref:"Book",
            required:true
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status:{
        type:String,
        default:"Order Placed",
        enum:["Order Placed","Shipped","Delivered","Cancelled"]
    }
},
{timestamps:true}
);
module.exports=mongoose.model("Order",order);