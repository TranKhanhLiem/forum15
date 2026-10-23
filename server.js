const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_NAME || 'forum_db'
});

app.get('/health', (req, res) => {
    pool.query('SELECT 1', (err) => {
        if (err) return res.status(500).json({ status: 'error', error: err.message });
        res.json({ status: 'ok', service: 'forum' });
    });
});

app.get('/api/posts', (req, res) => {
    pool.query('SELECT * FROM posts ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/posts', (req, res) => {
    const { title, body, author_name } = req.body;
    if (!title || !body || !author_name) return res.status(400).json({ error: 'Missing fields' });
    pool.query('INSERT INTO posts (title, body, author_name) VALUES (?, ?, ?)', [title, body, author_name], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.listen(3000, () => console.log('Forum app running on port 3000'));
