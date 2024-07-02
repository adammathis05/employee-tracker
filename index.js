const { prompt } = require("inquirer");
const pool = require("./db/connection");

function startApp() {
    console.log("Welcome!");
    prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Quit",
        ],
      },
    ]).then((options) => {switch (options.choice) {
        case "View all departments":
          viewDepts();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRoleAA();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployee();
          break;
        case "Quit":
          pool.end(); // close the pool 
      }
    });
  }

  async function viewDepts() {
    const { rows } = await pool.query("SELECT * FROM department");
    console.table(rows);
    startApp();
  }

startApp();

async function viewRoles() {
    const { rows } = await pool.query("SELECT role.title, role.salary, department.name AS department_name FROM role JOIN department ON role.department_id = department.id");
    console.table(rows);
    startApp();
}

async function viewEmployees() {
    const sql = `SELECT employee.id, employee.first_name AS "first name", employee.last_name AS "last name", role.title, department.name AS department, role.salary, manager.first_name || ' ' || manager.last_name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    const {rows} = await pool.query(sql);
    console.table(rows);
    startApp();
}

async function addDepartment() {
    const {dept} = await prompt ([{
        type: "input",
        message: "What is the name of the new department?",
        name: "dept",
    }])
    await pool.query("INSERT INTO department (name) VALUES ($1)", [dept]);
    console.log("Your department was added successfully!");
    startApp();
}

async function addRoleAA() {
    const { rows } = await pool.query("SELECT id AS value, name AS name FROM department");
    const answer = await prompt([{
        type: "input",
        message: "What is the name of the new role?",
        name: "role",
    }, {
        type: "input",
        message: "What is the salary of the new role?",
        name: "salary",
    }, {
        type: "list",
        message: "What department does the role belong to?",
        name: "dept",
        choices: rows,
    }])
    await pool.query("INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)", [answer.role, answer.salary, answer.dept]);
    console.log("Role successfully added!");
    startApp();
}

