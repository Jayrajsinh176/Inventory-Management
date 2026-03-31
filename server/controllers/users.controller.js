import mongoose from "mongoose";
import User from "../models/users.model.js";
import Company from "../models/company.model.js";
// import subscription from "../utils/subscription.js";

import { canAddUsersToPlan, formatPlanUsersLimit } from "../utils/subscription.js";

const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

const handleStaffError = (res,error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors || {}).map((item) => item.message);
    return res.status(400).json({
      message: errors[0] || "Validation failed",
      errors,
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      message: "User already exists for this company",
    });
  }

  console.error("Staff error:", error);
  return res.status(500).json({ message: "Internal server error" });
}
/** 
 * @description get all user details
 * @route GET /api/user
 * @access Protected
 */
export const getUsersDetails = async (req,res) => {
    try {
        const users = await User.find({
            company : req.user.company,
        }).select("-password").lean();

        res.status(200).json({
            success : true,
            count : users.length,
            data : users
        })

    } catch ( error ){
        res.status(500).json({
            success : false,
            message : "Internal server error"
        });
    }
}


/** 
 * @description add user
 * @route POST /api/user
 * @access Protected
 */ 
export const addUsers = async (req,res) => {
    try {
        
        const companyDetails = await Company.findById(req.user.company).select("plan");
        console.log(companyDetails._id);
        
        const users = await User.find({
            company : companyDetails._id,
        }).select("-password").lean();
        
        if(canAddUsersToPlan(companyDetails,users.length)){
           let {name,email,phone,role} = req.body;
            name = name?.trim();
            email = email?.trim().toLowerCase();
            phone = phone?.trim();
            role = role?.trim().toLowerCase();

            if(!email && !phone){
                return res.status(400).json({
                    success : false,
                    message : "Email or Phone is required."
                })
            }

            if(!name || (!email && !phone) || !role){
                return res.status(400).json({
                    success : false,
                    message : "All fields are required."
                })
            }

            if(role !== "admin" && role !== "staff"){
                return res.status(400).json({
                    success : false,
                    message : "Invalid role."
                })
            } 
            const existingEmail = users.find(user => user.email === email);
            const existingPhone = users.find(user => user.phone === phone);

            if(existingEmail){
                return res.status(400).json({
                    success : false,
                    message : "Email already exists."
                })
            }
            if(existingPhone){
                return res.status(400).json({
                    success : false,
                    message : "Phone already exists."
                })
            }
            
            const user = await User.create({
                company : req.user.company,
                name,
                email,
                phone,
                password : generatePassword(),
                role
            })
            
            user.save();
            return res.status(201).json({
                success : true,
                message : "Staff added successfully.",
                data : user
            })
        }else{
            return res.status(400).json({
                success : false,
                message : `You have reached the limit of ${formatPlanUsersLimit(req.user.company.plan)} users.`
            })
        }
    } catch (error) {
        return handleStaffError(res,error);
    }
}

/** 
 * @description update user details
 * @route PUT /api/user/:id
 * @access Protected
 */
export const updateUsersDetails = async (req,res) => {
    try {
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "Invalid user id."
            })
        }

        const {name,email,phone,role} = req.body;
        name = name?.trim();
        email = email?.trim().toLowerCase();
        phone = phone?.trim();
        role = role?.trim().toLowerCase();

        if(!name && !email && !phone && !role){
            return res.status(400).json({
                success : false,
                message : "At least one field is required to update."
            })
        }

        const user = await User.findOneAndUpdate({
            _id : id,
            company : req.user.company
        },{
            $set : {
                name,
                email,
                phone,
                role
            }
        },{
            new : true,
            runValidators : true
        })

        if(!user){
            return res.status(404).json({
                success : false,
                message : "Staff not found."
            })
        }

        return res.status(200).json({
            success : true,
            message : "Staff details updated successfully.",
            data : user
        })
    } catch (error) {
        return handleStaffError(res,error);
    }
}

/** 
 * @description delete user
 * @route DELETE /api/user/:id
 * @access Protected
 */ 
export const deleteUser = async (req,res) => {
    try {
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success : false,
                message : "Invalid user id."
            })
        }
        const user = await User.findOneAndDelete({
            _id : id,
            company : req.user.company            
        })

        return res.status(200).json({
            success : true,
            message : "Staff deleted successfully."
        })
    } catch (error) {
        return handleStaffError(res,error);
    }
}

