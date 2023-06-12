-- Insert values/roles into department table
INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

-- Insert values/rows into role table
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 80000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

-- Insert values/rows into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Yoichi", "Isagi", 1, null),
       ("Meguru", "Bachira", 2, 1),
       ("Reo", "Mikage", 3, null),
       ("Seishiro", "Nagi", 4, 3),
       ("Yo", "Hiori", 5, null),
       ("Ranze", "Kurona", 6, 5),
       ("Ikki", "Niko", 7, null),
       ("Alexis", "Ness", 8, 7);