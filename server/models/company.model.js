import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    company_name: {
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
    companyId: {
  type: String,
  unique: true,
  index: true,
},

parentCompany: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Company",
  default: null,
},
isFranchise: {
  type: Boolean,
  default: false,
},
gstNumber: {
  type: String,
  default: "",
},
    plan: {
  type: String,
  enum: ["Basic", "Standard", "Business", "Trial"],
},

    subscription_start_date: {
      type: Date,
      default : Date.now,
    },
    subscription_end_date: {
      type: Date,
    }
  },
  {
    timestamps: true, 
  }
);

companySchema.pre("save", async function () {
  if (this.isNew && this.plan === "Trial") {
    const start = this.subscription_start_date || Date.now();
    this.subscription_end_date = new Date(
      new Date(start).getTime() + 7 * 24 * 60 * 60 * 1000
    );
  }
});

const Company = mongoose.model("Company", companySchema);

export default Company;
