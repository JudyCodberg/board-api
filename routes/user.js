const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/checkid/:id", userController.checkId);
router.get("/checkname/:name", userController.checkName);
router.post("/join", userController.join);
router.post("/login", userController.login);
router.get("/findpw/:id", userController.findpassword);

module.exports = router;
