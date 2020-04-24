const express = require('express')
const cors = require('cors')
const pool = require("./db")
const app = express()

app.use(cors())
app.use(express.json())

//ROUTES

// create a doto
app.post("/todos", async(req, res) => {
    try {
        const { description } = req.body
        const newTodo = await pool.query(
            "INSERT INTO todo(description) VALUES($1) RETURNING *", [description])
        res.json(newTodo.rows[0])

    } catch (error) {
        console.error(error.message)
    }
})

//get all todo

app.get("/todos", async(req, res) => {
    try {

        const allTodos = await pool.query("SELECT * FROM todo")
        res.json(allTodos.rows)

    } catch (error) {
        console.error(error.message)

    }
})

//get a doto

app.get("/todos/:id", async(req, res) => {
    const { id } = req.params
    try {
        const singleTodo = await pool.query("SELECT * FROM todo WHERE todo_id=($1)", [id])
        res.json(singleTodo.rows[0])

    } catch (error) {
        console.error(error.message)

    }
})

//update a doto
app.put("/todos/:id", async(req, res) => {
    const { id } = req.params
    const { description } = req.body
    const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id])
    res.json("Todo was updated.")

})

// delete a doto  
app.delete("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id=$1", [id])
        res.json("The todo has been deleted.")

    } catch (err) {
        console.error(err.message)
    }

})




// Starting the server.
app.listen(5000, () => {
    console.log("Server has started on port 5000.")
})