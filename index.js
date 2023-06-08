const inquirer = require('inquirer');
const {table} = require('table');
const mysql = require('mysql2/promise');
const figlet = require('figlet');

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
    init();
});

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
    console.log(tableData);
    const answers = await inquirer.prompt([
      {
        message: "\n" + table(tableData, config),
        type: 'input',
        name: 'name'
      }
    ]);
  }

  const menu = async function () {
    const choices = await inquirer.prompt([
        {
            message: "What do you want to do?",
            type: "list",
            name: "options",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                // "Update employee managers",
                // "View employees by manager",
                // "Delete departments, roles, and employees",
                // "View the total utilized budget of a department",
            ]
        }
    ])
    if(choices.options === "View all departments") {
        await viewDepartments();
        await menu();
    } else if(choices.options === "View all roles") {
        await viewRoles();
        await menu();
    } else if(choices.options === "View all employees") {
        await viewEmployees();
        await menu();
    } else if(choices.options === "Add a department") {
      await addDepartment();
      await menu();
    }
  };

  const viewDepartments = async function () {
    const results = await db.query("SELECT * FROM department");
    const dbData = results[0];
    showTable(dbData);
  };

  const viewRoles = async function () {
    const results = await db.query("SELECT * FROM role");
    const dbData = results[0];
    showTable(dbData);
  };

  const viewEmployees = async function () {
    const results = await db.query("SELECT * FROM employee");
    const dbData = results[0];
    showTable(dbData);
  };

  const addDepartment = async function () {
    const results = await db.query("SELECT * FROM department");
    const dbData = results[0];
    const departmentData = await inquirer.prompt([
      {
        message: "What department would you like to add?",
        type: "input",
        name: "name"
      }
    ]);
    console.log(departmentData.new_department);
    const departmentName = departmentData.new_department;
    await showTable([departmentData]);
    await db.query("INSERT INTO department SET ?", departmentData);
  };
  
  const init = async function () {
    figlet("Employee Tracker", async function (err, data) {
        if (err){
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        await inquirer.prompt([
          {
            message: "\n" + data + "\nPress Enter to Continue.",
            type: "input",
            name: "name"
          }
        ]);
        // console.log(data);
        await menu();
    });
  };