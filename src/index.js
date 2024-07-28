const inquirer = require('inquirer');
const {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} = require('./queries') //functions to call for prompt answers

const mainMenu = () => { //acts as prompt and init function
  inquirer.prompt([
    {
      type: 'list',
      name:'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    },
  ])
  .then(({action}) => {
    if (action === 'View all departments') {
      getDepartments() //fetch department table
      .then(departments => console.table(departments)) // display department table
      .then(() => mainMenu()); // return to choices
    } else if (action === 'View all roles') {
      getRoles() //fetch roles table
        .then(roles => console.table(roles)) // display roles deable
        .then(() => mainMenu()); 
    } else if (action === 'View all employees') {
      getEmployees()
      .then(employees => console.table(employees))
      .then(() => mainMenu());
    } else if (action === 'Add a department') {
      inquirer.prompt([
        {
          type: 'input',
          name: 'departmentName',
          message:'Enter the name of the department:',
        },
      ])
      .then(({departmentName}) => {
        return addDepartment(departmentName) //gives departmentName to next promise chain
          .then(() => console.log(`Added Department: ${departmentName}`)); // confirming successful 
      })
      .then(() => mainMenu());
    } else if (action === 'Add a role') {
      inquirer.prompt([
        {
          type: 'input',
          name:'roleTitle',
          message:'Enter the title of the role',
        },
        {
          type:'input',
          name:'roleSalary',
          messge:'Enter the salary of the role',
        },
        {
          type:'input',
          name:'roleDepartmentId',
          message:'Enter the department ID of the role',
        },
      ])
      .then(({roleTitle, roleSalary, roleDepartmentId}) => {
        return addRole(roleTitle, roleSalary, roleDepartmentId)
          .then(() => console.log(`added role: ${roleTitle}`));
      })
      .then(() => mainMenu());
    } else if (action === 'Add an employee') {
      inquirer.prompt([
        {
          type: 'input',
          name:'firstName',
          message: 'Enter the first name',
        },
        {
          type:'input',
          name:'lastName',
          message:'Enter the last name',
        },
        {
          type:'input',
          name:'roleId',
          message:'input role id for employee',
        },
        {
          type:'input',
          name:'managerId',
          messge:'enter manager id(skip if no manager)',
        },
      ])
      .then(({firstName, lastName, roleId, managerId}) => {
        return addEmployee(firstName, lastName, roleId, managerId)
          .then(() => console.log(`added employee ${firstName} ${lastName}`));
      })
      .then(() => mainMenu());
    } else if (action === 'Update an employee role') {
      inquirer.prompt([
        {
          type:'input',
          name:'employeeId',
          message:'enter the id of the employee',
        },
        {
          type:'input',
          name:'newRoleId',
          message:'enter new role ID for the employee',
        },
      ])
      .then (({employeeId, newRoleId}) => updateEmployeeRole(employeeId,newRoleId))
      .then (() => console.log(`Updated employee role`))
      .then (() => mainMenu());
    } else if (action === 'Exit') {
      console.log('Exiting application...');
      process.exit(); // process.exit allows user to exit without using control + c
    }
  })
};
// init
mainMenu();

