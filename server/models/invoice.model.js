import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    company : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company',
        required : true,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    invoiceNumber : {
        type : String,
        unique : true,
        required : true,
    },
    order : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Order',
        required : true,
    },
    amount : {
        type : Number,
        required : true,
    },
    status : {
        type : String,
        enum : ['paid','unpaid'],
        default : 'unpaid',
    },
    issueDate : {
        type : Date,
        default : Date.now,
    },  
})

const Invoice = mongoose.model('Invoice',invoiceSchema);

export default Invoice;