import mongoose from "mongoose";
import Category from "../models/category.model";
import Company from "../models/company.model";
import e from "express";



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
export const getCategory = async (req, res) => {
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
    try{
        let { name } = req.body;
        name = name?.trim();

        if(!name){
            return res.status(400).json({
                message : "Category Name is required."
            });
        }

        const company = await Company.findById(req.user.company);
        if(!company){
            return res.status(404).json({
                message:"Company not found"
            })
        }
        const existingCategory = await Category.findOne({
            company : req.user.company,
            name:name,
        })
        if(existingCategory){
            return res.status(400).json({
                message:"Category already exists for this company"
            })
        }
        const category = await Category.create({
            company:req.user.company,
            name:name
        })
        return res.status(200).json({
            message:"Category created Successfully.",
            category
        })
    } catch(error){
        return handleCategoryError(res,error);
    }
}

/** 
 * @description update category for a company
 * @route POST /api/category/:id
 * @access Protected
 */

export const updateCategory = async (req, res) => {
    
}

/** 
 * @description delete category for a company
 * @route POST /api/category/:id
 * @access Protected
 */

export const deleteCategory = async (req, res) => {
    
}