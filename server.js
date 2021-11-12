const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const fs = require('fs');

const url = require('url');
const queryString = require('querystring');

var db = new sqlite3.Database('./db.sqlite');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('static'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(
        './static/index.html',
        { root: __dirname }
    );
})

app.get('/users', (req, res) => {
    let sql = 'SELECT * FROM USER'
    db.all(sql, [], (er, rows) => {
        if (er) res.send(JSON.stringify({ msg: er.message }))
        res.send(JSON.stringify(rows))
    })
})

app.post('/addUser', (req, res) => {
    let data = req.body
    let sql = 'INSERT INTO User ("name", "email", "phone") VALUES (?, ?, ?)'
    let resObj = {
        msg: `Add User: ${data[0]}, ${data[2]}`,
        success: false
    }

    db.run(sql, data, (er) => {
        if (er) {
            console.log(er)
            resObj.msg = er.msg
        } else {
            resObj.success = true
        }

        res.send(JSON.stringify(resObj))
    })

})

app.post('/delUser', (req, res) => {
    let data = req.body.id
    let resObj = {
        msg: `User ${data} is removed`,
        success: false
    }

        let sql = 'DELETE FROM User WHERE id = (?)'

        db.run(sql, [data], (er) => {
            if (data) {
                if (er) {
                    console.log(er)
                    resObj.msg = er.msg
                } else {
                    resObj.success = true
                }
            } else {
                resObj.msg = 'id is undefined'
            }

            res.send(JSON.stringify(resObj))

        })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
