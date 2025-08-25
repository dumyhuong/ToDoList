import axios from 'axios';

const baseUrl = "http://localhost:5000";

const getAllToDo = (setToDo) => {
    axios
        .get(`${baseUrl}/todos`)
        .then(({ data }) => {
            console.log('data --->', data);
            setToDo(data);
        })
        .catch(err => console.log(err));
};
const addToDo = (text, setText, setToDo) => {
    axios
        .post(`${baseUrl}/todos`, { text })
        .then(() => {
            setText("");
            getAllToDo(setToDo);
        })
        .catch(err => console.log(err));
};
const updateToDo = (id, text, setToDo, setText, setIsUpdating) => {
    axios
        .put(`${baseUrl}/todos/${id}`, { text })
        .then(() => {
            setText("");
            setIsUpdating(false);
            getAllToDo(setToDo);
        }) 
        .catch(err => console.log(err));
};
const updateComplete = (id,complete,setToDo) =>{
    axios
    .put(`${baseUrl}/todos/${id}`,{complete : true})
    .then(() => {
        getAllToDo(setToDo); 
    })
    .catch(err => console.log(err)); 
}
const deleteToDo = (id, setToDo) => {
    axios
        .delete(`${baseUrl}/todos/${id}`)
        .then(() => {
            getAllToDo(setToDo);
        })
        .catch(err => console.log(err));
};
const toggleComplete = (id,currentComplete,setToDo) => {
    axios
    .put(`${baseUrl}/todos/${id}`, {complete:!currentComplete})
    .then(({data}) => {
        setToDo((prev) =>
            prev.map((item) => 
                item._id === id ? {...item,complete:data.complete} :item
            )
        );
    }) 
    .catch(err => console.log(err)); 
}

export { getAllToDo, addToDo, updateToDo,updateComplete, deleteToDo, toggleComplete};
