const Database = require('better-sqlite3')
const md5 = require('md5')

const db = new Database('finances.db', { verbose: console.log })

const admins = db.prepare(`CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text,
    email text UNIQUE,
    password text,
    CONSTRAINT email_unique UNIQUE (email)
    )`).run()

const debits = db.prepare(`CREATE TABLE debits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text,
    info text,
    valuesURI text
    )`).run()

module.exports = db

/*          `CREATE TABLE admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            password text,
            CONSTRAINT email_unique UNIQUE (email)
            )`



            let insert = 'INSERT INTO admins (name, email, password) VALUES (?,?,?)'
            db.run(insert, ["Guilherme", "guilherme.dsveiga@gmail.com", md5("Gmme25223114")])

            let insert = 'INSERT INTO debits (name, info, valuesURI) VALUES (?,?,?)'
            db.run(insert, ["Pedro", "Pagamentos da viagem e de saidas", values])








            */