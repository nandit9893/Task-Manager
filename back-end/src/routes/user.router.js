import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js";
import { deleteUser, editUserData, getSpecificUserData, gettingAllUserData, saveUserDetails } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.route("/save/user/data").post(upload.single("avatar"), saveUserDetails);
userRouter.route("/getting/all/user/data").get(gettingAllUserData);
userRouter.route("/getting/specific/user/data/:userID").get(getSpecificUserData);
userRouter.route("/delete/user/:userID").post(deleteUser);
userRouter.route("/edit/user/details/:userID").put(upload.single("avatar"), editUserData);

export default userRouter;