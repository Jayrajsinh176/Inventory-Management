import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js"

const router = express.Router();

router.get('/',protect,getCategory);
router.post('/',protect,createCategory);
router.put('/:id',protect,updateCategory);
router.delete('/:id',protect,deleteCategory);

export default router;