const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'litRPG'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

app.post('/api/saveProfile', (req, res) => {
    const { username, character, model, level, exp, skills, alignment, companion } = req.body;
    const sql = `INSERT INTO users (username, character, model, level, exp, skills, alignment, companion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE character = ?, model = ?, level = ?, exp = ?, skills = ?, alignment = ?, companion = ?`;
    const values = [username, character, model, level, exp, JSON.stringify(skills), alignment, companion, character, model, level, exp, JSON.stringify(skills), alignment, companion];
    db.query(sql, values, (err, result) => {
        if (err) throw err;
        res.send({ message: 'Profile saved successfully' });
    });
});

app.get('/api/getProfile/:username', (req, res) => {
    const { username } = req.params;
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.query(sql, [username], (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
