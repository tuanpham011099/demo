const router = require("express").Router();
const { auth, isAdmin } = require("../middleware/auth");
const { listClass, addCourse, deleteCourse, updateCourse, details } = require("../controllers/course");

router.get('/', listClass);
router.get('/:id', details);
router.post('/', auth, isAdmin, addCourse);
router.put('/:id', auth, isAdmin, updateCourse);
router.delete("/:id", auth, isAdmin, deleteCourse);


module.exports = router;