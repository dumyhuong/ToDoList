const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
    text: {
        type: String, required :true 
    },
    complete: { type:Boolean,default : false},
    createdAt: {type: Date, default : Date.now
    }
});

const ToDoModel = mongoose.model('ToDo', todoSchema);
module.exports = ToDoModel;

