﻿CREATE TABLE category(
	id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    parent INT
);
CREATE TABLE book_store(
	id SERIAL PRIMARY KEY,
    author VARCHAR(100),
    id_category INT,
    isnb VARCHAR(50),
    description text,
    link_download VARCHAR(255),
    file_format VARCHAR(20),
    file_size VARCHAR(20),
    images VARCHAR(255),
    language VARCHAR(50),
    name VARCHAR(250),
    pages INT,
    read_online VARCHAR(255),
    year INT,
    FOREIGN KEY (id_category) REFERENCES category (id)
);
INSERT INTO category(name, parent) VALUES
('Hardware & DIY',0),
('Game Programming',0),
('Security',0),
('Marketing & SEO',0),
('Software',0),
('Programming',0),
('Web Development',0),
('Graphics & Design',0),
('Datebases',0),
('Networking & Cloud Computing',0),
('Operating Systems',0),
('Certification',0),
('Administration',0),
('Enterprise',0),
('Computers & Technology',0),
('.NET',6),
('HTML,HTML5,CSS',7),
('CMS',7),
('C #',6),
('C & C++',6),
('APS.NET',7);