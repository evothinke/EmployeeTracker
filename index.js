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

      return;
    }

    // Connect to the newly created database
    connection.changeUser({ database: process.env.DB_NAME }, (err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
       
        return;
      }

      // Execute the schema SQL
      connection.query(schema, (err) => {
        if (err) {
          console.error('Error executing schema SQL:', err);
        } else {
          console.log('Schema executed successfully.');
          runSeed(); // Call the runSeed function after executing the schema SQL
        }

       
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
      console.log('Seed executed successfully.');
    }

    // connection.end(); // Close the connection after executing the seed SQL
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


const mainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'main-menu',
      message: 'Please choose from the following options:',
      prefix: '-',
      suffix: '-',
      pageSize: 10,
      choices: [
        { name: 'View all departments' },
        { name: 'View all roles' },
        { name: 'View all employees' },
        { name: 'Add a department' },
        { name: 'Add a role' },
        { name: 'Add an employee' },
        { name: 'Update an employee role' }
      ]
    }
  ])
    .then((response) => {
      const selectedChoice = response['main-menu'];
      switch (selectedChoice) {
        case 'View all departments':
          console.clear();
          viewDepartments();
          break;
        case 'View all roles':
          console.clear();
          viewRoles();
          break;
        case 'View all employees':
          console.clear();
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
        case 'Exit':
          console.log('Bye!');
          connection.end();
      }
    });
};


const viewDepartments = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    mainMenu();
    console.table(res);
    
  });
};

function viewRoles() {
  connection.query('SELECT * FROM role', (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }

    mainMenu();
    console.log('Contents of roles:');
    console.table(rows);
  });
}

function viewEmployees() {
  connection.query('SELECT * FROM employees', (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }

    mainMenu();
    console.log('Contents of employees:');
    console.table(rows);
  });
}

function addRole() {
  
  console.log('Add a role');
  mainMenu();
}

function addEmployee() {
  
  console.log('Add an employee');
  // mainMenu();
}

function addDepartment() {
  
  console.log('Add a department');
  mainMenu();
}

function updateEmployee() {

  console.log('Update an employee role');
  mainMenu();
}

mainMenu();
