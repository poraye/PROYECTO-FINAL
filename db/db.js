const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "messi_store"
});

db.connect(err => {
  if (err) {
    console.error("Error BD:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

module.exports = db;
