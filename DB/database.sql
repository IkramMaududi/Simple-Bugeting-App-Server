-- CREATE DATABASE budgetapp;
-- \c budgetapp

CREATE TABLE users (
    id serial not null primary key,
    username varchar(80) not null,
    unique (username)
);

CREATE TABLE income (
    id smallserial not null primary key,
    username varchar(80) references users(username),
    submitted_date date not null, 
    item_name varchar(100) not null, 
    amount real not null
);

CREATE TABLE expense (
    id smallserial not null primary key,
    username varchar(80) references users(username),
    submitted_date date not null, 
    item_name varchar(100) not null, 
    amount real not null
);
