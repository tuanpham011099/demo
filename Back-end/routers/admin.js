const router = require("express").Router();
const { createAdmin, login, changePassword, updateAdmin, profile, viewUserInclass, addTimetable, deleteTime } = require("../controllers/admin");
const { auth, isAdmin } = require("../middleware/auth");
const upload = require("../utils/multerUpload");

router.post("/", upload.single("avatar"), createAdmin);
router.post("/login", login);
router.patch('/change-password/:id', auth, isAdmin, changePassword);
router.post('/:id/timetable', auth, isAdmin, addTimetable);
router.get('/:id', auth, isAdmin, profile);
router.get('/class/:id', auth, isAdmin, viewUserInclass);
router.put('/update/:id', auth, isAdmin, updateAdmin);
router.delete('/class/:id/timetable/:id/delete', auth, isAdmin, deleteTime);
module.exports = router;