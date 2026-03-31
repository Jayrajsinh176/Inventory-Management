import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    getUsersDetails,
    addUsers,
    updateUsersDetails,
    deleteUser,
} from "../controllers/users.controller.js"
const router = express.Router();

router.get("/",protect , getUsersDetails);
router.post("/",protect , addUsers);

router.put("/:id",protect , updateUsersDetails);
router.delete("/:id",protect , deleteUser);

export default router;