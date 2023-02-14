// Every time we change the file and save, the server will restart automatically (upon initially running 'npm start')
const express = require('express');
const app = express();
// Connecting to our database
const dotenv = require("dotenv");
// Connecting to mongoose
const mongoose = require("mongoose");

// Connecting TodoTask.js
const TodoTask = require("./models/TodoTask");

// CONCEPT #1: Configurations
dotenv.config();

// Code to enable access to the 'style.css' file
app.use("/static", express.static("public"));

// Necessary to extract data from the form submitted by users of the webpage
app.use(express.urlencoded({ extended: true }));

// Second part of connection to db
// mongoose.set("useFindAndModify", false);

// CONCEPT #3: External Database Management or Clustering
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    
    // The actual part of the code that allows for automatic changes to the rendered information on the webpage
    app.listen(3000, () => console.log("Server Up and running"));
});

// Code for the 'view engine configuration'
app.set("view engine", "ejs");

// Code to render information on the webpage
// CONCEPT #3: Views
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
});

app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
});

// Updating
app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
    })
    .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
});

// Deleting
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
});


    