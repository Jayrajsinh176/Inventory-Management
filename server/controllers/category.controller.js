import mongoose from "mongoose";
import Category from "../models/category.model";
import Company from "../models/company.model";



const handleCategoryError = (res, error) => {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors || {}).map((item) => item.message);
      return res.status(400).json({
        message: errors[0] || "Validation failed",
        errors,
      });
    }
    if (error.code === 11000) {
        return res.status(400).json({
            message: "Category already exists for this company",
        });
    }
    console.error("Category error:", error);
    return res.status(500).json({ message: "Internal server error" });
}
/** 
 * @description get all category for company
 * @route GET /api/category
 * @access Protected
 */
export const getCategory = async (req, res) {
    try{
        const query = { company : req.user.company };

        const category = await Category.find(query)
        .sort({createdAt:-1});

        return res.status(200).json({
            message:"Category fetched successfully",
            count:category.length,
            category:category.map(category=>({
                id:category._id,
                company:category.company,
                name:category.name,
                createdAt:category.createdAt,
                updatedAt:category.updatedAt,
            }))
        })
    } catch(error){
        return handleCategoryError(res,error);
    }
};


/** 
 * @description create category for a company
 * @route POST /api/category
 * @access Protected
 */

export const createCategory = async (req, res) => {
    
}