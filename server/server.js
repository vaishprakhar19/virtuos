const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'student',
})

db.connect((err) => {
    if (err) {
        console.error(err.stack);
        return;
    }
    else console.log("connected to database");
});

app.post('/saveStudent', (req, res) => {
    const { studentName, collegeName, round1marks, round2marks, round3marks, technicalRoundMarks } = req.body;

    if (!studentName || studentName.length > 30) {
        return res.status(400).json({ error: 'Invalid Student Name (max 30 characters)' });
    }
    if (!collegeName || collegeName.length > 50) {
        return res.status(400).json({ error: 'Invalid College Name (max 50 characters)' });
    }
    if (round1marks < 0 || round1marks > 10) {
        return res.status(400).json({ error: 'Invalid Round 1 Marks (0-10)' });
    }
    if (round2marks < 0 || round2marks > 10) {
        return res.status(400).json({ error: 'Invalid Round 2 Marks (0-10)' });
    }
    if (round3marks < 0 || round3marks > 10) {
        return res.status(400).json({ error: 'Invalid Round 3 Marks (0-10)' });
    }
    if (technicalRoundMarks < 0 || technicalRoundMarks > 20) {
        return res.status(400).json({ error: 'Invalid Technical Round Marks (0-20)' });
    }

    const totalMarks = parseFloat(round1marks) + parseFloat(round2marks) + parseFloat(round3marks) + parseFloat(technicalRoundMarks);
    let result = totalMarks >= 35 ? 'Selected' : 'Rejected';
    if(round1marks<=6.5||round2marks<=6.5||round3marks<=6.5){
        result='Rejected'
    }
    else{
        result='Selected'
    }
    const sql = 'INSERT INTO STUDENTS (student_name,college_name,round1_marks,round2_marks,round3_marks,technical_round_marks,total_marks,result) VALUES(?,?,?,?,?,?,?,?)';
    db.query(sql, [studentName, collegeName, round1marks, round2marks, round3marks, technicalRoundMarks, totalMarks, result], (err, result) => {
        if (err) {
            console.error('Error saving student data: ' + err.stack);
            return res.status(500).json({ error: 'Failed to save data' });
        }
        res.json({ message: 'Student data saved successfully', id: result.insertId });
    });
});

app.get('/getStudents', (req, res) => {
    const sql = 'SELECT * FROM students ORDER BY total_marks DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching student records: ' + err.stack);
            return res.status(500).json({ error: 'Failed to fetch records' });
        }

        let rank = 1;
        if (results.length > 0) {
            results[0].student_rank = rank;
            for (let i = 1; i < results.length; i++) {
                if (results[i].total_marks === results[i - 1].total_marks) {
                    results[i].student_rank = rank;
                } else {
                    rank = i + 1; // Rank is based on index
                    results[i].student_rank = rank;
                }
            }
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log("Server is Working");
})