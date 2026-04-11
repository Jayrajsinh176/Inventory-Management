import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'company',
        required : true,
    },
    name : {
        type : String,
        required : true,
    },
    email :{
        type : String,
    },
    phone : {
        type : String,
        required : true,
    },
    address : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
    updatedAt : {
        type : Date,
        default : Date.now,
    },
});

export default mongoose.model('Vendor', vendorSchema);