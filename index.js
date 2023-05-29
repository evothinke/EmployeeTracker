var mysql = require('mysql2');
const fs = require('fs');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'instax01Aq#@',
  database: 'employees'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database.');
  
  var schema = fs.readFileSync('./db/schema.sql', 'utf8');
  connection.query(schema, (err) => {
    if (err) {
      console.error('Error executing schema SQL: ', err);
    } else {
      console.log('Schema executed successfully.');
    }

    var inquirer = require('inquirer');
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'size',
          message: 'Please choose from the following...',
          choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role'
          ]
        }
      ])
      .then((answers) => {
        const selectedChoice = answers.size;

        // Execute the corresponding query based on the selected choice
        if (selectedChoice === 'View all departments') {
          connection.query('SELECT * FROM department', (err, rows) => {
            if (err) {
              console.error('Error executing query: ', err);
              return;
            }

            console.log('Contents of departments:');
            console.table(rows);

            connection.end(); // Close the database connection
          });
        } else if (selectedChoice === 'View all roles') {
          connection.query('SELECT * FROM role', (err, rows) => {
            if (err) {
              console.error('Error executing query: ', err);
              return;
            }

            console.log('Contents of roles:');
            console.table(rows);

            connection.end(); // Close the database connection
          });
        } else if (selectedChoice === 'View all employees') {
          connection.query('SELECT * FROM employees', (err, rows) => {
            if (err) {
              console.error('Error executing query: ', err);
              return;
            }

            console.log('Contents of employees:');
            console.table(rows);

            connection.end(); // Close the database connection
          });
        } else if (selectedChoice === 'Add a department') {
          // Implement code for adding a department
          // ...
        } else if (selectedChoice === 'Add a role') {
          // Implement code for adding a role
          // ...
        } else if (selectedChoice === 'Add an employee') {
          // Implement code for adding an employee
          // ...
        } else if (selectedChoice === 'Update an employee role') {
          // Implement code for updating an employee role
          // ...
        } else {
          console.log('Invalid choice selected.');
          connection.end(); // Close the database connection
        }
      })
      .catch((error) => {
        if (error.isTtyError) {
          console.error('Prompt couldn\'t be rendered in the current environment.');
        } else {
          console.error('Something else went wrong:', error);
        }
        connection.end(); // Close the database connection
      });
  });
});
