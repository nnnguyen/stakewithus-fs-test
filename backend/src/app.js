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

var createValidatorToFile = (inputValidator, callback) => {
    fs.readFile('../data/validators.json', 'utf8', (err, data) => {

        if (err) {
            console.error(err);
            throw err;
        }
        var json = JSON.parse(data);
        var validators = json;

        if(validators) {
            var existValidator = validators.find(v => {
                return v.address === inputValidator.validatorAddress || v.pub_key.value === inputValidator.publicKey;
            });

            if(!existValidator) {
                var validator = {
                    address: inputValidator.validatorAddress,
                    pub_key: {
                        type: 'tendermint/PubKeyEd25519',
                        value: inputValidator.publicKey
                    },
                    voting_power: inputValidator.votingPower,
                    proposer_priority: inputValidator.validatorIndex
                };

                validators.push(validator);
                fs.writeFile('../data/validators.json', JSON.stringify(validators, null, 4), function(err) {
                    if (err) {
                        console.error(err);
                        throw err;
                    }
                });
            }
        }
        if(callback) {
            callback(validators);
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
                            return parseInt(p.validator_id) === parseInt(v.id);
                        });

                        if(pubKey) {
                            v.pub_key.type = pubKey.type;
                            v.pub_key.value = pubKey.value;
                        }
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

var insertValidatorIntoDB = (validator, callback) => {
    pool.query('INSERT INTO validator (address, voting_power, proposer_priority) VALUES ($1, $2, $3) RETURNING id',
        [validator.validatorAddress, validator.votingPower, validator.validatorIndex], (error, result) => {

        if (error) {
            throw error;
        }
        if(callback) {
            callback(result.rows[0].id);
        }
    });

}

var insertPublicKeyIntoDB = (publicKey, callback) => {
    pool.query('INSERT INTO pub_key (type, value, validator_id) VALUES ($1, $2, $3) RETURNING id',
        [publicKey.type, publicKey.value, publicKey.validatorId], (error, result) => {

            if (error) {
                throw error;
            }
            if(callback) {
                callback(result.rows[0].id);
            }
        });
}

/******************************** APIs ********************************/
app.get('/api/v1/hello', (req, res) => {
    res.send({ express: "Hello From Express" });
});

app.get('/api/v1/validators', (req, res) => {
    res.type('application/json');

    // var getValidatorListFromFile((results) => {
    //     res.json(results);
    // });

    getValidatorListFromDB((results) => {
        res.json(results);
    });
});

app.get('/api/v1/validator/:address', (req, res) => {
    res.type('application/json');

    // var getValidatorDetailFromFile(req.params.address, (results) => {
    //     res.json(results);
    // });
    getValidatorDetailFromDB(req.params.address, (results) => {
        res.json(results);
    });
});

app.post('/api/v1/validator/create', (req, res) => {
    res.type('application/json');

    // createValidatorToFile(req.body, (results) => {
    //     res.json(results);
    //
    // });

    insertValidatorIntoDB(req.body, function(rsValidator) {
        var pubKey = {
            type: 'tendermint/PubKeyEd25519',
            value: req.body.publicKey,
            validatorId: rsValidator
        };

        insertPublicKeyIntoDB(pubKey, function(rsPublicKey) {
            res.json(rsPublicKey.insertId);
        });
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
