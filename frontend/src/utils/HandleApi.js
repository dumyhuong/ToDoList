import axios from 'axios';

const baseUrl = "https://6fba38de9272.ngrok-free.app/api"; 

const getAllToDo = (setToDo) => {
    axios.get(`${baseUrl}/todos`)
        .then(({ data }) => {
            console.log('data --->', data);
            setToDo(data);
        })
        .catch(err => console.log(err));
};

const addToDo = (text, setText, setToDo) => {
    axios.post(`${baseUrl}/todos`, { text })
        .then(() => {
            setText("");
            getAllToDo(setToDo);
        })
        .catch(err => console.log(err));
};

const updateToDo = (id, text, setToDo, setText, setIsUpdating) => {
    axios.put(`${baseUrl}/todos/${id}`, { text })
        .then(() => {
            setText("");
            setIsUpdating(false);
            getAllToDo(setToDo);
        })
        .catch(err => console.log(err));
};

const updateComplete = (id, complete, setToDo) => {
    axios.put(`${baseUrl}/todos/${id}`, { complete })
        .then(() => getAllToDo(setToDo))
        .catch(err => console.log(err));
};

const deleteToDo = (id, setToDo) => {
    axios.delete(`${baseUrl}/todos/${id}`)
        .then(() => getAllToDo(setToDo))
        .catch(err => console.log(err));
};

const toggleComplete = (id, currentComplete, setToDo) => {
    axios.put(`${baseUrl}/todos/${id}`, { complete: !currentComplete })
        .then(() => getAllToDo(setToDo))
        .catch(err => console.log(err));
};

export { getAllToDo, addToDo, updateToDo, updateComplete, deleteToDo, toggleComplete };
