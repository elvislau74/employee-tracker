const inquirer = require('inquirer');
const {table} = require('table');
const mysql = require('mysql2/promise');

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

const config = {
    border: {
      topBody: `─`,
      topJoin: `┬`,
      topLeft: `┌`,
      topRight: `┐`,
  
      bottomBody: `─`,
      bottomJoin: `┴`,
      bottomLeft: `└`,
      bottomRight: `┘`,
  
      bodyLeft: `│`,
      bodyRight: `│`,
      bodyJoin: `│`,
  
      joinBody: `─`,
      joinLeft: `├`,
      joinRight: `┤`,
      joinJoin: `┼`
    }
  };

  async function showTable (data){
    let tableData = [];
    // option 1 fancy one line table data format
    tableData = [Object.keys(data[0]), ...data.map(val => Object.values(val))];
  
    const answers = await inquirer.prompt([
      {
        message: "\n" + table(tableData, config),
        type: 'input',
        name: 'name'
      }
    ]);
  }