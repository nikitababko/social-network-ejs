const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkAuth = require("../middleware/checkAuth");
const checkUser = require("../middleware/checkUser");
const checkEmailEnv = require("../middleware/checkEmailEnv");
const userValidator = require("../middleware/schemaValidators/userValidator");
const verificationCheck = require("../middleware/verificationCheck");

router.post("/signup", userValidator.addUser, userController.addUser);

router.post(
    "/login",
    userValidator.loginUser,
    verificationCheck.verificationCheck,
    userController.loginUser,
    userController.sendUserData
);

router.post("/getNewUsers", userValidator.getNewUsers, userController.getNewUsers);

router.get("/email/activate/:token", userController.activate);

router.post(
    "/sendVerificationEmail",
    checkEmailEnv,
    userValidator.sendVerificationEmail,
    userController.sendVerificationEmail
);

router.post(
    "/sendforgotPasswordEmail",
    checkEmailEnv,
    userValidator.sendVerificationEmail,
    userController.sendforgotPasswordEmail
);

router.post(
    "/getUserData",
    checkAuth,
    userValidator.getUserData,
    userController.getUserData,
    userController.getUserPosts,
    userController.sendUserData
);

router.post("/delete/", checkAuth, userController.deleteUser);

module.exports = router;
