const router = require("express").Router();
const { createUser, login, verifyMail, updateUser, changePassword, profile, listRegistedClasses } = require("../controllers/user");
const { auth } = require("../middleware/auth");
const upload = require("../utils/multerUpload");



router.post('/', upload.single('avatar'), createUser);
router.post('/login', login);
router.get('/:id', auth, profile);
router.get('/verify/:token', verifyMail);
router.get('/:id/registered-class', auth, listRegistedClasses);
router.put("/update/:id", auth, upload.single('avatar'), updateUser);
router.patch("/change-password/:id", auth, changePassword);

module.exports = router;