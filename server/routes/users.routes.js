import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    getUsersDetails,
    addUsers,
    updateUsersDetails,
    deleteUser,
    activateUser,
    deactivateUser,
    getUserActivity
} from "../controllers/users.controller.js"
const router = express.Router();

router.get("/",protect , getUsersDetails);
router.post("/",protect , addUsers);
router.patch("/:id/activate",protect,activateUser);
router.patch("/:id/deactivate",protect,deactivateUser);
router.put("/:id",protect , updateUsersDetails);
router.delete("/:id",protect , deleteUser);
router.get("/:id/activity",protect , getUserActivity);

export default router;