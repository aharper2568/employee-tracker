const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '',
  database: 'department_db',
});

const getDepartments = () => {
  return pool.query('SELECT * FROM department')
    .then(result => result.rows)
    .catch(err => console.error(err));
};

const getRoles = () => {
  return pool.query(`
    SELECT role.*, department.name AS department_name 
    FROM role 
    JOIN department ON role.department_id = department.id
  `)
    .then(result => result.rows)
    .catch(err => console.error(err));
};

const getEmployees = () => {
  return pool.query(`
    SELECT employee.*, role.title, role.salary, department.name AS department_name,
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  `)
    .then(result => result.rows)
    .catch(err => console.error(err));
};

const addDepartment = (name) => {
  return pool.query('INSERT INTO department (name) VALUES ($1) RETURNING *', [name])
    .then(result => result.rows[0])
    .catch(err => console.error(err));
};

const addRole = (title, salary, department_id) => {
  return pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [title, salary, department_id])
    .then(result => result.rows[0])
    .catch(err => console.error(err));
};

const addEmployee = (first_name, last_name, role_id, manager_id) => {
  return pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, role_id, manager_id])
    .then(result => result.rows[0])
    .catch(err => console.error(err));
};

const updateEmployeeRole = (employee_id, role_id) => {
  return pool.query('UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *', [role_id, employee_id])
    .then(result => result.rows[0])
    .catch(err => console.error(err));
};

module.exports = {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};
