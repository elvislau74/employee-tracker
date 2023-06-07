const inquirer = require('inquirer');
const {table} = require('table');
const mysql = require('mysql/promise');

let db;
mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'yoshiharu',
        database: 'human_resources_db'
    }
)
.then((connection) => {
    db = connection;
    console.log('Connected to the human_resources_db database.');
})
