INSERT INTO Department (department_name)
VALUES
('IT'),
('Accounting'),
('Marketing'),
('Sales');

INSERT INTO Role(title, salary, department_id)
VALUES
('Software Engineer', '75000', 1),
('Team Leader', '100000', 1),
('Finance Specialist', '70000', 2),
('Accountant', '100000', 2),
('Marketologist', '82000', 3),
('Graphic Designer', '100000', 3),
('Brand Manager', '78000', 3),
('Shop Assistant', '60000', 4),
('SalesPerson', '60000', 4);

INSERT INTO Employees(first_name, last_name, role_id)
VALUES
('Jason', 'Kohn', 1),
('Caleb', 'Mauch', 2),
('Jeremy', 'Mayers', 3),
('Zack', 'Meyers', 4),
('Jeremy', 'Johnson', 5),
('Ethan', 'James', 6),
('Christy', 'Chen', 7);