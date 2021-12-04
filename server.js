// Create express app
const express = require("express")
const app = express()
const db = require("./database.js")
const md5 = require("md5")
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
const HTTP_PORT = 8000
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

// ADMIN CRUD
//GET ALL ADMINS
app.get("/api/admins", (req, res, next) => {
    let sql = "select * from admins"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

//GET ADMIN BY ID
app.get("/api/admin/:id", (req, res, next) => {
    var sql = "select * from admins where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});

//CREATE NEW ADMIN
app.post("/api/admin/", (req, res, next) => {
    var errors = []
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
    var data = {
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password)
    }
    var sql = 'INSERT INTO admins (name, email, password) VALUES (?,?,?)'
    var params = [data.name, data.email, data.password]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
})


//UPDATE EXISTING ADMIN BY ID
app.patch("/api/admin/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE admins set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        });
})

/*==================================================================================================================*/
//DEBITS (SAIDAS)
//GET ALL DEBITS
app.get("/api/debits", (req, res, next) => {
    let sql = "select * from debits"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

//GET DEBIT BY ID
app.get("/api/debit/:id", (req, res, next) => {
    var sql = "select * from debits where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});

//CREATE NEW DEBIT
app.post("/api/debits/", (req, res, next) => {
    var errors = []
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
    var data = {
        name: req.body.name,
        info: req.body.info,
        valuesURI: encodeURI(JSON.stringify(req.body.valuesURI)),
    }
    var sql = 'INSERT INTO debits (name, info, valuesURI) VALUES (?,?,?)'
    var params = [data.name, data.info, data.valuesURI]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
})

//UPDATE EXISTING DEBIT BY ID
app.patch("/api/debits/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        info: req.body.info,
        valuesURI: encodeURI(JSON.stringify(req.body.valuesURI)),
    }
    db.run(
        `UPDATE debits set 
           name = COALESCE(?,name), 
           info = COALESCE(?,info), 
           valuesURI = COALESCE(?,valuesURI) 
           WHERE id = ?`,
        [data.name, data.info, data.valuesURI, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        });
})

//ENTRADAS (CREDITS)

// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});

