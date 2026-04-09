const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Schema
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    course: String
});

// Model
const Student = mongoose.model("Student", studentSchema);

// CREATE
app.post("/students", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// READ
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// UPDATE
app.put("/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({ error: "Invalid student id" });
        }

        const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
        if (!student) {
            return res.status(404).send({ error: "Student not found" });
        }

        res.send(student);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// DELETE
app.delete("/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({ error: "Invalid student id" });
        }

        const deleted = await Student.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).send({ error: "Student not found" });
        }

        res.send("Student Deleted");
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
