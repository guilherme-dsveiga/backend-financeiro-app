// Create express app
const express = require("express")
const app = express()
const db = require("./database.js")
const md5 = require("md5")
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

// Server port
// Start server
app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

// ADMIN CRUD
//GET ALL ADMINS
app.get("/api/admins", (req, res, next) => {
    const sql = "select * from admins"
    const data = db.prepare(sql).all();
    res.status(200).json(data)
});

//GET ADMIN BY ID
app.get("/api/admin/:id", (req, res, next) => {
    const sql = "select * from admins where id = ?"
    const params = [req.params.id]
    const data = db.prepare(sql).get(params);
    res.status(200).json(data)
});

//CREATE NEW ADMIN
app.post("/api/admin/", (req, res, next) => {
    let errors = []
    if (!req.body.password) {
        errors.push("No password specified");
    }
    if (!req.body.email) {
        errors.push("No email specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password)
    }
    const sql = 'INSERT INTO admins (name, email, password) VALUES (?,?,?)'
    const params = [data.name, data.email, data.password]
    const response = db.prepare(sql).run(params)
    res.status(200).json(data)
})


//UPDATE EXISTING ADMIN BY ID
app.patch("/api/admin/:id", (req, res, next) => {
    const params = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? md5(req.body.password) : null
    }
    const sql = `UPDATE admins set 
    name = COALESCE(?,name), 
    email = COALESCE(?,email), 
    password = COALESCE(?,password) 
    WHERE id = ?`;

    const data = db.prepare(sql).run(params)
    res.status(200).json(data);
})

/*==================================================================================================================*/
//DEBITS (SAIDAS)
//GET ALL DEBITS
app.get("/api/debits", (req, res, next) => {
    const sql = "select * from debits"
    const params = []
    const data = db.prepare(sql).all()
    res.status(200).json(data)
});

//GET DEBIT BY ID
app.get("/api/debit/:id", (req, res, next) => {
    const sql = "select * from debits where id = ?"
    const params = [req.params.id]
    const data = db.prepare(sql).get(params)
    res.status(200).json(data);
});

//CREATE NEW DEBIT
app.post("/api/debits/", (req, res, next) => {
    let errors = []
    if (!req.body.name) {
        errors.push("No name specified");
    }
    if (!req.body.valuesURI) {
        errors.push("No value specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    const data = {
        name: req.body.name,
        info: req.body.info,
        valuesURI: encodeURI(JSON.stringify(req.body.valuesURI)),
    }
    const sql = 'INSERT INTO debits (name, info, valuesURI) VALUES (?,?,?)'
    const params = [data.name, data.info, data.valuesURI]
    const response = db.prepare(sql).run(params)
    res.status(200).json(data)
})

//UPDATE EXISTING DEBIT BY ID
app.patch("/api/debits/:id", (req, res, next) => {
    const params = {
        name: req.body.name,
        info: req.body.info,
        valuesURI: encodeURI(JSON.stringify(req.body.valuesURI)),
    }
    const sql = `UPDATE debits set 
    name = COALESCE(?,name), 
    info = COALESCE(?,info), 
    valuesURI = COALESCE(?,valuesURI) 
    WHERE id = ?`

    const data = db.prepare(sql).run(params);
    res.status(200).json(data)     
})

//ENTRADAS (CREDITS)

// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});

