CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    location VARCHAR(255),
    file_path VARCHAR(255),  
    file_name VARCHAR(255),
    tags JSON,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
); 


CREATE DATABASE esfrar_db;

USE esfrar_db;

CREATE TABLE users (
 id VARCHAR(50)  PRIMARY KEY,
 first_name VARCHAR(255) NOT NULL,
 last_name VARCHAR(255) NOT NULL,
 username VARCHAR(255) UNIQUE,
 email VARCHAR(255) UNIQUE ,
 password VARCHAR(255) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    file_path VARCHAR(255),  
    file_name VARCHAR(255),
    tags JSON,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
); 
