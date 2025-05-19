// server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// azure database
const db = mysql.createConnection({
  host: 'roa-mysql-server.mysql.database.azure.com',
  user: 'adminuser',
  password: 'ROAApp123.',
  database: 'roa_app',
  ssl: { rejectUnauthorized: true }
});

db.connect(err => {
  if (err) {
    console.error('database connection failed:', err);
    process.exit(1);
  }
  console.log('connected to Azure MySQL database');
});

// homeroute
app.get('/', (req, res) => {
  res.send('backend running and connected to Azure');
});

//  authentication (register and login) 

// register a new user
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error('error during registration:', err);
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).send('email already registered');
      return res.status(500).send('registration failed. please try again.');
    }
    console.log('new user registered:', email);
    res.json({ id: result.insertId, name });
  });
});

// handle user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('error during login:', err);
      return res.status(500).send('login error');
    }
    if (results.length > 0) {
      console.log('user logged in:', email);
      res.json({ id: results[0].id, name: results[0].name });
    } else {
      res.status(401).send('invalid credentials');
    }
  });
});

// create a user profile
app.post('/profile', (req, res) => {
  const { userId, title, description, university, degree, graduation_year } = req.body;
  const sql = 'INSERT INTO profile (user_id, title, description, university, degree, graduation_year) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(sql, [userId, title, description, university, degree, graduation_year], err => {
    if (err) {
      console.error('error creating profile:', err);
      return res.status(500).send('failed to create profile');
    }
    res.send('profile created successfully');
  });
});

// fetch a users profile
app.get('/profile/:userId', (req, res) => {
  db.query('SELECT * FROM profile WHERE user_id = ?', [req.params.userId], (err, results) => {
    if (err) {
      console.error('error fetching profile:', err);
      return res.status(500).send('failed to fetch profile');
    }
    res.json(results[0] || {});
  });
});

// chievements management

// add an achievement
app.post('/achievements/add', (req, res) => {
  const { userId, title, description, date } = req.body;
  const sql = 'INSERT INTO achievements (user_id, title, description, date) VALUES (?, ?, ?, ?)';

  db.query(sql, [userId, title, description, date], err => {
    if (err) {
      console.error('error adding achievement:', err);
      return res.status(500).send('failed to add achievement');
    }
    res.send('achievement added successfully');
  });
});

// achievements for a user
app.get('/achievements/:userId', (req, res) => {
  db.query('SELECT * FROM achievements WHERE user_id = ?', [req.params.userId], (err, results) => {
    if (err) {
      console.error('error fetching achievements:', err);
      return res.status(500).send('failed to fetch achievements');
    }
    res.json(results);
  });
});

// delete an achievement
app.delete('/achievements/:id', (req, res) => {
  db.query('DELETE FROM achievements WHERE id = ?', [req.params.id], err => {
    if (err) {
      console.error('error deleting achievement:', err);
      return res.status(500).send('failed to delete achievement');
    }
    res.send('achievement deleted successfully');
  });
});

// add a skill
app.post('/skills/add', (req, res) => {
  const { userId, skill_name } = req.body;
  db.query('INSERT INTO skills (user_id, skill_name) VALUES (?, ?)', [userId, skill_name], err => {
    if (err) {
      console.error('error adding skill:', err);
      return res.status(500).send('failed to add skill');
    }
    res.send('skill added successfully');
  });
});

// skills for user
app.get('/skills/:userId', (req, res) => {
  db.query('SELECT * FROM skills WHERE user_id = ?', [req.params.userId], (err, results) => {
    if (err) {
      console.error('error fetching skills:', err);
      return res.status(500).send('failed to fetch skills');
    }
    res.json(results);
  });
});

// delete a skill
app.delete('/skills/:id', (req, res) => {
  db.query('DELETE FROM skills WHERE id = ?', [req.params.id], err => {
    if (err) {
      console.error('error deleting skill:', err);
      return res.status(500).send('failed to delete skill');
    }
    res.send('skill deleted successfully');
  });
});

// add soft skill
app.post('/soft-skills/add', (req, res) => {
  const { userId, soft_skill_name } = req.body;
  db.query('INSERT INTO soft_skills (user_id, soft_skill_name) VALUES (?, ?)', [userId, soft_skill_name], (err, result) => {
    if (err) {
      console.error('error adding soft skill:', err); 
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'soft skill added successfully', id: result.insertId });
  });
});

// soft skills for user
app.get('/soft-skills/:userId', (req, res) => {
  db.query('SELECT * FROM soft_skills WHERE user_id = ?', [req.params.userId], (err, results) => {
    if (err) {
      console.error('error fetching soft skills:', err);
      return res.status(500).send('failed to fetch soft skills');
    }
    res.json(results);
  });
});

// delete soft skill
app.delete('/soft-skills/:id', (req, res) => {
  db.query('DELETE FROM soft_skills WHERE id = ?', [req.params.id], err => {
    if (err) {
      console.error('error deleting soft skill:', err);
      return res.status(500).send('failed to delete soft skill');
    }
    res.send('soft skill deleted successfully');
  });
});

// add/update contact information
app.put('/contacts/:userId', (req, res) => {
  const { userId } = req.params;
  const { email, phone } = req.body;

  const sql = `
    INSERT INTO contacts (user_id, email, phone)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      email = VALUES(email),
      phone = VALUES(phone)
  `;

  db.query(sql, [userId, email, phone], err => {
    if (err) {
      console.error('error saving contact information:', err);
      return res.status(500).json({ error: 'failed to save contact information' });
    }
    res.json({ userId, email, phone });
  });
});

// fetch users contact info
app.get('/contacts/:userId', (req, res) => {
  db.query('SELECT * FROM contacts WHERE user_id = ?', [req.params.userId], (err, results) => {
    if (err) {
      console.error('error fetching contact information:', err);
      return res.status(500).send('failed to fetch contact information');
    }
    res.json(results[0] || { email: '', phone: '' });
  });
});

// upload cv
app.post('/cv/upload', (req, res) => {
  const { userId, filePath, uploadDate } = req.body;
  db.query('INSERT INTO cv_uploads (user_id, file_path, upload_date) VALUES (?, ?, ?)', [userId, filePath, uploadDate], err => {
    if (err) {
      console.error('error uploading cv:', err);
      return res.status(500).send('failed to upload cv');
    }
    res.send('cv uploaded successfully');
  });
});

// fetch users cv
app.get('/cv/:userId', (req, res) => {
  db.query('SELECT * FROM cv_uploads WHERE user_id = ?', [req.params.userId], (err, results) => {
    if (err) {
      console.error('error fetching cv:', err);
      return res.status(500).send('failed to fetch cv');
    }
    res.json(results[0] || {});
  });
});

// start server
app.listen(5001, () => {
  console.log('server running at http://localhost:5001');
});
