const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let todos = []
let idCounter = 1;

app.get("/", (req, res) => {
    res.send("hi to start go to /todos or todo-api-test on repository, omar Belfeki")
})

app.get("/todos", (req, res) => {
    const {status} = req.query;
    let results = todos;

    if(status){
        results = results.filter(todos => todos.status === status);
    }
    res.json(results);
});

app.get("/todos/:id", (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if(!todo) return res.status(404).json({message: "Task not found"});
    res.json(todo)
});

app.post("/todos", (req, res) => {
    const {title} = req.body;
    if (!title) return res.status(400).json({message: "Title is required"});
    const newTodo = {
        id: idCounter ++,
        title,
        status: "pending"
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.put("/todos/:id", (req, res) => {
    const {title, status} = req.body;
    const todo = todos.find(t => t.id === parseInt(req.params.id));

    if(!todo) return res.status(404).json({message: "Task not found"});
    if(title) todo.title = title;
    if(status) {
        if(!["pending", "completed"].includes(status)) return res.status(400).json({message: "Status must be pending or completed"})
        todo.status = status
    }
    res.json(todo);
});

app.delete("/todos/:id", (req, res) => {
    const index = todos.findIndex(t => t.id === parseInt(req.params.id))
    if(index === -1) return res.status(404).json({message: "Task not found"})
    const deleted = todos.splice(index, 1);
    res.json({message: "task deleted", task: deleted[0]})
})

app.listen(PORT, () => {
    console.log(`ToDo api running on localhost:${PORT}`)
})
