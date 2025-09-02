const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'Product'
            },
            quantility:{
                type:Number,
                default:1
            },
        }
    ],
},{ timestamps: true });
module.exports=mongoose.model('Cart', cartSchema);