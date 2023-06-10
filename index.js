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
    } else if(choices.options === "Add a role") {
      await addRole();
      await menu();
    } else if(choices.options === "Add an employee") {
      await addEmployee();
      await menu();
    } else if(choices.options === "Update an employee role") {
      await updateRole();
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
    await showTable([departmentData]);
    await db.query("INSERT INTO department SET ?", departmentData);
    console.log(`Successfully added the department ${departmentData.name}.`)
  };
  
  const addRole = async function () {
    const results = await db.query("SELECT * FROM department");
    const dbData = results[0];
   
    const departmentChosen = await inquirer.prompt([
      {
        message: "Which department is this role under?",
        type: "list",
        choices: dbData,
        name: "department"
      }
    ]);
    const roleData = await inquirer.prompt([
      {
        message: "What role would you like to add?",
        type: "input",
        name: "title"
      },
      {
        message: "What is the salary of this role?",
        type: "input",
        name: "salary"
      },
    ]);
    
    for(let department of dbData){
      if(departmentChosen.department === department.name){
        roleData.department_id = department.id;
      }
    }
    await showTable([roleData]);
    await db.query("INSERT INTO role SET ?", roleData);
  };

  const addEmployee = async function () {
    const roleResults = await db.query("SELECT * FROM role");
    const employeeResults = await db.query("SELECT * FROM employee")
    const dbData = roleResults[0];
    const dbData2 = employeeResults[0];
    const roleArray = [];
    
    for(let role of dbData){
      roleArray.push(role.title);
    };
    
    const roleAssigned = await inquirer.prompt([
      {
        message: "What role will this new employee be assigned to?",
        type: "list",
        choices: roleArray,
        name: "role"
      }
    ]);

    const employeeData = await inquirer.prompt([
      {
        message: "What is their first name?",
        type: "input",
        name: "first_name"
      },
      {
        message: "What is their last name?",
        type: "input",
        name: "last_name"
      },
    ]);

    const choiceData = dbData2.map( (row) => ({
      name: row.first_name + " " + row.last_name,
      value: row
    }))

    choiceData.push({
      name: "No manager",
      value: {id: null}
    });

    const managerAssigned = await inquirer.prompt([
      {
        message: "Who will be assigned as their manager?",
        type: "list",
        choices: choiceData,
        name: "manager"
      }
    ])
    
    for(let role of dbData) {
      if(roleAssigned.role === role.title){
        employeeData.role_id = role.id;
      }
    }

    employeeData.manager_id = managerAssigned.manager.id;
    await showTable([employeeData]);
    await db.query("INSERT INTO employee SET ?", employeeData);
  };

  const updateRole = async function () {
    const employeeResults = await db.query("SELECT * FROM employee");
    const roleResults = await db.query("SELECT * FROM role");
    const dbData = employeeResults[0];
    const dbData2 = roleResults[0];
   
    const choiceData = dbData.map( (row) => ({
      name: row.first_name + " " + row.last_name,
      value: row
    }));

    const employeeToChange = await inquirer.prompt([
      {
        message: "Which employee would to like to update the role of?",
        type: "list",
        choices: choiceData,
        name: "name"
      }
    ]);

    const choiceData2 = dbData2.map( (row) => ({
      name: row.title,
      value: row
    }));

    const roleToAssign = await inquirer.prompt([
      {
        message: "Which role do you want to assign to them?",
        type: "list",
        choices: choiceData2,
        name: "title"
      }
    ]);
    const employeeFirstName = employeeToChange.name.first_name;
    const employeeLastName = employeeToChange.name.last_name;
    const employeeManagerID = employeeToChange.name.manager_id;
    const employeeID = employeeToChange.name.id;
    const roleAssigned = roleToAssign.title.id;

    const displayToTable = {
      first_name: employeeFirstName,
      last_name: employeeLastName,
      role_id: roleAssigned,
      manager_id: employeeManagerID
    }

    await inquirer.prompt([
      {
        message: `${employeeFirstName} ${employeeLastName} successully assigned to ${roleToAssign.title.title}.\nPress Enter to continue.`,
        type: "input",
        name: "enter"
      }
    ]);
    await showTable([displayToTable]);
    // await db.query("UPDATE employee SET ", displayToTable);
    // await db.query("UPDATE employee SET role_id = ? WHERE id = ?", roleAssigned, employeeID);
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
        await menu();
    });
  };