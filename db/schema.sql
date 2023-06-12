-- Deletes database is if exists already
DROP DATABASE IF EXISTS human_resources_db;
-- Creates a new database with this name
CREATE DATABASE human_resources_db;

-- Makes sure we are inside the database we just created
USE human_resources_db;

-- Create a table labelled department with department names 
-- and auto incrementing id number
CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Create a table labelled role, holds role title, salary, 
-- and a foreign key of department_id
-- can be joined with department table
CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

-- Create a table labelled employee, holds first and last name, 
-- and foreign keys of role_id and manager_id
-- can be joined to role table
CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL,
    manager_id INT,
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);