const ToDoModel = require('../models/ToDoModel');

module.exports.getToDo = async (req, res) => {
    try {
        const toDo = await ToDoModel.find();
        res.status(200).json(toDo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.saveToDo = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim() === "") {
            return res.status(400).json({ error: "Field 'text' is required" });
        }
        const newTodo = await ToDoModel.create({ text });
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.updateToDo = async (req, res) => {
    try {
        const { id } = req.params;
        const { text , complete  } = req.body;
        const updateFields = {}; 
        if (text !== undefined) updateFields.text = text ; 
        if(complete !== undefined) updateFields.complete = complete; 
        const updated = await ToDoModel.findByIdAndUpdate(
            id,
            updateFields,
            {new : true} 
        ); 
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.deleteToDo = async (req, res) => {
    try {
        const { id } = req.params;
        await ToDoModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
