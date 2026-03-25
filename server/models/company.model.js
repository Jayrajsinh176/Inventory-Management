import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please use a valid 10-digit phone number"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      maxlength: 500,
    },
  },
  {
    timestamps: true, 
  }
);

const Company = mongoose.model("Company", companySchema);

export default Company;