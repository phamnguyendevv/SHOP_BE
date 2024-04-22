
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE status_product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name  VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE status_cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name  VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE status_user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  status_id INT,
  FOREIGN KEY (status_id) REFERENCES status_user(id),
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  balance INT,
  email VARCHAR(255),
  fullname VARCHAR(255),
  username VARCHAR(255),
  password VARCHAR(255),
  avatar VARCHAR(255),
  phone INT,
  points INT,
  qr_admin JSON,
  birthday DATETIME,
  sex VARCHAR(10),
  isOnline BOOLEAN,
  offlineAt DATETIME,
  referrer_id INT,
  referral_code VARCHAR(255),
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE seller (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    description VARCHAR(255),
    date_join_seller DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE payment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    nameBank VARCHAR(255),
    bankAccount VARCHAR(255),
    bank_AccountName VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE announcement (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    title VARCHAR(255),
    isRead VARCHAR(255),
    content VARCHAR(255),
    image VARCHAR(255),
    url VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    status_id INT,
    FOREIGN KEY (status_id) REFERENCES status_product(id),
    price INT,
    url_Demo VARCHAR(255),
    popular BOOLEAN,
    category JSON,
    description TEXT,
    sold INT,
    code_Discount VARCHAR(255),
    url_Download VARCHAR(255),
    pre_order BOOLEAN,
    points INT,
    slug TEXT,
    technology JSON,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES product(id),
    name VARCHAR(255),
    slug TEXT,
    popular BOOLEAN,
    image VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE  classify (
    id INT PRIMARY KEY AUTO_INCREMENT,
    gia  INT,
    image VARCHAR(255),
    urldowload VARCHAR(255),
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES product(id),
    created_at DATETIME,
    updated_at DATETIME

);

CREATE TABLE review (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES product(id),
    star INT,
    content TEXT,
    image VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE product_cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES product(id),
    status_id INT,
    FOREIGN KEY (status_id)  REFERENCES status_product(id),
    code_discount VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);
CREATE TABLE discount (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    start_discount DATE,
    end_discount DATE,
    persen_discount INT,
    name_discount INT,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE discount_used (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    discount_id INT,
    FOREIGN KEY (discount_id) REFERENCES discount(id),
    created_at DATETIME,
    updated_at DATETIME
);

INSERT INTO role (name, created_at, updated_at) VALUES
('admin', CURDATE(), CURDATE()),
('user', CURDATE(), CURDATE());

INSERT INTO status_product (name, created_at, updated_at) VALUES
('Pending', CURDATE(), CURDATE()),
('Success', CURDATE(), CURDATE()),
('Ban', CURDATE(), CURDATE());

INSERT INTO status_cart (name, created_at, updated_at) VALUES
('InCart', CURDATE(), CURDATE()),
('Success', CURDATE(), CURDATE()),
('Pending', CURDATE(), CURDATE()),
('Refund', CURDATE(), CURDATE());

INSERT INTO status_user (name, created_at, updated_at) VALUES
('Verify', CURDATE(), CURDATE()),
('NotVerify', CURDATE(), CURDATE()),
('Ban', CURDATE(), CURDATE());

INSERT INTO user (fullname, email, password, role_id, status_id, qr_admin, balance, created_at, updated_at) 
VALUES 
(
  'admin', 
  'admin@gmail.com', 
  '$2a$10$NK5UyQa9jzNVcG8bxkTCJO0JcszemPTWZT2A74vFwgLNVc.GluYW2',
  1, 
  1, 
  '[{"nameAccout": "admin", "nameBank": "Vietcombank", "numberAccout": "123456789", "qrcode": "https://www.qrcode-monkey.com/qrcode-api/?size=200&data=123456789", "money": 1000000}, {"nameAccout": "admin", "nameBank": "Vietinbank", "numberAccout": "123456789", "qrcode": "https://www.qrcode-monkey.com/qrcode-api/?size=200&data=123456789", "money": 1000000}]',
  0, 
  CURDATE(), 
  CURDATE() 
);

INSERT INTO user (fullname, email, password, role_id, status_id, qr_admin, balance, created_at, updated_at) 
VALUES 
(
  'user', 
  'user@gmail.com', 
  '$2a$10$zZu5HGhdAhBhjNDvHWm2S.KLsW8t9xYufQE1ZeRgzY5HKUy7HzRF.', 
  2, 
  1, 
  '[{"nameAccout": "admin", "nameBank": "Vietcombank", "numberAccout": "123456789", "qrcode": "https://www.qrcode-monkey.com/qrcode-api/?size=200&data=123456789", "money": 1000000}, {"nameAccout": "admin", "nameBank": "Vietinbank", "numberAccout": "123456789", "qrcode": "https://www.qrcode-monkey.com/qrcode-api/?size=200&data=123456789", "money": 1000000}]', 
  0, 
  CURDATE(),
  CURDATE() 
);
