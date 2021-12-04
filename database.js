const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const DBSOURCE = "db.sqlite"

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
            (err) => {
                if (err) {
                    console.log("Table already created 1");
                } else {
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO admins (name, email, password) VALUES (?,?,?)'
                    db.run(insert, ["Guilherme", "guilherme.dsveiga@gmail.com", md5("Gmme25223114")])
                }
            });
        db.run(`CREATE TABLE debits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            info text, 
            valuesURI text 
            )`,
            (err) => {
                if (err) {
                    console.log(err);
                } else {
                    // Table just created, creating some rows
                    let values = encodeURI(JSON.stringify({
                        viagem: "200",
                        cerveja: "50"
                    }))
                    let insert = 'INSERT INTO debits (name, info, valuesURI) VALUES (?,?,?)'
                    db.run(insert, ["Pedro", "Pagamentos da viagem e de saidas", values])
                }
            });
    }
});


module.exports = db
