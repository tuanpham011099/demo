const router = require("express").Router();
const { registerCourse, courseApproval, listRegistration, courseReject, cancelRegistration } = require("../controllers/registration");
const { auth, isAdmin } = require("../middleware/auth");

router.get('/', listRegistration);
router.post("/:class_id", auth, registerCourse);
router.post("/cancel/:registration_id", auth, cancelRegistration);
router.post("/approve/:registration_id", auth, isAdmin, courseApproval);
router.post("/reject/:registration_id", auth, isAdmin, courseReject);

module.exports = router;