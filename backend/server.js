const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const path = require("path");
var mysql = require("mysql");

const cors = require('cors')
const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gyan@1234",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
  } else {
    console.log("Connected to MySQL database");
    createDatabaseAndTable()
  }
});


function createDatabaseAndTable() {
    db.query('CREATE DATABASE IF NOT EXISTS userdb', (err) => {
      if (err) {
        console.error('Error creating database: ', err);
      } else {
        console.log('Database created or already exists');
        useDatabase();
      }
    });
  }
  
  function useDatabase() {
    db.query('USE userdb', (err) => {
      if (err) {
        console.error('Error using database: ', err);
      } else {
        console.log('Using users');
        createContactsTable();
      }
    });
  }
  
  function createContactsTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        address VARCHAR(255),
        phone VARCHAR(15),
        email VARCHAR(255)
      )
    `;
  
    db.query(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating contacts table: ', err);
      } else {
        console.log('Contacts table created or already exists');
      }
    });
  }


const serviceAccount = require("./newusers-bf951-firebase-adminsdk-9p3z6-46dd5fa3a5.json"); // Replace with your own service account key path
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://newUsers.firebaseio.com', // Replace with your Firebase project URL
  });

  const firestore = admin.firestore();
  const docRef = firestore.collection('users').doc(Date.now().toString());

  
// Routes






app.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching data from MySQL: ", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Results from MySQL:", results); // Add this line
      res.send(results)
    }
  });
});

app.post("/submit",async (req, res) => {
  console.log(req.body);
  const { name, address, phone, email } = req.body;

  // Insert data into MySQL
  db.query(
    "INSERT INTO users (name, address, phone, email) VALUES (?, ?, ?, ?)",
    [name, address, phone, email],
    (err) => {
      if (err) {
        console.error("Error inserting data into MySQL: ", err);
        res.status(500).send("Internal Server Error");
      } else {
        docRef.set({
            name,
            address,
            phone,
            email
          });
        res.redirect("/");
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
