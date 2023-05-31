# Employee Tracker

This is a project that interacts with a MySQL database using Node.js. It allows you to perform various operations on the database such as viewing departments, roles, and employees, adding departments, roles, and employees, updating employee roles, and deleting departments, roles, and employees.

<a href="https://drive.google.com/file/d/1CQTs84D9Khe1yrXtNCCEqH0qtKkLDvtq/view?usp=sharing">See</a> the app in action.
## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install the dependencies: `npm install`
4. Set up the MySQL database:
   - Make sure you have MySQL installed and running on your machine.
   - Create a `.env` file in the project root directory and provide the following information:
     ```
     DB_USER=<your_mysql_username>
     DB_PASSWORD=<your_mysql_password>
     DB_NAME=<your_database_name>
     ```
   - Create a schema SQL file and a seeds SQL file in the `db` directory to define your database schema and initial data, respectively.
5. Start the application: `node index.js`

## Usage

The application provides a command-line interface where you can select various options from a menu. Use the arrow keys to navigate the menu and press Enter to select an option.

The main menu options include:

- View all departments
- View all roles
- View all employees
- Add a department
- Add a role
- Add an employee
- Update an employee role
- Delete a Department
- Delete a Role
- Delete an Employee
- Exit

Selecting an option will perform the corresponding operation on the MySQL database.

## Contributing

Contributions are welcome! If you find any issues or want to enhance the project, feel free to open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
