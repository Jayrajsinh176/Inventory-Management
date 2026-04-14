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
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    // Performance metrics
    averageDeliveryTime: {
        type: Number,
        default: 0, // in days
    },
    qualityRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    onTimeDeliveryPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    totalOrders: {
        type: Number,
        default: 0,
    },
    totalOnTimeDeliveries: {
        type: Number,
        default: 0,
    },
    totalLateDeliveries: {
        type: Number,
        default: 0,
    },
    totalSupplyRequests: {
        type: Number,
        default: 0,
    },
    averageProductQuality: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    lastPerformanceUpdate: {
        type: Date,
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

vendorSchema.index({ companyId: 1 });
vendorSchema.index({ status: 1 });
vendorSchema.index({ qualityRating: -1 });

export default mongoose.model('Vendor', vendorSchema);