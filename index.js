const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');
const inquirer = require('inquirer');

// Create a connection without specifying a database
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
});

// Function to create the database and run the schema SQL
function runSchema() {
  const schema = fs.readFileSync('./db/schema.sql', 'utf8');

  connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
    if (err) {
      console.error('Error creating database:', err);
      // connection.end(); // Close the connection
      return;
    }

    // Connect to the newly created database
    connection.changeUser({ database: process.env.DB_NAME }, (err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        // connection.end(); // Close the connection
        return;
      }

      // Execute the schema SQL
      connection.query(schema, (err) => {
        if (err) {
          console.error('Error executing schema SQL:', err);
        } else {
          //console.log('Schema executed successfully.');
          runSeed(); // Call the runSeed function after executing the schema SQL
        }

        // connection.end(); // Close the connection
      });
    });
  });
}

// Function to run the seed SQL
function runSeed() {
  const seed = fs.readFileSync('./db/seeds.sql', 'utf8');

  // Execute the seed SQL
  connection.query(seed, (err) => {
    if (err) {
      console.error('Error executing seed SQL:', err);
    } else {
      //console.log('Seed executed successfully.');
    }

  });
}

// Execute the schema creation and connection
runSchema();

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
});

// ______________________________________________________________________________________________ mainMenu
const mainMenu = () => {
  //console.clear(); // Clear the console
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'main-menu',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Delete a Department',
          'Delete a Role',
          'Delete an Employee'
        ]
      }
    ])
    .then((response) => {
      const selectedChoice = response['main-menu'];
      switch (selectedChoice) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployee();
          break;
        case 'Delete a Department':
          deleteDepartment();
          break;
        case 'Delete a Role':
          deleteRole();
          break;
        case 'Delete an Employee':
          deleteEmployee();
          break;
        case 'Exit':
          connection.end();
      }
    });
};

// ______________________________________________________________________________________________ viewDepartments
const viewDepartments = () => {
  console.clear(); // Clear the console
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    console.table(res);
    mainMenu()
  });
};

// ______________________________________________________________________________________________ viewRoles
function viewRoles() {
  console.clear(); // Clear the console
  connection.query('SELECT * FROM Role', (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }

    // console.log('Contents of roles:');
    console.table(rows);
    //setTimeout(mainMenu, 1000000);
    mainMenu()
  });
}
// ______________________________________________________________________________________________ viewEmployees
function viewEmployees() {
  console.clear(); // Clear the console
  connection.query('SELECT * FROM employees', (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }

    
    console.table(rows);
    mainMenu()
   
  });
}
// ______________________________________________________________________________________________ addRole
function addRole() {
  console.clear(); 
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What name of the role?',
        name: 'title'
      },
      {
        type: 'input',
        message: 'What is the salary?',
        name: 'salary'
      },
      {
        type: 'list',
        message: 'What is the department for the role?',
        name: 'role',
        choices: function () {
          // Dynamically generate the choices by executing a SQL query
          return new Promise((resolve, reject) => {
            connection.query('SELECT department_name FROM department', (err, res) => {
              if (err) {
                reject(err);
              } else {
                const roleDepartment = res.map(department => `${department.department_name}`);
                resolve(roleDepartment);
              }
            });
          });
        },
      },
    ])
    .then((response) => {
      connection.query(
        `INSERT INTO role (title, salary, department_id) 
         VALUES ('${response.title}', '${response.salary}', (SELECT id FROM department WHERE department_name = '${response.role}'))`,
        (err, res) => {
          if (err) {
            console.error('Error executing query:', err);
            return;
          }
        }
        );
        console.log(`The role '${response.title}' has been added successfully.`);
      
      mainMenu()
    });
}
// ______________________________________________________________________________________________ addEmployee
function addEmployee() {
  console.clear(); // Clear the console
  
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'First Name',
        name: 'first_name',
      },
      {
        type: 'input',
        message: 'Last Name',
        name: 'last_name',
      },
      {
        type: 'list',
        message: 'What is the employees role?',
        name: 'role',
        choices: function () {
          // Dynamically generate the choices by executing a SQL query
          return new Promise((resolve, reject) => {
            connection.query('SELECT title FROM Role', (err, res) => {
              if (err) {
                reject(err);
              } else {
                const roleTitle = res.map(role => `${role.title}`);
                resolve(roleTitle);
              }
            });
          });
        },
      },
      {
        type: 'input',
        message: 'Manager Id',
        name: 'manager_id',
      },
    ])
    .then((response) => {
      connection.query(
        `INSERT INTO Employees (first_name, last_name, role_id) 
         VALUES ('${response.first_name}', '${response.last_name}', (SELECT id FROM Role WHERE title = '${response.role}'))`,
        (err, res) => {
          if (err) {
            console.error('Error executing query:', err);
            return;
          }
          console.log(`The employee '${response.first_name}', '${response.last_name}' has been added successfully.`);
        }
      );


      mainMenu()
    });
}

mainMenu();
