const { Pool } = require('pg');

const { createPromptModule } = require("inquirer");
const prompt = createPromptModule(); // housekeeping for deleteDepartment functions

const pool = new Pool({
  user: 'postgres',
  password: '',
  database: 'department_db',
});
// get all departments from db
const getDepartments = () => {
  return pool.query('SELECT * FROM department')
    .then(result => result.rows) // return rows from query
    .catch(err => console.error(err)); // log error
};
// get all roles from db
const getRoles = () => {
  return pool.query(`
    SELECT role.*, department.name AS department_name 
    FROM role 
    JOIN department ON role.department_id = department.id
  `)
    .then(result => result.rows)
    .catch(err => console.error(err));
};
// get all employees from db
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
    .then(result => result.rows[0]) // return first row from query result
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
// delete department based on given ID
const deleteDepartmentById = (id) => {

  return pool.query(`DELETE FROM department WHERE id = $1`, [id]);
};
// getall departments Ids and rename to Value, names
const getAllDepartments = () => {
  return pool.query("SELECT id AS value, name FROM department");
};


const deleteDepartmentFromPrompt = (answers) => {
  return deleteDepartmentById(answers.departmentId); // delete department based on answer from prompt, name correlated to ID value
};

const selectDepartmentByName = (result) => {
  const question = {
    type: "rawlist",
    name: "departmentId",
    choices: result.rows,
    message: "What department would you like to remove? WARNING, ALL EMPLOYEES MUST BE REMOVED FROM DEPARTMENT",
  };

  return prompt(question); //prompt user to select department
};
module.exports = {
  getAllDepartments,
  selectDepartmentByName,
  deleteDepartmentFromPrompt,
  deleteDepartmentById,
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};

