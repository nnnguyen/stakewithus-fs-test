const express = require("express");
const cors = require("cors");
const fs = require('fs');

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;


app.get('/api/v1/hello', (req, res) => {
    res.send({ express: "Hello From Express" });
});

app.get('/api/v1/validators', (req, res) => {
    fs.readFile('../data/validators.json', 'utf8', (err, data) =>{
        if (err) {
            throw err;
        }
        res.send(data);
    });
});

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;
