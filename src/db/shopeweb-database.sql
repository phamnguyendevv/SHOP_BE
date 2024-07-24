

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_role VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE status_product (
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


-- Tạo bảng User

CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  status_id INT,
  FOREIGN KEY (status_id) REFERENCES status_user(id),
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  balance INT,
  email VARCHAR(255),
  full_name VARCHAR(255),
  user_name VARCHAR(255),
  password VARCHAR(255),
  avatar VARCHAR(255),
  phone INT,
  points INT,
  qr_admin JSON,
  birthday DATETIME,
  sex VARCHAR(10),
  is_online BOOLEAN,
  off_line_at DATETIME,
  referrer_id INT,
  referral_code VARCHAR(255),
  created_at DATETIME,
  updated_at DATETIME
);


-- Tạo bảng Seller
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
    name_bank VARCHAR(255),
    bank_account VARCHAR(255),
    name_bank_account VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);



-- Tạo bảng Announcement
CREATE TABLE announcement (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    title VARCHAR(255),
    is_read VARCHAR(255),
    content VARCHAR(255),
    image VARCHAR(255),
    url_anno VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);


-- Tạo bảng Product
CREATE TABLE product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    status_id INT,
    FOREIGN KEY (status_id) REFERENCES status_product(id),
    name VARCHAR(255),
    price INT,
    url_demo VARCHAR(255),
    is_popular BOOLEAN,
    description TEXT,
    sold INT,
    code_discount VARCHAR(255),
    pre_order BOOLEAN,
    points INT,
    slug TEXT,
    technology JSON,
    created_at DATETIME,
    updated_at DATETIME
);


CREATE TABLE  classify (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES product(id),
    name VARCHAR(255),
    price VARCHAR(255),
    url_download VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME

);



-- Tạo bảng categories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    slug TEXT,
    is_popular BOOLEAN,
    image VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);




-- Tạo bảng Review
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





-- Tạo bảng ProductCart
CREATE TABLE product_cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES product(id),
    status_id INT,
    FOREIGN KEY (status_id)  REFERENCES status_product(id),
    code VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

-- Tạo bảng Discount
CREATE TABLE discount (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    start DATETIME,
    end DATETIME,
    persen INT,
    name INT,
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

CREATE TABLE categories_products (
    category_id INT ,
    product_id INT ,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);





INSERT INTO role (name_role, created_at, updated_at) VALUES
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

INSERT INTO user (full_name, email, password, role_id, status_id, qr_admin, balance, created_at, updated_at) 
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

INSERT INTO user (full_name, email, password, role_id, status_id, qr_admin, balance, created_at, updated_at) 
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