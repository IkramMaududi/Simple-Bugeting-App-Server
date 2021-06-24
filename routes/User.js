const express = require('express');
const pool = require('../db/connection')

const router = express.Router();

router
    .route('/')
    .get( (req,res) => {
        res.send('hello API is working Yo!!');
    });

router
    .route('/addition')
    .post( async (req,res) => {
        try {
            const { actionType, inputDate, inputDetail, inputAmount, inputUsername } = req.body;
            const client = await pool.connect();
            // console.log(username);

            // Check whether that specific username exist, if it doesn't exist make a new one, else leave it be 
            const userExist = await client.query(
                "SELECT * FROM users WHERE username = $1;",
                [inputUsername]
            );
            if ( !userExist.rowCount ) {
                const enterNewUser = await client.query(
                    "INSERT INTO users (username) VALUES $1;",
                    [inputUsername]
                );
            };

            if (actionType === 'income') {
                const newInsert = await client.query(
                    "INSERT INTO income (username, submitted_date, item_name, amount) VALUES ($1, $2, $3, $4;",
                    [inputUsername, inputDate, inputDetail, inputAmount]
                );
                res.json({
                    working: true,
                    message: 'an income added'
                });
            } else if (actionType === 'expense') {
                const newInsert = await client.query(
                    "INSERT INTO expense (username, submitted_date, item_name, amount) VALUES ($1, $2, $3, $4;",
                    [inputUsername, inputDate, inputDetail, inputAmount]
                );
                res.json({
                    working: true,
                    message: 'an expense added'
                });
            };
            client.release();
        } catch (err) {
            res.status(400).send({error: err.message}); 
        };
    });

router
    .route('/showall')
    .get( async (req,res) => {
        try {
            const {inputUsername} = req.body;
            const client = await pool.connect();

            const userIncome = await client.query(
                "SELECT * FROM income WHERE username = $1 ORDER BY submitted_date;", 
                [inputUsername]
            );
            const userExpense = await client.query(
                "SELECT * FROM expense WHERE username = $1 ORDER BY submitted_date;", 
                [inputUsername]
            );

            // send back the data to front end through json here and sort it
            // if the userIncome or userExpense exist, send them, else just give null value
            let income = null, 
                expense = null;
            if (userIncome) {
                income = userIncome.rows;
            };
            if (userExpense) {
                expense = userExpense.rows
            };
            
            res.send({
                dataIncome = income,
                dataExpense: expense
            });


            client.release();
        } catch (err) {
            res.status(400).send({ error: err.message}); 
        };
    });
