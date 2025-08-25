const {Router} = require("express")
const router = Router(); 
const { getToDo, saveToDo, updateToDo, deleteToDo } = require('../controllers/ToDoController');
router.get("/todos", getToDo);
router.post("/todos", saveToDo);
router.put("/todos/:id", updateToDo);
router.delete("/todos/:id", deleteToDo);
 

module.exports = router ; 