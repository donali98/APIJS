var express = require("express");
var router = express.Router();
const UserController = require("../controllers/UserController");

/* GET users listing. */
router.post("/insert", UserController.insert);
router.get("/:username", UserController.getOne);
router.get("/", UserController.getAll);
router.put("/:username", UserController.update);
router.delete("/:username", UserController.deleteOne);

module.exports = router;
