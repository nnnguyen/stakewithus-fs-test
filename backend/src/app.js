const express = require("express");
const cors = require("cors");
const fs = require('fs');
const bodyParser = require('body-parser');

const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'stake-with-us',
    password: 'nnnguyen',
    port: 5432,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT || 5000;

/******************************** Do with json data file ********************************/
var getValidatorListFromFile = (callback) => {
    fs.readFile('../data/validators.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            throw err;
        }

        var json = JSON.parse(data);
        if(callback) {
            callback(json);
        }
    });
}

var getValidatorDetailFromFile = (validatorAddress, callback) => {
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
                return v.address === validatorAddress;
            });

            if(callback) {
                callback(validator);
            }
        }

    });
}

var createValidatorListToFile = (callback) => {
    fs.readFile('../data/validators.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            throw err;
        }

        var json = JSON.parse(data);
        if(callback) {
            callback(json);
        }
    });
}

/******************************** Do with Postgres DB ********************************/
var getValidatorListFromDB = (callback) => {
    pool.query('SELECT * FROM validator ORDER BY id ASC',
        (error, results) => {
            if (error) {
                throw error;
            }

            var validators = results.rows;
            let ids = validators.map(r => {
                return parseInt(r.id);
            });

            pool.query('SELECT * FROM pub_key WHERE validator_id = ANY($1)', [ids],
                (error, rs) => {
                    if (error) {
                        throw error;
                    }
                    var pubKeys = rs.rows;

                    validators.forEach(v => {
                        v.pub_key = {
                            type: null,
                            value: null
                        };

                        var pubKey = pubKeys.find(p => {
                            console.log(parseInt(p.validator_id) === parseInt(v.id));
                            return parseInt(p.validator_id) === parseInt(v.id);
                        });
                        console.log(pubKey);

                        if(pubKey) {
                            v.pub_key.type = pubKey.type;
                            v.pub_key.value = pubKey.value;
                        }
                        console.log(v);
                    });

                    if(callback) {
                        callback(validators);
                    }
                });
        })
}

var getValidatorDetailFromDB = (validatorAddress, callback) => {
    pool.query("SELECT * FROM validator WHERE address = $1", [validatorAddress],
        (error, results) => {
            if (error) {
                throw error;
            }

            if(results.rows && results.rows.length > 0) {
                var validator = results.rows[0];

                pool.query('SELECT * FROM pub_key WHERE validator_id = $1', [validator.id],
                    (error, rs) => {
                        if (error) {
                            throw error;
                        }
                        
                        var pubKeys = rs.rows;
                        validator.pub_key = {
                            type: null,
                            value: null
                        };

                        var pubKey = pubKeys.find(p => {
                            console.log(parseInt(p.validator_id) === parseInt(validator.id));
                            return parseInt(p.validator_id) === parseInt(validator.id);
                        });

                        if(pubKey) {
                            validator.pub_key.type = pubKey.type;
                            validator.pub_key.value = pubKey.value;
                        }

                        if(callback) {
                            callback(validator);
                        }
                    });
            } else {
                callback(null);
            }
        })
}


/******************************** APIs ********************************/
app.get('/api/v1/hello', (req, res) => {
    res.send({ express: "Hello From Express" });
});

app.get('/api/v1/validators', (req, res) => {
    res.type('application/json');

    getValidatorListFromDB((results) => {
        res.json(results);
    });
});

app.get('/api/v1/validator/:address', (req, res) => {
    res.type('application/json');

    getValidatorDetailFromDB(req.params.address, (results) => {
        res.json(results);
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
                fs.writeFile('../data/validators.json', JSON.stringify(validators, null, 4), function(err) {
                    if (err) {
                        console.error(err);
                        throw err;
                    }
                });
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
