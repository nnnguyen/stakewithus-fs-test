const express = require("express");
const cors = require("cors");
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT || 5000;


app.get('/api/v1/hello', (req, res) => {
    res.send({ express: "Hello From Express" });
});

app.get('/api/v1/validators', (req, res) => {
    fs.readFile('../data/validators.json', 'utf8', (err, data) =>{
        res.type('application/json');

        if (err) {
            console.error(err);
            throw err;
        }

        var json = JSON.parse(data);
        res.send(json);
    });
});

app.get('/api/v1/validator/:address', (req, res) => {
    fs.readFile('../data/validators.json', 'utf8', (err, data) =>{
        res.type('application/json');

        if (err) {
            console.error(err);
            throw err;
        }
        var json = JSON.parse(data);
        if(json) {
            var validators = json;
            var validator = validators.find(v => {
                return v.address === req.params.address;
            });

            res.send(validator);
        } else {
            res.send(null);
        }

    });
});

app.post('/api/v1/validator/create', (req, res) => {
    fs.readFile('../data/validators.json', 'utf8', (err, data) => {
        res.type('application/json');

        if (err) {
            console.error(err);
            throw err;
        }
        var json = JSON.parse(data);
        if(json) {
            var validators = json;
            var existValidator = validators.find(v => {
                return v.address === req.params.address || v.pub_key.value === req.body.publicKey;
            });

            if(!existValidator) {
                var validator = {
                    address: req.body.validatorAddress,
                    pub_key: {
                        type: 'tendermint/PubKeyEd25519',
                        value: req.body.publicKey
                    },
                    voting_power: req.body.votingPower,
                    proposer_priority: req.body.validatorIndex
                };

                validators.push(validator);
                res.send(validators);
            }
        } else {
            res.send(null);
        }
    });
});

app.patch('/api/v1/validator/edit/:address', (req, res) => {
    fs.readFile('../data/validators.json', 'utf8', (err, data) => {
        res.type('application/json');

        if (err) {
            console.error(err);
            throw err;
        }
        var json = JSON.parse(data);
        if(json) {
            var validators = json;

            for(var i = 0; i < validators.length; i++) {
                var validator = validators[i];

                if(validator.address === req.params.address && req.body) {
                    validator.voting_power = req.body.votingPower;
                    validator.proposer_priority = req.body.validatorIndex;

                    validators.splice(i, 1);
                    validators.push(validator);

                    fs.writeFile('../data/validators.json', JSON.stringify(validators, null, 4), function(err) {
                        if (err) {
                            console.error(err);
                            throw err;
                        }
                    });

                    break;
                }
            }

            res.send(validators);
        } else {
            res.send(null);
        }
    });
});

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;
