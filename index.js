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
// ______________________________________________________________________________________________ addDepartment
function addDepartment() {
  console.clear(); // Clear the console
  
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What department would you like to add?',
        name: 'addDepartment',
      },
    ])
    .then((response) => {
      connection.query(`INSERT INTO department (department_name) 
  VALUES ('${response.addDepartment}')`, (err, res) => {
        if (err) {
          console.error('Error executing query:', err);
          return;
        }
        console.log(`'${response.addDepartment}' has been added successfully.'`)
      });
      mainMenu()
    });
}
// ______________________________________________________________________________________________ updateEmployee
function updateEmployee() {
  console.clear(); // Clear the console
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Which employee would you like to update?',
        name: 'updateEmployee',
        choices: function () {
          // Dynamically generate the choices by executing a SQL query
          return new Promise((resolve, reject) => {
            connection.query('SELECT first_name, last_name FROM Employees', (err, res) => {
              if (err) {
                reject(err);
              } else {
                const employees = res.map(employees => `${employees.first_name} ${employees.last_name}`);
                resolve(employees);
              }
            });
          });
        },
      },
      {
        type: 'list',
        message: 'What is their new role?',
        name: 'newRole',
        choices: function () {
          return new Promise((resolve, reject) => {
            connection.query('SELECT title FROM role', (err, res) => {
              if (err) {
                reject(err);
              } else {
                const roles = res.map(role => role.title);
                resolve(roles);
              }
            });
          });
        }
      },
    ])
    .then((response) => {
      const selectedEmployee = response.updateEmployee;
      const newRole = response.newRole;
      const query = `UPDATE Employees SET role_id = (SELECT id FROM Role WHERE title = '${newRole}') WHERE CONCAT(first_name, ' ', last_name) = '${selectedEmployee}'`;
      connection.query(query, (err, res) => {
        if (err) {
          console.error('Error executing query:', err);
        } else {
          console.log('Employee updated.');
        }
        mainMenu(); // Go back to the main menu
      });

    })
}
// ______________________________________________________________________________________________ deleteDepartment
function deleteDepartment() {
  console.clear(); // Clear the console
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What department do you want to delete?',
        name: 'deptList',
        choices: function () {
          // Dynamically generate the choices by executing a SQL query
          return new Promise((resolve, reject) => {
            connection.query('SELECT department_name FROM department', (err, res) => {
              if (err) {
                reject(err);
              } else {
                const departments = res.map(department => department.department_name);
                resolve(departments);
              }
            });
          });
        },
      },
    ])
    .then((response) => {
      const departmentName = response.deptList;

      connection.query(
        `DELETE FROM department WHERE department_name = '${departmentName}'`,
        (err, res) => {
          if (err) {
            console.error('Error executing query:', err);
          } else {
            console.log('Department deleted.');
          }
          mainMenu();
        }
      );
    });
}
// ______________________________________________________________________________________________ delete Employee
function deleteEmployee() {
  console.clear(); // Clear the console
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What employee would you like to delete?',
        name: 'employeeList',
        choices: function () {
          // Dynamically generate the choices by executing a SQL query
          return new Promise((resolve, reject) => {
            connection.query('SELECT first_name, last_name FROM employees', (err, res) => {
              if (err) {
                reject(err);
              } else {
                const employees = res.map(employee => `${employee.first_name} ${employee.last_name}`);
                resolve(employees);
              }
            });
          });
        },
      },
    ])
    .then((response) => {
      const selectedEmployee = response.employeeList;
      const [firstName, lastName] = selectedEmployee.split(' ');

      connection.query(
        `DELETE FROM employees WHERE first_name = '${firstName}' AND last_name = '${lastName}'`,
        (err, res) => {
          if (err) {
            console.error('Error executing query:', err);
          } else {
            console.log('Employee deleted.');
          }
          mainMenu();
        }
      );
    });
}



mainMenu();
