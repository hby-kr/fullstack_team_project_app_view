--
-- project_artU.sql
--
-- Project of group1 in Fullstack course at TJ Academy
--
-- memebers: 고현, 김기현, 서미란, 이상혁, 채수정, 황보영
--
-- title: ArtU _ 공연플랫폼
--
-- 프로젝트 내 서비스 소개:
--
--

-- 새로운 데이터베이스 생성
DROP SCHEMA IF EXISTS artu;
CREATE SCHEMA artu DEFAULT CHARACTER SET utf8mb4;

-- Role 생성
DROP ROLE IF EXISTS 'dev_role';
DROP ROLE IF EXISTS 'user_role'; -- 있으면 삭제하고
CREATE ROLE 'dev_role'; -- 새롭게 또는 다시 만든다.
CREATE ROLE 'user_role';

-- 권한을 Role에 부여
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, TRIGGER ON artu.* TO 'dev_role';
GRANT SELECT, INSERT, UPDATE, DELETE, TRIGGER ON artu.* TO 'user_role';

-- 개발자 계정 생성, 역할할당, 권한부여
DROP USER IF EXISTS 'artu_dev'@'localhost'; -- 사용자 계정 삭제 (기존 계정이 존재하면 삭제)
CREATE USER 'artu_dev'@'localhost' IDENTIFIED BY 'mysql'; -- 개발자 계정 생성
GRANT 'dev_role' TO 'artu_dev'@'localhost'; -- 'dev_role'을 'artu_dev'에 부여
SET DEFAULT ROLE 'dev_role' TO 'artu_dev'@'localhost'; -- 'artu_dev'에 대해 'dev_role'을 기본 역할로 설정
FLUSH PRIVILEGES;

-- 유저 계정 생성, 역할할당, 권한부여
DROP USER IF EXISTS 'artu_user'@'localhost'; -- 사용자 계정 삭제 (기존 계정이 존재하면 삭제)
CREATE USER 'artu_user'@'localhost' IDENTIFIED BY 'mysql'; -- 일반 사용자 계정 생성
GRANT 'user_role' TO 'artu_user'@'localhost'; -- 'user_role'을 'artu_user'에 부여
SET DEFAULT ROLE 'user_role' TO 'artu_user'@'localhost'; -- 권한을 설정하고 활성화
FLUSH PRIVILEGES;


-- 데이터베이스 사용
USE artu;

--
-- Table structure for table `users`
-- 회원DB
--
CREATE TABLE users
(
    user_id VARCHAR(50) PRIMARY KEY, -- 회원가입에서의 아이디가 곧 pk값이 된다.
    user_email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    user_birth DATE NOT NULL,
    gender ENUM ('M', 'F') NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL, -- 탈퇴시 boolea은 false가 되고, dropout_at에 탈퇴시점이 적힌다.
    dropout_at timestamp NULL,
    memo VARCHAR(255) NULL
);

CREATE TABLE userlogin_logs
(
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE password_change_histories
(
    change_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    old_pw VARCHAR(255) NOT NULL,
    changed_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE categories
(
    ctgr_id TINYINT PRIMARY KEY AUTO_INCREMENT,
    ctgr_name VARCHAR(50) NOT NULL,
    is_used_main BOOLEAN NOT NULL, -- true여야지만 사용할 수 있게 로직짜기
    is_used_oneday BOOLEAN NOT NULL -- true여야지만 사용할 수 있게 로직짜기
);


CREATE TABLE user_interests
(
    user_id VARCHAR(50) NOT NULL,
    ctgr_id TINYINT NOT NULL,
    interest_order INT NOT NULL, -- 순서 천단위로 넣고 디폴트를 설정한다. 그리고 순서를 바꾸면1001로 설정하는 방식으로 만든다.
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (user_id, ctgr_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (ctgr_id) REFERENCES categories (ctgr_id)
);


CREATE TABLE rents
(
    rt_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL, -- 만든사람
    rt_name VARCHAR(50) NOT NULL,
    rt_address VARCHAR(50) NOT NULL,
    rt_capacity INT NOT NULL, -- 가용인원
    rt_info VARCHAR(255) NOT NULL, -- 왜 필요하지??
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE events
(
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    ctgr_id TINYINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    location VARCHAR(50) NULL,
    company VARCHAR(50) NOT NULL, -- 주최사
    address VARCHAR(100) NOT NULL,
    age_limit ENUM ('0', '12', '15', '19') DEFAULT '0' NOT NULL,
    how_long INT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE NOT NULL, -- 관리자 승인 여부
    is_used BOOLEAN DEFAULT TRUE NOT NULL, -- 삭제 여부
    memo VARCHAR(255) NULL,
    user_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (ctgr_id) REFERENCES categories (ctgr_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE chatrooms
(
    chat_id INT PRIMARY KEY AUTO_INCREMENT,
    is_private BOOLEAN NOT NULL, -- false면 관련 이벤트related_event가 무엇인지 적어야함
    related_event INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (related_event) REFERENCES events (event_id)
);


CREATE TABLE user_enter_chatroom (
                                     chat_id INT NOT NULL,
                                     user_id VARCHAR(50) NOT NULL,
                                     entered_at TIMESTAMP NULL,
                                     is_used BOOLEAN DEFAULT TRUE NOT NULL,
                                     PRIMARY KEY (chat_id, user_id),
                                     FOREIGN KEY (chat_id) REFERENCES chatrooms (chat_id),
                                     FOREIGN KEY (user_id) REFERENCES users (user_id)
);


CREATE TABLE messages
(
    msg_id INT PRIMARY KEY AUTO_INCREMENT,
    writer VARCHAR(50) NOT NULL,
    chatroom_id INT NOT NULL,
    msg_body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_checked BOOLEAN DEFAULT FALSE NOT NULL, -- entered_at(user_enter_chatroom)와 created_at를 비교
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (writer) REFERENCES users (user_id),
    FOREIGN KEY (chatroom_id) REFERENCES chatrooms (chat_id)
);


CREATE TABLE search_words
(
    key_id INT PRIMARY KEY AUTO_INCREMENT,
    keyword VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    search_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE hashtags
(
    tag_id INT PRIMARY KEY AUTO_INCREMENT,
    tagword VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    created_in timestamp DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);


CREATE TABLE user_settings
(
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    display_color ENUM ('Light', 'Dark') DEFAULT 'Light',
    language ENUM ('System', 'English', 'Korean') DEFAULT 'System',
    set_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE user_follow
(
    follower_id VARCHAR(50) NOT NULL,
    followee_id VARCHAR(50) NOT NULL,
    followed_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (follower_id, followee_id),
    FOREIGN KEY (follower_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (followee_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE user_img
(
    prf_img_id INT PRIMARY KEY AUTO_INCREMENT,
    prf_img_url VARCHAR(255) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    create_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE widgets
(
    widget_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    widget_size INT NOT NULL, -- 타입 int 맞나?
    widget_is_used BOOLEAN NOT NULL,
    widget_theme ENUM ('Light', 'Dark') DEFAULT 'Light',
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);


CREATE TABLE widget_details
(
    user_id VARCHAR(50) NOT NULL,
    widget_id INT NOT NULL,
    widget_json JSON NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (user_id, widget_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (widget_id) REFERENCES widgets (widget_id)
);


CREATE TABLE postings
(
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    contents TEXT NOT NULL,
    location_tag VARCHAR(255) NULL, -- 해시태그 테이블에 있는지 확인 후 없으면 create
    person_tag_id VARCHAR(50) NULL,
    visibility_type ENUM ('All', 'Friends', 'Private') DEFAULT 'All',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    edit_at timestamp NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (person_tag_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE posting_images
(
    img_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    img_order INT NOT NULL, -- 여러장일 때 순서
    img_url VARCHAR(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (post_id) REFERENCES postings (post_id) ON DELETE CASCADE
);

CREATE TABLE posting_comments
(
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    post_id INT NOT NULL,
    contents TEXT NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES postings (post_id) ON DELETE CASCADE
);

CREATE TABLE posting_like
(
    user_id VARCHAR(50) NOT NULL,
    post_id INT NOT NULL,
    liked_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES postings (post_id) ON DELETE CASCADE
);


CREATE TABLE funding_categories
(
    ctgr_id INT PRIMARY KEY AUTO_INCREMENT,
    ctgr_name VARCHAR(50) NOT NULL,
    ctgr_contents VARCHAR(255) NOT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL
);


CREATE TABLE fundings
(
    fd_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    ctgr_id INT NOT NULL,
    fd_title VARCHAR(150) NOT NULL,
    fd_goal_amount INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fd_start_at timestamp NOT NULL,
    fd_end_at timestamp NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (ctgr_id) REFERENCES funding_categories (ctgr_id) ON DELETE CASCADE
);


CREATE TABLE funding_options
(
    opt_id INT PRIMARY KEY AUTO_INCREMENT,
    fd_id INT NOT NULL,
    opt_name VARCHAR(50) NOT NULL,
    extra_fee INT NOT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (fd_id) REFERENCES fundings (fd_id) ON DELETE CASCADE
);


CREATE TABLE funding_images
(
    fd_img_id INT PRIMARY KEY AUTO_INCREMENT,
    fd_id INT NOT NULL,
    fd_img_url VARCHAR(255) NOT NULL,
    fd_img_order INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (fd_id) REFERENCES fundings (fd_id) ON DELETE CASCADE
);

CREATE TABLE funding_detail_images -- 상세 정보를 이미지로 받는다.
(
    img_id INT PRIMARY KEY AUTO_INCREMENT,
    fd_id INT NOT NULL,
    img_url VARCHAR(255) NOT NULL,
    img_order INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (fd_id) REFERENCES fundings (fd_id) ON DELETE CASCADE
);

CREATE TABLE user_funding_likes
(
    fd_id INT NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (fd_id, user_id),
    FOREIGN KEY (fd_id) REFERENCES fundings (fd_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE user_funding_bmarks
(
    fd_id INT NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (fd_id, user_id),
    FOREIGN KEY (fd_id) REFERENCES fundings (fd_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE funding_reviews
(
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    fd_id INT NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    rate INT NOT NULL,
    contents TEXT NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT TRUE,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fd_id) REFERENCES fundings (fd_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE funding_review_images
(
    img_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    img_url VARCHAR(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE rent_detail_images
(
    img_id INT PRIMARY KEY AUTO_INCREMENT,
    rt_id INT NOT NULL,
    img_url VARCHAR(255) NOT NULL,
    img_order INT NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (rt_id) REFERENCES rents (rt_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE rent_dates
(
    rt_date_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    rt_id INT NOT NULL,
    rt_date timestamp NOT NULL,
    rt_price INT NOT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (rt_id) REFERENCES rents (rt_id)
);

CREATE TABLE rent_item_options
(
    opt_id INT PRIMARY KEY AUTO_INCREMENT,
    rt_id INT NOT NULL,
    opt_name VARCHAR(50) NOT NULL,
    extra_fee INT NOT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (rt_id) REFERENCES rents (rt_id) ON DELETE CASCADE
);

CREATE TABLE rent_rooms
(
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    rt_id INT NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    price_per_unit INT NOT NULL,
    rt_unit ENUM ('hour', 'day') NOT NULL,
    ctgr VARCHAR(255) NOT NULL,
    min_time TINYINT NOT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (rt_id) REFERENCES rents (rt_id) ON DELETE CASCADE
);

CREATE TABLE rent_images
(
    rt_img_id INT PRIMARY KEY AUTO_INCREMENT,
    rt_id INT NOT NULL,
    img_order INT NULL,
    img_url VARCHAR(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (rt_id) REFERENCES rents (rt_id) ON DELETE CASCADE
);


CREATE TABLE user_rent_likes
(
    user_id VARCHAR(50) NOT NULL,
    rt_id INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (user_id, rt_id),
    FOREIGN KEY (rt_id) REFERENCES rents (rt_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE user_rent_bmarks
(
    user_id VARCHAR(50) NOT NULL,
    rt_id INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (user_id, rt_id),
    FOREIGN KEY (rt_id) REFERENCES rents (rt_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE rent_reviews
(
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    rt_id INT NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    rate int NOT NULL,
    contents TEXT NULL,
    is_used BOOLEAN NOT NULL DEFAULT TRUE,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rt_id) REFERENCES rents (rt_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE rent_review_images
(
    img_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    img_url VARCHAR(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE oneday_classes
(
    od_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    tchr_id VARCHAR(50) NOT NULL, -- 원데이 개설자
    od_name VARCHAR(100) NOT NULL,
    ctgr_id TINYINT NOT NULL,
    location VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    min_mem INT NOT NULL,
    max_mem INT NOT NULL,
    is_aproved BOOLEAN NOT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (ctgr_id) REFERENCES categories (ctgr_id),
    FOREIGN KEY (tchr_id) REFERENCES users (user_id)
);


CREATE TABLE oneday_dates
(
    date_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    od_id INT NOT NULL,
    od_price INT NOT NULL,
    od_date timestamp NOT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (od_id) REFERENCES oneday_classes (od_id)
);

CREATE TABLE oneday_images
(
    img_id INT AUTO_INCREMENT PRIMARY KEY,
    od_id INT NOT NULL,
    img_url VARCHAR(255) NOT NULL UNIQUE,
    img_order INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (od_id) REFERENCES oneday_classes (od_id)
);


CREATE TABLE oneday_detail_images
(
    img_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    od_id INT NOT NULL,
    img_url VARCHAR(255) NOT NULL UNIQUE,
    img_order INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (od_id) REFERENCES oneday_classes (od_id)
);


CREATE TABLE oneday_options
(
    opt_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    date_id INT NOT NULL,
    opt_name VARCHAR(100) NOT NULL,
    opt_price INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (date_id) REFERENCES oneday_dates (date_id)
);


CREATE TABLE oneday_reviews
(
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    od_id INT NOT NULL,
    contents TEXT NULL,
    rate int NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT TRUE,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (od_id) REFERENCES oneday_classes (od_id)
);

CREATE TABLE oneday_review_images
(
    img_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    img_url VARCHAR(255) NULL UNIQUE,
    user_id VARCHAR(50) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE user_oneday_bmarks
(
    user_id VARCHAR(50) NOT NULL,
    od_id INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (user_id, od_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (od_id) REFERENCES oneday_classes (od_id)
);

CREATE TABLE user_oneday_likes
(
    user_id VARCHAR(50) NOT NULL,
    od_id INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    PRIMARY KEY (user_id, od_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (od_id) REFERENCES oneday_classes (od_id)
);


CREATE TABLE event_dates -- 하루하루의 티켓
(
    date_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    event_date timestamp NOT NULL,
    event_price INT NOT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);

CREATE TABLE event_images
(
    img_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    img_url VARCHAR(255) NOT NULL,
    img_order INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);

CREATE TABLE event_detail_images
(
    img_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    img_url VARCHAR(255) NOT NULL,
    img_order INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);

CREATE TABLE event_options
(
    opt_id INT PRIMARY KEY AUTO_INCREMENT,
    date_id INT NOT NULL,
    opt_name VARCHAR(50) NOT NULL,
    opt_price INT NOT NULL,
    goal_min TINYINT NOT NULL, -- 이게 여기 들어가는게 맞나?
    dc_rate FLOAT NOT NULL, -- 이게 여기 들어가는게 맞나?
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (date_id) REFERENCES event_dates (date_id) ON DELETE CASCADE
);


CREATE TABLE agency
(
    agency_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(100) NOT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE actors
(
    actor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    prf_img_id INT NOT NULL,
    bday DATE NOT NULL,
    agency_id INT NOT NULL,
    is_joined INT NOT NULL, -- 가입했는가? yes -> 안보임
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (prf_img_id) REFERENCES user_img (prf_img_id) ON DELETE CASCADE,
    FOREIGN KEY (agency_id) REFERENCES agency (agency_id) ON DELETE CASCADE
);

CREATE TABLE actors_images
(
    img_id INT PRIMARY KEY AUTO_INCREMENT,
    img_url VARCHAR(255) NOT NULL,
    actor_id INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (actor_id) REFERENCES actors (actor_id) ON DELETE CASCADE
);

CREATE TABLE event_cast (
                            cast_id INT AUTO_INCREMENT PRIMARY KEY,
                            event_id INT NOT NULL,
                            is_joined BOOLEAN NOT NULL, -- 배우가 가입했는가? yes면 user_id, no면 actor_id
                            user_id VARCHAR(50) NULL,
                            actor_id INT NULL,
                            actor_role ENUM ('main', 'sub', 'director') NOT NULL,
                            gender ENUM ('M', 'F') NOT NULL,
                            is_used BOOLEAN DEFAULT TRUE NOT NULL,
                            FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
                            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
                            FOREIGN KEY (actor_id) REFERENCES actors(actor_id) ON DELETE CASCADE
);

CREATE TABLE event_reviews
(
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    event_id INT NOT NULL,
    rate INT NOT NULL,
    contents TEXT NOT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (event_id) REFERENCES events (event_id)
);


CREATE TABLE event_review_images
(
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    review_id INT NOT NULL,  -- review_id로 이미지를 어떤 리뷰에 연결할지 명시
    img_url VARCHAR(255) NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (review_id) REFERENCES event_reviews (review_id) ON DELETE CASCADE -- review_id와 연결
);


CREATE TABLE user_event_bmarks
(
    user_id VARCHAR(50) NOT NULL,
    event_related INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (event_related) REFERENCES events (event_id),
    PRIMARY KEY (user_id, event_related)
);


CREATE TABLE user_event_likes
(
    user_id VARCHAR(50) NOT NULL,
    event_related INT NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (event_related) REFERENCES events (event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, event_related)
);


-- 결제관련
CREATE TABLE user_points
(
    point_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50),
    point_value INT NOT NULL,
    point_reason VARCHAR(50), -- 왜 포인트가 발생했는가
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE user_coupons
(
    coupon_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50),
    dc_price INT,
    coupon_name VARCHAR(100),
    coupon_details VARCHAR(255),
    requirement VARCHAR(255),
    end_date TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE user_carts
(
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50),
    product_id INT NOT NULL,
    product_type ENUM ('funding', 'event', 'rent', 'oneday') NOT NULL,
    opt_id INT NULL,
    opt_count INT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE user_purchase_lists
(
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50),
    product_id INT NOT NULL,
    product_type ENUM ('funding', 'event', 'rent', 'oneday') NOT NULL,
    opt_id INT NULL,
    opt_count INT NULL,
    point_id INT, -- 사용된 포인트
    coupon_id INT, -- 사용된 쿠폰
    delivery_status ENUM ('구매접수', '배송준비', '배송중', '배송완료') DEFAULT '구매접수',
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (point_id) REFERENCES user_points (point_id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES user_coupons (coupon_id) ON DELETE CASCADE
);


-- 문의 관련
CREATE TABLE user_inquires
(
    inquire_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    inquire_category ENUM ('계정', '결제', '데이터등록', '기타' ) DEFAULT '기타',
    payment_id INT NULL,
    title VARCHAR(255) NOT NULL,
    contents TEXT NOT NULL,
    inquiry_img_url VARCHAR(255) NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    inquiry_state ENUM ('Pending', 'Completed') DEFAULT 'Pending',
    state_updated_at timestamp NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES user_purchase_lists (payment_id) ON DELETE SET NULL
);

CREATE TABLE user_inquire_replies
(
    reply_id INT PRIMARY KEY AUTO_INCREMENT,
    inquire_id INT,
    reply_contents TEXT NOT NULL,
    replied_at timestamp DEFAULT CURRENT_TIMESTAMP,
    counselor_id VARCHAR(255) NOT NULL,
    is_used BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (reply_id) REFERENCES user_inquires (inquire_id) ON DELETE CASCADE
);

-- 더미 데이터 넣기

-- users 테이블에 더미 데이터 추가
INSERT INTO users (user_id, user_email, password, user_name, user_birth, gender)
VALUES ('user1001', 'user1001@artu.com', 'artuartu', '김민수', '1990-01-01', 'M'),
       ('user1002', 'user1002@artu.com', 'artuartu', '이영희', '1992-02-14', 'F'),
       ('user1003', 'user1003@artu.com', 'artuartu', '박철수', '1988-03-25', 'M'),
       ('user1004', 'user1004@artu.com', 'artuartu', '정지영', '1991-04-17', 'F'),
       ('user1005', 'user1005@artu.com', 'artuartu', '조현우', '1987-05-29', 'M'),
       ('user1006', 'user1006@artu.com', 'artuartu', '강다현', '1993-06-11', 'F'),
       ('user1007', 'user1007@artu.com', 'artuartu', '윤석원', '1995-07-23', 'M'),
       ('user1008', 'user1008@artu.com', 'artuartu', '최은지', '1994-08-05', 'F'),
       ('user1009', 'user1009@artu.com', 'artuartu', '임승호', '1996-09-16', 'M'),
       ('user1010', 'user1010@artu.com', 'artuartu', '배수진', '1997-10-28', 'F'),
       ('user1011', 'user1011@artu.com', 'artuartu', '김지훈', '1989-11-30', 'M'),
       ('user1012', 'user1012@artu.com', 'artuartu', '오세진', '1992-12-02', 'F'),
       ('user1013', 'user1013@artu.com', 'artuartu', '이수현', '1990-01-10', 'F'),
       ('user1014', 'user1014@artu.com', 'artuartu', '박준호', '1987-02-12', 'M'),
       ('user1015', 'user1015@artu.com', 'artuartu', '정민규', '1991-03-24', 'M'),
       ('user1016', 'user1016@artu.com', 'artuartu', '최은지', '1995-04-06', 'F'),
       ('user1017', 'user1017@artu.com', 'artuartu', '윤지호', '1996-05-18', 'M'),
       ('user1018', 'user1018@artu.com', 'artuartu', '김미진', '1990-06-01', 'F'),
       ('user1019', 'user1019@artu.com', 'artuartu', '정다혜', '1997-07-13', 'F'),
       ('user1020', 'user1020@artu.com', 'artuartu', '박기영', '1993-08-25', 'M'),
       ('user1021', 'user1021@artu.com', 'artuartu', '이선호', '1988-09-07', 'M'),
       ('user1022', 'user1022@artu.com', 'artuartu', '조은영', '1992-10-19', 'F'),
       ('user1023', 'user1023@artu.com', 'artuartu', '김재원', '1994-11-01', 'M'),
       ('user1024', 'user1024@artu.com', 'artuartu', '오지훈', '1995-12-13', 'M'),
       ('user1025', 'user1025@artu.com', 'artuartu', '정은희', '1993-01-26', 'F'),
       ('user1026', 'user1026@artu.com', 'artuartu', '이진수', '1990-02-08', 'M'),
       ('user1027', 'user1027@artu.com', 'artuartu', '조민경', '1987-03-20', 'F'),
       ('user1028', 'user1028@artu.com', 'artuartu', '박수지', '1992-04-02', 'F'),
       ('user1029', 'user1029@artu.com', 'artuartu', '김윤지', '1993-05-14', 'F'),
       ('user1030', 'user1030@artu.com', 'artuartu', '정현지', '1991-06-26', 'F'),
       ('user1031', 'user1031@artu.com', 'artuartu', '윤상현', '1994-07-08', 'M'),
       ('user1032', 'user1032@artu.com', 'artuartu', '강호정', '1996-08-20', 'M'),
       ('user1033', 'user1033@artu.com', 'artuartu', '이동호', '1995-09-01', 'M'),
       ('user1034', 'user1034@artu.com', 'artuartu', '박혜지', '1989-10-13', 'F'),
       ('user1035', 'user1035@artu.com', 'artuartu', '정미경', '1997-11-25', 'F'),
       ('user1036', 'user1036@artu.com', 'artuartu', '최지원', '1992-12-07', 'M'),
       ('user1037', 'user1037@artu.com', 'artuartu', '오세희', '1990-01-19', 'F'),
       ('user1038', 'user1038@artu.com', 'artuartu', '김세린', '1993-02-21', 'F'),
       ('user1039', 'user1039@artu.com', 'artuartu', '이기현', '1991-03-14', 'M'),
       ('user1040', 'user1040@artu.com', 'artuartu', '정승연', '1997-04-27', 'F'),
       ('user1041', 'user1041@artu.com', 'artuartu', '윤종훈', '1996-05-09', 'M'),
       ('user1042', 'user1042@artu.com', 'artuartu', '강유진', '1987-06-21', 'F'),
       ('user1043', 'user1043@artu.com', 'artuartu', '박도희', '1990-07-03', 'F'),
       ('user1044', 'user1044@artu.com', 'artuartu', '이수미', '1995-08-15', 'F'),
       ('user1045', 'user1045@artu.com', 'artuartu', '정하늘', '1991-09-27', 'F'),
       ('user1046', 'user1046@artu.com', 'artuartu', '김태규', '1988-10-09', 'M'),
       ('user1047', 'user1047@artu.com', 'artuartu', '조선호', '1994-11-21', 'M'),
       ('user1048', 'user1048@artu.com', 'artuartu', '박재형', '1996-12-03', 'M'),
       ('user1049', 'user1049@artu.com', 'artuartu', '정지현', '1997-01-15', 'F'),
       ('user1050', 'user1050@artu.com', 'artuartu', '이정민', '1990-02-27', 'M'),
       ('user1051', 'user1051@artu.com', 'artuartu', '강지호', '1991-03-11', 'M'),
       ('user1052', 'user1052@artu.com', 'artuartu', '박정은', '1993-04-23', 'F'),
       ('user1053', 'user1053@artu.com', 'artuartu', '정하연', '1995-05-05', 'F'),
       ('user1054', 'user1054@artu.com', 'artuartu', '오정환', '1997-06-17', 'M'),
       ('user1055', 'user1055@artu.com', 'artuartu', '이효원', '1994-07-29', 'F'),
       ('user1056', 'user1056@artu.com', 'artuartu', '김상희', '1996-08-10', 'F'),
       ('user1057', 'user1057@artu.com', 'artuartu', '정상호', '1992-09-22', 'M'),
       ('user1058', 'user1058@artu.com', 'artuartu', '윤다희', '1993-10-04', 'F'),
       ('user1059', 'user1059@artu.com', 'artuartu', '박윤수', '1995-11-16', 'M'),
       ('user1060', 'user1060@artu.com', 'artuartu', '정미선', '1987-12-28', 'F'),
       ('user1061', 'user1061@artu.com', 'artuartu', '이영수', '1994-01-09', 'M'),
       ('user1062', 'user1062@artu.com', 'artuartu', '오현수', '1996-02-21', 'M'),
       ('user1063', 'user1063@artu.com', 'artuartu', '강상혁', '1992-03-05', 'M'),
       ('user1064', 'user1064@artu.com', 'artuartu', '정영숙', '1991-04-17', 'F'),
       ('user1065', 'user1065@artu.com', 'artuartu', '김상호', '1993-05-29', 'M'),
       ('user1066', 'user1066@artu.com', 'artuartu', '박정수', '1997-06-10', 'M'),
       ('user1067', 'user1067@artu.com', 'artuartu', '이지은', '1995-07-22', 'F'),
       ('user1068', 'user1068@artu.com', 'artuartu', '정미주', '1992-08-03', 'F'),
       ('user1069', 'user1069@artu.com', 'artuartu', '윤준호', '1994-09-14', 'M'),
       ('user1070', 'user1070@artu.com', 'artuartu', '강상우', '1991-10-26', 'M'),
       ('user1071', 'user1071@artu.com', 'artuartu', '박민영', '1993-11-07', 'F'),
       ('user1072', 'user1072@artu.com', 'artuartu', '이진호', '1996-12-19', 'M'),
       ('user1073', 'user1073@artu.com', 'artuartu', '정승호', '1989-01-31', 'M'),
       ('user1074', 'user1074@artu.com', 'artuartu', '오민수', '1992-02-12', 'M'),
       ('user1075', 'user1075@artu.com', 'artuartu', '강미영', '1997-03-24', 'F'),
       ('user1076', 'user1076@artu.com', 'artuartu', '이현정', '1994-04-05', 'F'),
       ('user1077', 'user1077@artu.com', 'artuartu', '정은경', '1996-05-17', 'F'),
       ('user1078', 'user1078@artu.com', 'artuartu', '김효진', '1990-06-29', 'F'),
       ('user1079', 'user1079@artu.com', 'artuartu', '윤성민', '1995-07-11', 'M'),
       ('user1080', 'user1080@artu.com', 'artuartu', '박지수', '1993-08-23', 'F'),
       ('user1081', 'user1081@artu.com', 'artuartu', '이시연', '1994-09-04', 'F'),
       ('user1082', 'user1082@artu.com', 'artuartu', '정시연', '1991-10-16', 'F'),
       ('user1083', 'user1083@artu.com', 'artuartu', '윤지민', '1996-11-28', 'F'),
       ('user1084', 'user1084@artu.com', 'artuartu', '강서영', '1993-12-10', 'F'),
       ('user1085', 'user1085@artu.com', 'artuartu', '이재호', '1988-01-22', 'M'),
       ('user1086', 'user1086@artu.com', 'artuartu', '정성희', '1991-02-03', 'F'),
       ('user1087', 'user1087@artu.com', 'artuartu', '윤상희', '1995-03-17', 'M'),
       ('user1088', 'user1088@artu.com', 'artuartu', '박채윤', '1996-04-29', 'F'),
       ('user1089', 'user1089@artu.com', 'artuartu', '이효정', '1992-05-11', 'F'),
       ('user1090', 'user1090@artu.com', 'artuartu', '정찬미', '1993-06-23', 'F'),
       ('user1091', 'user1091@artu.com', 'artuartu', '윤해성', '1990-07-05', 'M'),
       ('user1092', 'user1092@artu.com', 'artuartu', '강서진', '1996-08-17', 'F'),
       ('user1093', 'user1093@artu.com', 'artuartu', '이우석', '1994-09-29', 'M'),
       ('user1094', 'user1094@artu.com', 'artuartu', '정슬기', '1991-10-11', 'F'),
       ('user1095', 'user1095@artu.com', 'artuartu', '윤혜정', '1992-11-23', 'F'),
       ('user1096', 'user1096@artu.com', 'artuartu', '강현주', '1997-12-05', 'F'),
       ('user1097', 'user1097@artu.com', 'artuartu', '이상훈', '1993-01-17', 'M'),
       ('user1098', 'user1098@artu.com', 'artuartu', '정유진', '1996-02-28', 'F'),
       ('user1099', 'user1099@artu.com', 'artuartu', '윤정은', '1995-03-12', 'F'),
       ('user1100', 'user1100@artu.com', 'artuartu', '강진수', '1991-04-24', 'M');


-- 프로필 이미지 테이블에 더미 데이터 추가
INSERT INTO user_img (prf_img_url, user_id)
SELECT CONCAT('https://picsum.photos/id/', t.n, '/200'),
       CONCAT('user', t.n)
FROM (SELECT @num := @num + 1 AS n
      FROM information_schema.columns,
           (SELECT @num := 1000) r
      LIMIT 100) t;
-- information_schema.columns는 MySQL에서 숫자 시퀀스를 만들 때 많이 사용되는 테이블. 행의 수가 많아서 LIMIT을 사용해 반복적인 데이터를 쉽게 생성할 수 있음.

INSERT INTO categories (ctgr_name, is_used_main, is_used_oneday)
VALUES ('음악', TRUE, TRUE),
       ('미술', TRUE, TRUE),
       ('춤', TRUE, TRUE),
       ('연기', TRUE, TRUE),
       ('뮤지컬', TRUE, TRUE),
       ('공예', TRUE, TRUE);

INSERT INTO rents (user_id, rt_name, rt_address, rt_capacity, rt_info)
VALUES ('user1001', '대여 홀 A', '중앙로 123', 50, '이벤트 및 모임에 적합한 넓은 홀입니다.'),
       ('user1002', '대여 방 B', '공원길 456', 20, '소규모 회의에 적합한 아늑한 방입니다.'),
       ('user1003', '대여 공간 C', '광화문로 789', 100, '컨퍼런스 및 세미나에 적합한 대형 공간입니다.'),
       ('user1004', '대여 지역 D', '센터로 101', 75, '워크숍 및 교육 세션에 적합한 다용도 공간입니다.'),
       ('user1005', '대여 시설 E', '동쪽길 202', 30, '개인 행사 및 파티에 적합한 쾌적한 시설입니다.');


INSERT INTO events (ctgr_id, title, location, company, address, age_limit, how_long, user_id)
VALUES (1, '음악 콘서트', '서울', '음악사', '서울 강남구 테헤란로 123', '12', 120, 'user1001'),
       (2, '미술 전시회', '부산', '미술관', '부산 해운대구 해운대로 456', '0', 180, 'user1002'),
       (3, '댄스 공연', '대구', '댄스홀', '대구 수성구 무열로 789', '15', 90, 'user1003'),
       (4, '연극 상영', '인천', '연극단', '인천 남동구 예술로 101', '19', 150, 'user1004'),
       (5, '뮤지컬', '광주', '뮤지컬 컴퍼니', '광주 서구 무진대로 202', '0', 200, 'user1005'),
       (1, '재즈 콘서트', '서울', '재즈 공연사', '서울 강남구 도산대로 234', '15', 120, 'user1002'),
       (1, 'K-POP 페스티벌', '서울', '한류 공연사', '서울 송파구 올림픽로 777', '12', 140, 'user1003'),
       (1, '록 페스티벌', '서울', '록 스피릿사', '서울 마포구 홍대로 123', '15', 150, 'user1004'),
       (1, '클래식 페스티벌', '서울', '클래식 컴퍼니', '서울 성동구 왕십리로 999', '12', 160, 'user1005'),
       (2, '미술 전시회', '부산', '미술관', '부산 해운대구 해운대로 456', '0', 180, 'user1001'),
       (2, '현대 미술전', '부산', '현대 미술사', '부산 해운대구 센텀로 789', '0', 120, 'user1001'),
       (2, '서양화 전시', '부산', '서양화 갤러리', '부산 수영구 광안로 888', '12', 180, 'user1001'),
       (2, '일러스트 전시', '부산', '일러스트 갤러리', '부산 진구 동천로 666', '12', 120, 'user1001'),
       (2, '디지털 아트전', '부산', '디지털 아트 선도부', '부산 해운대구 센텀로 321', '15', 120, 'user1001'),
       (3, '댄스 공연', '대구', '댄스홀', '대구 수성구 무열로 789', '15', 90, 'user1001'),
       (3, '스트리트 댄스', '대구', '댄스 스튜디오', '대구 수성구 범어로 456', '15', 100, 'user1001'),
       (3, '탭 댄스', '대구', '탭댄스 공연단', '대구 중구 동성로 999', '12', 90, 'user1001'),
       (3, '브레이크댄스 배틀', '대구', '브레이크댄스 아레나', '대구 북구 칠성로 777', '15', 120, 'user1001'),
       (3, '모던 댄스 공연', '대구', '모던 댄스 지도부', '대구 달서구 월배로 222', '12', 180, 'user1001'),
       (4, '연극 상영', '인천', '연극단', '인천 남동구 예술로 101', '19', 150, 'user1001'),
       (4, '고전 연극', '인천', '고전 연극단', '인천 연수구 예술로 222', '0', 180, 'user1001'),
       (4, '즉흥 연극', '인천', '즉흥 연극단', '인천 계양구 연극로 444', '0', 120, 'user1001'),
       (4, '실험 연극', '인천', '실험 연극단', '인천 동구 에술로 555', '0', 120, 'user1001'),
       (4, '인형극', '인천', '인형극단', '인천 남동구 에술로 606', '0', 90, 'user1001'),
       (5, '뮤지컬', '광주', '뮤지컬 컴퍼니', '광주 서구 무진대로 202', '0', 200, 'user1005'),
       (5, '창작 뮤지컬', '광주', '창작자들', '광주 동구 문화로 333', '12', 180, 'user1001'),
       (5, '어린이 뮤지컬', '광주', '어린이 뮤지컬단', '광주 남구 문화로 555', '0', 120, 'user1001'),
       (5, '고전 뮤지컬', '광주', '고전 뮤지컬단', '광주 북구 문화로 666', '12', 120, 'user1001'),
       (5, '팝 뮤지컬', '광주', '팝 뮤지컬 컴퍼니', '광주 서구 무진대로 808', '15', 180, 'user1001'),
       (1, '락 페스티벌', '서울', '음악사', '서울 강남구 테헤란로 123', '12', 120, 'user1001'),
       (2, '현대 미술전', '부산', '미술관', '부산 해운대구 해운대로 456', '0', 180, 'user1002'),
       (3, '힙합 공연', '대구', '힙합 그룹', '대구 수성구 무열로 789', '15', 90, 'user1003'),
       (4, '클래식 음악회', '인천', '음악단', '인천 남동구 예술로 101', '19', 150, 'user1004'),
       (5, '어린이 뮤지컬', '광주', '뮤지컬 컴퍼니', '광주 서구 무진대로 202', '0', 200, 'user1005'),
       (1, '재즈 페스티벌', '서울', '재즈 공연사', '서울 강남구 도산대로 234', '15', 120, 'user1006'),
       (2, '서양화 전시', '부산', '갤러리', '부산 해운대구 센텀로 999', '12', 180, 'user1007'),
       (3, '댄스 챔피언십', '대구', '댄스 아카데미', '대구 수성구 범어로 456', '15', 120, 'user1008'),
       (4, '연극 공연', '인천', '연극단체', '인천 계양구 예술로 777', '0', 180, 'user1009'),
       (5, '창작 뮤지컬', '광주', '창작 뮤지컬단', '광주 북구 문화로 333', '12', 180, 'user1010'),
       (1, '국악 공연', '서울', '국악 연구소', '서울 종로구 세종대로 100', '15', 100, 'user1011'),
       (2, '디지털 아트 전시회', '부산', '디지털 아트 갤러리', '부산 해운대구 센텀로 321', '0', 150, 'user1012'),
       (3, '스트리트 댄스 배틀', '대구', '스트리트 댄스 팀', '대구 남구 대명로 345', '12', 90, 'user1013'),
       (4, '고전 연극', '인천', '고전 연극단', '인천 남동구 예술로 555', '0', 120, 'user1014'),
       (5, '어린이 뮤지컬', '광주', '어린이 뮤지컬단', '광주 남구 문화로 444', '0', 120, 'user1015'),
       (1, '팝 음악 페스티벌', '서울', '팝 공연사', '서울 마포구 홍대로 789', '15', 150, 'user1016'),
       (2, '한국 미술 전시회', '부산', '한국 미술 갤러리', '부산 수영구 광안로 567', '0', 200, 'user1017'),
       (3, '탭 댄스 공연', '대구', '댄스 스튜디오', '대구 동구 동성로 222', '12', 90, 'user1018'),
       (4, '연극 축제', '인천', '연극 연합', '인천 연수구 예술로 333', '15', 180, 'user1019'),
       (5, '클래식 뮤지컬', '광주', '뮤지컬 컴퍼니', '광주 서구 무진대로 500', '12', 150, 'user1020'),
       (1, '트로트 공연', '서울', '트로트 앙상블', '서울 동대문구 왕십리로 88', '0', 120, 'user1021'),
       (2, '디지털 아트전', '부산', '디지털 아트 스튜디오', '부산 남구 용호로 100', '15', 180, 'user1022'),
       (3, '브레이크댄스 배틀', '대구', '댄스 아카데미', '대구 달서구 월배로 222', '15', 100, 'user1023'),
       (4, '실험 연극', '인천', '실험 연극단', '인천 남구 에술로 444', '0', 120, 'user1024'),
       (5, '뮤지컬 공연', '광주', '뮤지컬 예술단', '광주 북구 문화로 888', '12', 150, 'user1025'),
       (1, '오페라 공연', '서울', '오페라 극단', '서울 종로구 세종대로 55', '0', 180, 'user1026'),
       (2, '서양화 전시', '부산', '서양화 갤러리', '부산 수영구 광안로 666', '12', 180, 'user1027'),
       (3, '힙합 댄스', '대구', '댄스 그룹', '대구 서구 달성로 123', '15', 100, 'user1028'),
       (4, '연극 공연', '인천', '연극단', '인천 남동구 예술로 500', '0', 180, 'user1029'),
       (5, '어린이 뮤지컬', '광주', '어린이 뮤지컬단', '광주 동구 문화로 111', '0', 120, 'user1030'),
       (1, '고전 음악 공연', '서울', '고전 음악회', '서울 강남구 논현로 121', '15', 120, 'user1031'),
       (2, '팝 아트 전시', '부산', '팝 아트 갤러리', '부산 해운대구 센텀로 500', '0', 150, 'user1032'),
       (3, '댄스 페스티벌', '대구', '댄스 스튜디오', '대구 남구 용산로 500', '15', 90, 'user1033'),
       (4, '즉흥 연극', '인천', '즉흥 연극단', '인천 남동구 예술로 600', '0', 120, 'user1034'),
       (5, '뮤지컬 공연', '광주', '뮤지컬 공연단', '광주 서구 문화로 333', '0', 180, 'user1035'),
       (1, '크로스오버 공연', '서울', '크로스오버 음악사', '서울 마포구 홍대로 800', '12', 150, 'user1036'),
       (2, '현대 미술 전시회', '부산', '현대 미술관', '부산 해운대구 센텀로 800', '0', 180, 'user1037'),
       (3, '비보이 배틀', '대구', '비보이 팀', '대구 서구 내당로 222', '15', 100, 'user1038'),
       (4, '연극 공연', '인천', '연극 공연단', '인천 동구 예술로 777', '0', 120, 'user1039'),
       (5, '뮤지컬', '광주', '광주 뮤지컬 단체', '광주 북구 문화로 222', '12', 120, 'user1040');

-- 10개의 예시 INSERT문 (이 값을 원하는 수량만큼 확장할 수 있습니다)
INSERT INTO chatrooms (is_private, related_event)
VALUES (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50))),
       (TRUE, NULL),
       (FALSE, FLOOR(1 + (RAND() * 50)));


INSERT INTO oneday_classes (tchr_id, od_name, ctgr_id, location, address, min_mem, max_mem, is_aproved, is_used)
VALUES ('user1001', '원데이 음악 클래스', 1, '서울', '서울 강남구 테헤란로 123', 5, 20, FALSE, TRUE),
       ('user1002', '원데이 미술 클래스', 2, '부산', '부산 해운대구 해운대로 456', 3, 15, FALSE, TRUE),
       ('user1003', '원데이 댄스 클래스', 3, '대구', '대구 수성구 무열로 789', 8, 25, FALSE, TRUE),
       ('user1004', '원데이 연기 클래스', 4, '인천', '인천 남동구 예술로 101', 4, 12, FALSE, TRUE),
       ('user1005', '원데이 뮤지컬 클래스', 5, '광주', '광주 서구 무진대로 202', 6, 18, FALSE, TRUE);

INSERT INTO agency (name, address)
VALUES ('SM 엔터테인먼트', '서울특별시 강남구 삼성로 674'),
       ('JYP 엔터테인먼트', '서울특별시 마포구 월드컵로 14길 10'),
       ('YG 엔터테인먼트', '서울특별시 마포구 합정동 368-12'),
       ('빅히트 엔터테인먼트', '서울특별시 강남구 논현로 508'),
       ('FNC 엔터테인먼트', '서울특별시 강남구 삼성로 85길 7'),
       ('큐브 엔터테인먼트', '서울특별시 강남구 논현로 728'),
       ('스타쉽 엔터테인먼트', '서울특별시 마포구 양화로 45길 13'),
       ('DSP 미디어', '서울특별시 용산구 한강대로 98'),
       ('울림 엔터테인먼트', '서울특별시 강남구 언주로 725'),
       ('TS 엔터테인먼트', '서울특별시 송파구 마천로 89길 8'),
       ('키위미디어그룹', '서울특별시 마포구 월드컵북로 3길 17'),
       ('플레디스 엔터테인먼트', '서울특별시 강남구 논현로 716'),
       ('H2미디어', '서울특별시 강남구 학동로 201'),
       ('KQ 엔터테인먼트', '서울특별시 강남구 도산대로 318'),
       ('WM 엔터테인먼트', '서울특별시 마포구 성산로 100'),
       ('뮤직웍스', '서울특별시 중구 퇴계로 4길 28'),
       ('엠넷미디어', '서울특별시 강남구 논현로 120'),
       ('인터파크 뮤직', '서울특별시 강남구 역삼로 92'),
       ('SM C&C', '서울특별시 강남구 언주로 149길 16'),
       ('V-Learn 엔터테인먼트', '서울특별시 송파구 잠실로 141'),
       ('싸이더스HQ', '서울특별시 강남구 삼성로 523'),
       ('미스틱스토리', '서울특별시 강남구 논현로 720'),
       ('소니 뮤직 코리아', '서울특별시 용산구 한강대로 395'),
       ('영광 엔터테인먼트', '서울특별시 송파구 중대로 38'),
       ('와이지플러스', '서울특별시 마포구 월드컵북로 7길 19'),
       ('에잇디 크리에이티브', '서울특별시 강남구 선릉로 93'),
       ('로엔 엔터테인먼트', '서울특별시 강남구 역삼로 457'),
       ('아이오케이 엔터테인먼트', '서울특별시 강남구 봉은사로 554'),
       ('플로버 엔터테인먼트', '서울특별시 마포구 상수동 308-12'),
       ('티오피미디어', '서울특별시 강남구 논현로 523');

INSERT INTO actors (name, prf_img_id, bday, agency_id, is_joined, is_used)
VALUES ('김수현', 12, '1988-02-16', 1, 1, 1),
       ('송중기', 34, '1985-09-19', 2, 0, 1),
       ('박보검', 45, '1993-06-16', 3, 1, 0),
       ('이민호', 23, '1987-06-22', 4, 0, 1),
       ('전지현', 56, '1981-10-30', 5, 1, 1),
       ('한효주', 67, '1987-02-22', 6, 1, 0),
       ('수지', 89, '1994-10-10', 7, 0, 1),
       ('아이유', 21, '1993-05-16', 8, 1, 1),
       ('정해인', 12, '1988-04-20', 9, 0, 0),
       ('유연석', 34, '1984-04-11', 10, 1, 1),
       ('이동욱', 13, '1981-11-06', 2, 1, 1),
       ('고수', 14, '1981-07-26', 1, 0, 1),
       ('조인성', 15, '1981-07-28', 3, 1, 0),
       ('김태희', 16, '1980-03-29', 4, 0, 1),
       ('한석규', 17, '1964-11-03', 5, 1, 1),
       ('송혜교', 18, '1981-11-22', 6, 0, 0),
       ('이영애', 19, '1971-01-12', 7, 1, 1),
       ('김희선', 20, '1975-05-05', 8, 1, 0),
       ('박신혜', 22, '1990-02-18', 9, 0, 1),
       ('이민정', 24, '1982-02-16', 10, 1, 1),
       ('김소연', 25, '1980-11-06', 1, 1, 0),
       ('전도연', 26, '1973-02-11', 2, 0, 1),
       ('윤아', 27, '1990-05-30', 3, 1, 1),
       ('소지섭', 28, '1977-11-04', 4, 1, 0),
       ('이청아', 29, '1985-03-13', 5, 0, 1),
       ('한지민', 30, '1982-10-05', 6, 1, 1),
       ('정유미', 31, '1983-02-05', 7, 0, 0),
       ('박민영', 32, '1986-02-04', 8, 1, 1),
       ('배수지', 33, '1994-10-10', 9, 1, 0),
       ('김지원', 35, '1992-11-19', 10, 0, 1),
       ('조여정', 36, '1981-11-10', 1, 1, 0),
       ('김우빈', 37, '1989-07-16', 2, 0, 1),
       ('장나라', 38, '1981-03-18', 3, 1, 1),
       ('박세영', 39, '1989-08-04', 4, 1, 0),
       ('유인나', 40, '1982-06-05', 5, 0, 1),
       ('홍수현', 41, '1981-02-15', 6, 1, 0),
       ('김동욱', 42, '1982-07-14', 7, 0, 1),
       ('오연서', 43, '1987-06-22', 8, 1, 0),
       ('문채원', 44, '1986-11-13', 9, 0, 1),
       ('이상엽', 46, '1982-12-08', 10, 1, 1),
       ('김정은', 47, '1985-04-09', 1, 1, 0),
       ('한상진', 48, '1980-12-28', 2, 0, 1),
       ('차태현', 49, '1976-03-25', 3, 1, 0),
       ('유준상', 50, '1969-03-28', 4, 1, 1),
       ('이선균', 51, '1975-03-02', 5, 0, 1),
       ('김성균', 52, '1980-04-27', 6, 1, 0),
       ('임수정', 53, '1979-07-11', 7, 0, 1),
       ('강소라', 54, '1990-02-18', 8, 1, 1),
       ('이기우', 55, '1984-02-05', 9, 0, 0),
       ('이상우', 58, '1987-07-22', 10, 1, 1);


INSERT INTO actors_images (img_url, actor_id)
SELECT CONCAT('https://picsum.photos/id/', t.n + 100, '/200'),
       t.n
FROM (SELECT @num := @num + 1 AS n
      FROM information_schema.columns,
           (SELECT @num := 2) r
      LIMIT 48) t;


INSERT INTO event_cast (event_id, is_joined, user_id, actor_id, actor_role, gender)
VALUES (1, TRUE, NULL, 1, 'main', 'M'),
       (2, TRUE, NULL, 2, 'sub', 'F'),
       (3, TRUE, NULL, 3, 'director', 'M'),
       (4, TRUE, NULL, 4, 'main', 'F'),
       (5, TRUE, NULL, 5, 'sub', 'M'),
       (6, TRUE, NULL, 6, 'director', 'F'),
       (7, TRUE, NULL, 7, 'main', 'M'),
       (8, TRUE, NULL, 8, 'sub', 'F'),
       (9, TRUE, NULL, 9, 'director', 'M'),
       (10, TRUE, NULL, 10, 'main', 'F'),
       (11, FALSE, 'user1001', NULL, 'main', 'M'),
       (12, FALSE, 'user1002', NULL, 'sub', 'F'),
       (13, FALSE, 'user1003', NULL, 'director', 'M'),
       (14, FALSE, 'user1004', NULL, 'main', 'F'),
       (15, FALSE, 'user1005', NULL, 'sub', 'M'),
       (16, FALSE, 'user1006', NULL, 'director', 'F'),
       (17, FALSE, 'user1007', NULL, 'main', 'M'),
       (18, FALSE, 'user1008', NULL, 'sub', 'F'),
       (19, FALSE, 'user1009', NULL, 'director', 'M'),
       (20, FALSE, 'user1010', NULL, 'main', 'F'),
       (21, TRUE, NULL, 11, 'sub', 'M'),
       (22, TRUE, NULL, 12, 'director', 'F'),
       (23, TRUE, NULL, 13, 'main', 'M'),
       (24, TRUE, NULL, 14, 'sub', 'F'),
       (25, TRUE, NULL, 15, 'director', 'M'),
       (26, TRUE, NULL, 16, 'main', 'F'),
       (27, TRUE, NULL, 17, 'sub', 'M'),
       (28, TRUE, NULL, 18, 'director', 'F'),
       (29, TRUE, NULL, 19, 'main', 'M'),
       (30, TRUE, NULL, 20, 'sub', 'F'),
       (31, FALSE, 'user1011', NULL, 'main', 'M'),
       (32, FALSE, 'user1012', NULL, 'sub', 'F'),
       (33, FALSE, 'user1013', NULL, 'director', 'M'),
       (34, FALSE, 'user1014', NULL, 'main', 'F'),
       (35, FALSE, 'user1015', NULL, 'sub', 'M'),
       (36, FALSE, 'user1016', NULL, 'director', 'F'),
       (37, FALSE, 'user1017', NULL, 'main', 'M'),
       (38, FALSE, 'user1018', NULL, 'sub', 'F'),
       (39, FALSE, 'user1019', NULL, 'director', 'M'),
       (40, FALSE, 'user1020', NULL, 'main', 'F'),
       (41, TRUE, NULL, 21, 'sub', 'M'),
       (42, TRUE, NULL, 22, 'director', 'F'),
       (43, TRUE, NULL, 23, 'main', 'M'),
       (44, TRUE, NULL, 24, 'sub', 'F'),
       (45, TRUE, NULL, 25, 'director', 'M'),
       (46, TRUE, NULL, 26, 'main', 'F'),
       (47, TRUE, NULL, 27, 'sub', 'M'),
       (48, TRUE, NULL, 28, 'director', 'F'),
       (49, TRUE, NULL, 29, 'main', 'M'),
       (50, TRUE, NULL, 30, 'sub', 'F');


INSERT INTO event_dates (event_id, event_date, event_price)
VALUES
-- event_id 3
(3, '2025-03-26 10:00:00', 15000),
(3, '2025-03-27 10:00:00', 15500),
(3, '2025-03-28 10:00:00', 16000),
(3, '2025-03-29 10:00:00', 17000),
(3, '2025-03-30 10:00:00', 18000),

-- event_id 6
(6, '2025-03-26 14:00:00', 19000),
(6, '2025-03-27 14:00:00', 20000),
(6, '2025-03-28 14:00:00', 21000),
(6, '2025-03-29 14:00:00', 22000),
(6, '2025-03-30 14:00:00', 23000),

-- event_id 9
(9, '2025-03-26 16:00:00', 18000),
(9, '2025-03-27 16:00:00', 19000),
(9, '2025-03-28 16:00:00', 20000),
(9, '2025-03-29 16:00:00', 21000),
(9, '2025-03-30 16:00:00', 22000),

-- event_id 12
(12, '2025-03-26 18:00:00', 25000),
(12, '2025-03-27 18:00:00', 26000),
(12, '2025-03-28 18:00:00', 27000),
(12, '2025-03-29 18:00:00', 28000),
(12, '2025-03-30 18:00:00', 29000),

-- event_id 15
(15, '2025-03-26 20:00:00', 30000),
(15, '2025-03-27 20:00:00', 31000),
(15, '2025-03-28 20:00:00', 32000),
(15, '2025-03-29 20:00:00', 33000),
(15, '2025-03-30 20:00:00', 34000),

-- event_id 18
(18, '2025-03-26 10:00:00', 12000),
(18, '2025-03-27 10:00:00', 13000),
(18, '2025-03-28 10:00:00', 14000),
(18, '2025-03-29 10:00:00', 15000),
(18, '2025-03-30 10:00:00', 16000),

-- event_id 21
(21, '2025-03-26 14:00:00', 16000),
(21, '2025-03-27 14:00:00', 17000),
(21, '2025-03-28 14:00:00', 18000),
(21, '2025-03-29 14:00:00', 19000),
(21, '2025-03-30 14:00:00', 20000),

-- event_id 24
(24, '2025-03-26 16:00:00', 23000),
(24, '2025-03-27 16:00:00', 24000),
(24, '2025-03-28 16:00:00', 25000),
(24, '2025-03-29 16:00:00', 26000),
(24, '2025-03-30 16:00:00', 27000),

-- event_id 27
(27, '2025-03-26 18:00:00', 28000),
(27, '2025-03-27 18:00:00', 29000),
(27, '2025-03-28 18:00:00', 30000),
(27, '2025-03-29 18:00:00', 31000),
(27, '2025-03-30 18:00:00', 32000),

-- event_id 30
(30, '2025-03-26 20:00:00', 33000),
(30, '2025-03-27 20:00:00', 34000),
(30, '2025-03-28 20:00:00', 35000),
(30, '2025-03-29 20:00:00', 36000),
(30, '2025-03-30 20:00:00', 37000),

-- event_id 33
(33, '2025-03-26 10:00:00', 11000),
(33, '2025-03-27 10:00:00', 12000),
(33, '2025-03-28 10:00:00', 13000),
(33, '2025-03-29 10:00:00', 14000),
(33, '2025-03-30 10:00:00', 15000),

-- event_id 36
(36, '2025-03-26 14:00:00', 15000),
(36, '2025-03-27 14:00:00', 16000),
(36, '2025-03-28 14:00:00', 17000),
(36, '2025-03-29 14:00:00', 18000),
(36, '2025-03-30 14:00:00', 19000),

-- event_id 39
(39, '2025-03-26 16:00:00', 20000),
(39, '2025-03-27 16:00:00', 21000),
(39, '2025-03-28 16:00:00', 22000),
(39, '2025-03-29 16:00:00', 23000),
(39, '2025-03-30 16:00:00', 24000),

-- event_id 42
(42, '2025-03-26 18:00:00', 25000),
(42, '2025-03-27 18:00:00', 26000),
(42, '2025-03-28 18:00:00', 27000),
(42, '2025-03-29 18:00:00', 28000),
(42, '2025-03-30 18:00:00', 29000),

-- event_id 45
(45, '2025-03-26 20:00:00', 30000),
(45, '2025-03-27 20:00:00', 31000),
(45, '2025-03-28 20:00:00', 32000),
(45, '2025-03-29 20:00:00', 33000),
(45, '2025-03-30 20:00:00', 34000),

-- event_id 48
(48, '2025-03-26 10:00:00', 12000),
(48, '2025-03-27 10:00:00', 13000),
(48, '2025-03-28 10:00:00', 14000),
(48, '2025-03-29 10:00:00', 15000),
(48, '2025-03-30 10:00:00', 16000),

-- event_id 51
(51, '2025-03-26 14:00:00', 17000),
(51, '2025-03-27 14:00:00', 18000),
(51, '2025-03-28 14:00:00', 19000),
(51, '2025-03-29 14:00:00', 20000),
(51, '2025-03-30 14:00:00', 21000),

-- event_id 54
(54, '2025-03-26 16:00:00', 22000),
(54, '2025-03-27 16:00:00', 23000),
(54, '2025-03-28 16:00:00', 24000),
(54, '2025-03-29 16:00:00', 25000),
(54, '2025-03-30 16:00:00', 26000),

-- event_id 57
(57, '2025-03-26 18:00:00', 27000),
(57, '2025-03-27 18:00:00', 28000),
(57, '2025-03-28 18:00:00', 29000),
(57, '2025-03-29 18:00:00', 30000),
(57, '2025-03-30 18:00:00', 31000),

-- event_id 60
(60, '2025-03-26 20:00:00', 32000),
(60, '2025-03-27 20:00:00', 33000),
(60, '2025-03-28 20:00:00', 34000),
(60, '2025-03-29 20:00:00', 35000),
(60, '2025-03-30 20:00:00', 36000);

INSERT INTO event_images (event_id, img_url, img_order)
VALUES
-- event_id 1
(1, 'https://picsum.photos/id/1/200', 0),
(1, 'https://picsum.photos/id/2/200', 1),

-- event_id 2
(2, 'https://picsum.photos/id/3/200', 0),
(2, 'https://picsum.photos/id/4/200', 1),

-- event_id 3
(3, 'https://picsum.photos/id/5/200', 0),
(3, 'https://picsum.photos/id/6/200', 1),

-- event_id 4
(4, 'https://picsum.photos/id/7/200', 0),
(4, 'https://picsum.photos/id/8/200', 1),

-- event_id 5
(5, 'https://picsum.photos/id/9/200', 0),
(5, 'https://picsum.photos/id/10/200', 1),

-- event_id 6
(6, 'https://picsum.photos/id/11/200', 0),
(6, 'https://picsum.photos/id/12/200', 1),

-- event_id 7
(7, 'https://picsum.photos/id/13/200', 0),
(7, 'https://picsum.photos/id/14/200', 1),

-- event_id 8
(8, 'https://picsum.photos/id/15/200', 0),
(8, 'https://picsum.photos/id/16/200', 1),

-- event_id 9
(9, 'https://picsum.photos/id/17/200', 0),
(9, 'https://picsum.photos/id/18/200', 1),

-- event_id 10
(10, 'https://picsum.photos/id/19/200', 0),
(10, 'https://picsum.photos/id/20/200', 1),

-- event_id 11
(11, 'https://picsum.photos/id/21/200', 0),
(11, 'https://picsum.photos/id/22/200', 1),

-- event_id 12
(12, 'https://picsum.photos/id/23/200', 0),
(12, 'https://picsum.photos/id/24/200', 1),

-- event_id 13
(13, 'https://picsum.photos/id/25/200', 0),
(13, 'https://picsum.photos/id/26/200', 1),

-- event_id 14
(14, 'https://picsum.photos/id/27/200', 0),
(14, 'https://picsum.photos/id/28/200', 1),

-- event_id 15
(15, 'https://picsum.photos/id/29/200', 0),
(15, 'https://picsum.photos/id/30/200', 1),

-- event_id 16
(16, 'https://picsum.photos/id/31/200', 0),
(16, 'https://picsum.photos/id/32/200', 1),

-- event_id 17
(17, 'https://picsum.photos/id/33/200', 0),
(17, 'https://picsum.photos/id/34/200', 1),

-- event_id 18
(18, 'https://picsum.photos/id/35/200', 0),
(18, 'https://picsum.photos/id/36/200', 1),

-- event_id 19
(19, 'https://picsum.photos/id/37/200', 0),
(19, 'https://picsum.photos/id/38/200', 1),

-- event_id 20
(20, 'https://picsum.photos/id/39/200', 0),
(20, 'https://picsum.photos/id/40/200', 1),

-- event_id 21
(21, 'https://picsum.photos/id/41/200', 0),
(21, 'https://picsum.photos/id/42/200', 1),

-- event_id 22
(22, 'https://picsum.photos/id/43/200', 0),
(22, 'https://picsum.photos/id/44/200', 1),

-- event_id 23
(23, 'https://picsum.photos/id/45/200', 0),
(23, 'https://picsum.photos/id/46/200', 1),

-- event_id 24
(24, 'https://picsum.photos/id/47/200', 0),
(24, 'https://picsum.photos/id/48/200', 1),

-- event_id 25
(25, 'https://picsum.photos/id/49/200', 0),
(25, 'https://picsum.photos/id/50/200', 1),

-- event_id 26
(26, 'https://picsum.photos/id/51/200', 0),
(26, 'https://picsum.photos/id/52/200', 1),

-- event_id 27
(27, 'https://picsum.photos/id/53/200', 0),
(27, 'https://picsum.photos/id/54/200', 1),

-- event_id 28
(28, 'https://picsum.photos/id/55/200', 0),
(28, 'https://picsum.photos/id/56/200', 1),

-- event_id 29
(29, 'https://picsum.photos/id/57/200', 0),
(29, 'https://picsum.photos/id/58/200', 1),

-- event_id 30
(30, 'https://picsum.photos/id/59/200', 0),
(30, 'https://picsum.photos/id/60/200', 1),

-- event_id 31
(31, 'https://picsum.photos/id/61/200', 0),
(31, 'https://picsum.photos/id/62/200', 1),

-- event_id 32
(32, 'https://picsum.photos/id/63/200', 0),
(32, 'https://picsum.photos/id/64/200', 1),

-- event_id 33
(33, 'https://picsum.photos/id/65/200', 0),
(33, 'https://picsum.photos/id/66/200', 1),

-- event_id 34
(34, 'https://picsum.photos/id/67/200', 0),
(34, 'https://picsum.photos/id/68/200', 1),

-- event_id 35
(35, 'https://picsum.photos/id/69/200', 0),
(35, 'https://picsum.photos/id/70/200', 1),

-- event_id 36
(36, 'https://picsum.photos/id/71/200', 0),
(36, 'https://picsum.photos/id/72/200', 1),

-- event_id 37
(37, 'https://picsum.photos/id/73/200', 0),
(37, 'https://picsum.photos/id/74/200', 1),

-- event_id 38
(38, 'https://picsum.photos/id/75/200', 0),
(38, 'https://picsum.photos/id/76/200', 1),

-- event_id 39
(39, 'https://picsum.photos/id/77/200', 0),
(39, 'https://picsum.photos/id/78/200', 1),

-- event_id 40
(40, 'https://picsum.photos/id/79/200', 0),
(40, 'https://picsum.photos/id/80/200', 1),

-- event_id 41
(41, 'https://picsum.photos/id/81/200', 0),
(41, 'https://picsum.photos/id/82/200', 1),

-- event_id 42
(42, 'https://picsum.photos/id/83/200', 0),
(42, 'https://picsum.photos/id/84/200', 1),

-- event_id 43
(43, 'https://picsum.photos/id/85/200', 0),
(43, 'https://picsum.photos/id/86/200', 1),

-- event_id 44
(44, 'https://picsum.photos/id/87/200', 0),
(44, 'https://picsum.photos/id/88/200', 1),

-- event_id 45
(45, 'https://picsum.photos/id/89/200', 0),
(45, 'https://picsum.photos/id/90/200', 1),

-- event_id 46
(46, 'https://picsum.photos/id/91/200', 0),
(46, 'https://picsum.photos/id/92/200', 1),

-- event_id 47
(47, 'https://picsum.photos/id/93/200', 0),
(47, 'https://picsum.photos/id/94/200', 1),

-- event_id 48
(48, 'https://picsum.photos/id/95/200', 0),
(48, 'https://picsum.photos/id/96/200', 1),

-- event_id 49
(49, 'https://picsum.photos/id/97/200', 0),
(49, 'https://picsum.photos/id/98/200', 1),

-- event_id 50
(50, 'https://picsum.photos/id/99/200', 0),
(50, 'https://picsum.photos/id/100/200', 1),

-- event_id 51
(51, 'https://picsum.photos/id/101/200', 0),
(51, 'https://picsum.photos/id/102/200', 1),

-- event_id 52
(52, 'https://picsum.photos/id/103/200', 0),
(52, 'https://picsum.photos/id/104/200', 1),

-- event_id 53
(53, 'https://picsum.photos/id/105/200', 0),
(53, 'https://picsum.photos/id/106/200', 1),

-- event_id 54
(54, 'https://picsum.photos/id/107/200', 0),
(54, 'https://picsum.photos/id/108/200', 1),

-- event_id 55
(55, 'https://picsum.photos/id/109/200', 0),
(55, 'https://picsum.photos/id/110/200', 1),

-- event_id 56
(56, 'https://picsum.photos/id/111/200', 0),
(56, 'https://picsum.photos/id/112/200', 1),

-- event_id 57
(57, 'https://picsum.photos/id/113/200', 0),
(57, 'https://picsum.photos/id/114/200', 1),

-- event_id 58
(58, 'https://picsum.photos/id/115/200', 0),
(58, 'https://picsum.photos/id/116/200', 1),

-- event_id 59
(59, 'https://picsum.photos/id/117/200', 0),
(59, 'https://picsum.photos/id/118/200', 1),

-- event_id 60
(60, 'https://picsum.photos/id/119/200', 0),
(60, 'https://picsum.photos/id/120/200', 1),

-- event_id 61
(61, 'https://picsum.photos/id/121/200', 0),
(61, 'https://picsum.photos/id/122/200', 1),

-- event_id 62
(62, 'https://picsum.photos/id/123/200', 0),
(62, 'https://picsum.photos/id/124/200', 1),

-- event_id 63
(63, 'https://picsum.photos/id/125/200', 0),
(63, 'https://picsum.photos/id/126/200', 1),

-- event_id 64
(64, 'https://picsum.photos/id/127/200', 0),
(64, 'https://picsum.photos/id/128/200', 1),

-- event_id 65
(65, 'https://picsum.photos/id/129/200', 0),
(65, 'https://picsum.photos/id/130/200', 1),

-- event_id 66
(66, 'https://picsum.photos/id/131/200', 0),
(66, 'https://picsum.photos/id/132/200', 1),

-- event_id 67
(67, 'https://picsum.photos/id/133/200', 0),
(67, 'https://picsum.photos/id/134/200', 1),

-- event_id 68
(68, 'https://picsum.photos/id/135/200', 0),
(68, 'https://picsum.photos/id/136/200', 1),

-- event_id 69
(69, 'https://picsum.photos/id/137/200', 0),
(69, 'https://picsum.photos/id/138/200', 1);

INSERT INTO event_detail_images (event_id, img_url, img_order)
VALUES (1, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (1, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (2, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (2, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (3, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (3, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (4, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (4, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (5, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (5, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (6, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (6, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (7, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (7, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (8, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (8, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (9, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (9, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (10, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (10, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (11, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (11, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (12, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (12, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (13, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (13, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (14, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (14, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (15, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (15, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (16, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (16, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (17, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (17, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (18, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (18, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (19, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (19, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (20, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (20, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (21, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (21, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (22, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (22, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (23, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (23, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (24, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (24, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (25, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (25, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (26, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (26, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (27, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (27, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (28, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (28, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (29, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (29, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (30, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (30, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (31, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (31, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (32, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (32, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (33, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (33, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (34, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (34, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (35, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (35, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (36, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (36, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (37, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (37, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (38, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (38, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (39, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (39, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (40, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (40, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (41, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (41, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (42, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (42, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (43, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (43, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (44, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (44, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (45, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (45, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (46, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (46, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (47, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (47, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (48, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (48, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (49, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (49, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (50, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (50, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (51, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (51, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (52, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (52, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (53, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (53, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (54, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (54, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (55, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (55, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (56, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (56, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (57, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (57, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (58, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (58, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (59, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (59, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (60, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (60, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (61, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (61, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (62, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (62, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (63, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (63, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (64, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (64, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (65, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (65, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (66, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (66, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (67, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (67, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (68, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (68, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1),
       (69, 'https://dummyimage.com/500x1000/808080/fff.jpg', 0),
       (69, 'https://dummyimage.com/500x1000/808080/fff.jpg', 1);

INSERT INTO event_options (date_id, opt_name, opt_price, goal_min, dc_rate)
VALUES (1, 'VIP 좌석', 12000, 20, 10),
       (2, '일반 좌석', 8000, 15, 8),
       (3, '프리미엄 좌석', 15000, 25, 12),
       (4, '스탠다드 좌석', 10000, 18, 5),
       (5, 'VIP 좌석', 13000, 22, 15),
       (6, '프리미엄 좌석', 14000, 20, 10),
       (7, '일반 좌석', 7500, 14, 6),
       (8, '스탠다드 좌석', 9000, 18, 7),
       (9, 'VIP 좌석', 12500, 19, 11),
       (10, '일반 좌석', 8500, 16, 9),
       (11, '프리미엄 좌석', 14500, 23, 14),
       (12, '스탠다드 좌석', 9500, 17, 6),
       (13, 'VIP 좌석', 13500, 21, 13),
       (14, '프리미엄 좌석', 15500, 26, 15),
       (15, '일반 좌석', 8000, 15, 5),
       (16, '스탠다드 좌석', 9000, 18, 7),
       (17, 'VIP 좌석', 12500, 20, 10),
       (18, '프리미엄 좌석', 15000, 25, 13),
       (19, '일반 좌석', 7800, 14, 6),
       (20, '스탠다드 좌석', 9500, 17, 8),
       (21, 'VIP 좌석', 13000, 22, 11),
       (22, '일반 좌석', 8200, 16, 9),
       (23, '프리미엄 좌석', 14500, 24, 12),
       (24, '스탠다드 좌석', 9800, 18, 7),
       (25, 'VIP 좌석', 13700, 20, 13),
       (26, '프리미엄 좌석', 15000, 25, 14),
       (27, '일반 좌석', 7800, 15, 6),
       (28, '스탠다드 좌석', 9300, 17, 7),
       (29, 'VIP 좌석', 12600, 21, 10),
       (30, '프리미엄 좌석', 14500, 23, 13),
       (31, '일반 좌석', 8200, 16, 8),
       (32, '스탠다드 좌석', 9500, 18, 6),
       (33, 'VIP 좌석', 13200, 20, 12),
       (34, '프리미엄 좌석', 14800, 22, 15),
       (35, '일반 좌석', 8500, 15, 5),
       (36, '스탠다드 좌석', 9800, 18, 8),
       (37, 'VIP 좌석', 12700, 21, 10),
       (38, '프리미엄 좌석', 14600, 24, 14),
       (39, '일반 좌석', 7900, 15, 7),
       (40, '스탠다드 좌석', 9100, 17, 7),
       (41, 'VIP 좌석', 13300, 22, 11),
       (42, '프리미엄 좌석', 15000, 25, 13),
       (43, '일반 좌석', 8300, 16, 9),
       (44, '스탠다드 좌석', 9600, 18, 8),
       (45, 'VIP 좌석', 12900, 20, 12),
       (46, '프리미엄 좌석', 14900, 23, 15),
       (47, '일반 좌석', 7800, 15, 6),
       (48, '스탠다드 좌석', 9400, 17, 6),
       (49, 'VIP 좌석', 13600, 22, 10),
       (50, '프리미엄 좌석', 15000, 24, 14),
       (51, '일반 좌석', 8000, 15, 8),
       (52, '스탠다드 좌석', 9700, 18, 7),
       (53, 'VIP 좌석', 12800, 20, 11),
       (54, '프리미엄 좌석', 14600, 23, 13),
       (55, '일반 좌석', 8300, 16, 6),
       (56, '스탠다드 좌석', 9200, 17, 7),
       (57, 'VIP 좌석', 13000, 21, 12),
       (58, '프리미엄 좌석', 14800, 25, 14),
       (59, '일반 좌석', 8100, 15, 5),
       (60, '스탠다드 좌석', 9500, 18, 9),
       (61, 'VIP 좌석', 13400, 22, 13),
       (62, '프리미엄 좌석', 14700, 23, 12),
       (63, '일반 좌석', 8000, 15, 6),
       (64, '스탠다드 좌석', 9800, 17, 7),
       (65, 'VIP 좌석', 13700, 20, 12),
       (66, '프리미엄 좌석', 15000, 25, 15),
       (67, '일반 좌석', 8200, 16, 9),
       (68, '스탠다드 좌석', 9400, 18, 8),
       (69, 'VIP 좌석', 13200, 21, 11),
       (70, '프리미엄 좌석', 14600, 23, 14),
       (71, '일반 좌석', 7800, 15, 6),
       (72, '스탠다드 좌석', 9000, 17, 7),
       (73, 'VIP 좌석', 13000, 22, 12),
       (74, '프리미엄 좌석', 15000, 24, 13),
       (75, '일반 좌석', 8500, 15, 8),
       (76, '스탠다드 좌석', 9300, 17, 6),
       (77, 'VIP 좌석', 13500, 20, 11),
       (78, '프리미엄 좌석', 14800, 23, 15),
       (79, '일반 좌석', 7900, 15, 7),
       (80, '스탠다드 좌석', 9600, 18, 8),
       (81, 'VIP 좌석', 13000, 21, 12),
       (82, '프리미엄 좌석', 14700, 22, 14),
       (83, '일반 좌석', 8000, 15, 9),
       (84, '스탠다드 좌석', 9300, 17, 6),
       (85, 'VIP 좌석', 12800, 20, 11),
       (86, '프리미엄 좌석', 14500, 23, 12),
       (87, '일반 좌석', 8100, 15, 7),
       (88, '스탠다드 좌석', 9400, 17, 8),
       (89, 'VIP 좌석', 13400, 22, 13),
       (90, '프리미엄 좌석', 14600, 23, 15),
       (91, '일반 좌석', 7800, 15, 6),
       (92, '스탠다드 좌석', 9000, 17, 7),
       (93, 'VIP 좌석', 13000, 20, 12),
       (94, '프리미엄 좌석', 14800, 23, 14),
       (95, '일반 좌석', 8000, 15, 9),
       (96, '스탠다드 좌석', 9500, 18, 8),
       (97, 'VIP 좌석', 13300, 22, 11),
       (98, '프리미엄 좌석', 14700, 23, 13),
       (99, '일반 좌석', 7800, 15, 6),
       (100, '스탠다드 좌석', 9200, 17, 7);

INSERT INTO event_reviews (user_id, event_id, rate, contents)
VALUES ('user1001', 1, 5, '정말 멋진 이벤트였어요! 재밌었고, 다음에도 또 참가하고 싶습니다.'),
       ('user1002', 1, 4, '이벤트가 꽤 재미있었지만 조금 아쉬운 점도 있었습니다. 그래도 좋았어요.'),
       ('user1003', 2, 3, '일반적인 이벤트였습니다. 특별한 점은 없었지만 괜찮았어요.'),
       ('user1004', 2, 2, '조금 지루했어요. 다음에는 더 개선되었으면 좋겠어요.'),
       ('user1005', 3, 4, '즐거운 시간이었어요. 진행이 잘 되었고, 참여할 수 있어서 좋았습니다.'),
       ('user1006', 3, 5, '완벽한 이벤트였습니다! 기대 이상이었어요.'),
       ('user1007', 4, 3, '보통의 이벤트였지만, 나쁘지는 않았습니다.'),
       ('user1008', 4, 4, '좋았어요. 하지만 개선할 부분이 조금 있었습니다.'),
       ('user1009', 5, 5, '정말 최고였어요! 너무 재미있었고, 친구들과 함께 즐길 수 있었습니다.'),
       ('user1010', 5, 3, '좋은 이벤트였지만, 조금 더 다양한 활동이 있었으면 좋겠어요.'),
       ('user1011', 6, 2, '조금 실망스러웠어요. 기대했던 것보다는 부족한 느낌이었습니다.'),
       ('user1012', 6, 4, '괜찮은 이벤트였어요. 다만, 진행 속도가 조금 느렸어요.'),
       ('user1013', 7, 5, '정말 재미있고 유익한 시간이었습니다! 다시 참석하고 싶어요.'),
       ('user1014', 7, 3, '무난한 이벤트였어요. 특별히 인상 깊었던 점은 없었습니다.'),
       ('user1015', 8, 4, '좋았어요. 다만 이벤트 시간이 조금 더 길었으면 좋겠어요.'),
       ('user1016', 8, 5, '정말 만족스러웠습니다. 모든 부분이 잘 준비되어 있었습니다.'),
       ('user1017', 9, 2, '조금 아쉬운 점이 많았어요. 다음에는 개선되었으면 좋겠어요.'),
       ('user1018', 9, 4, '괜찮았어요. 다음에는 더 기대해도 될 것 같아요.'),
       ('user1019', 10, 3, '평범한 이벤트였습니다. 특별한 점은 없었습니다.'),
       ('user1020', 10, 5, '정말 멋진 이벤트였어요! 다음에도 꼭 참가하고 싶습니다.'),
       ('user1021', 11, 4, '다 좋았지만, 조금 더 다양한 프로그램이 있었으면 좋겠어요.'),
       ('user1022', 11, 2, '별로였어요. 기대했던 것보다 부족한 부분이 많았습니다.'),
       ('user1023', 12, 5, '너무 재미있었고, 내용이 정말 유익했어요!'),
       ('user1024', 12, 3, '괜찮은 이벤트였지만 좀 더 개선할 부분이 있었어요.'),
       ('user1025', 13, 4, '정말 재미있었어요. 다만, 인원이 너무 많아서 조금 복잡했어요.'),
       ('user1026', 13, 5, '완벽했습니다! 너무 즐거웠고, 다음에 또 참석하고 싶습니다.'),
       ('user1027', 14, 3, '조금 지루했어요. 다음에는 더 다양한 활동이 필요할 것 같아요.'),
       ('user1028', 14, 4, '좋았어요. 다음에는 더 발전된 모습을 기대해 봅니다.'),
       ('user1029', 15, 5, '진짜 재미있었어요! 많은 사람들이 즐길 수 있었던 좋은 이벤트였습니다.'),
       ('user1030', 15, 2, '그다지 재미있지 않았어요. 개선이 필요할 것 같습니다.'),
       ('user1031', 16, 4, '많이 기대했던 만큼, 만족할 수 있었어요. 다음에는 더 기대됩니다.'),
       ('user1032', 16, 5, '정말 좋았어요. 다양한 프로그램이 있어서 좋았습니다.'),
       ('user1033', 17, 3, '좋았지만 조금 더 집중할 부분이 필요했어요.'),
       ('user1034', 17, 4, '즐거운 시간이었습니다. 조금 더 개선하면 좋을 것 같아요.'),
       ('user1035', 18, 2, '기대보다는 부족한 점이 많았어요. 개선이 필요합니다.'),
       ('user1036', 18, 5, '정말 최고의 이벤트였습니다! 대만족이에요.'),
       ('user1037', 19, 4, '괜찮았어요. 다만 조금 더 다채로운 프로그램이 있었으면 좋겠어요.'),
       ('user1038', 19, 3, '무난한 이벤트였어요. 특별한 점은 없었습니다.'),
       ('user1039', 20, 5, '정말 훌륭했어요! 완벽한 진행과 재미있는 프로그램들로 만족스러웠습니다.'),
       ('user1040', 20, 4, '좋은 이벤트였지만, 시간이 조금 더 길었으면 좋겠어요.'),
       ('user1041', 21, 3, '나쁘지 않았지만, 더 나은 점이 있었으면 좋겠어요.'),
       ('user1042', 21, 5, '정말 훌륭한 이벤트였습니다! 친구들과 함께 즐길 수 있어서 좋았습니다.'),
       ('user1043', 22, 4, '잘 준비된 이벤트였어요. 그러나 진행이 조금 지체된 점이 아쉬웠습니다.'),
       ('user1044', 22, 2, '기대보다는 부족한 부분이 많았어요. 개선이 필요합니다.'),
       ('user1045', 23, 3, '재미있었어요. 그러나 조금 더 다채로운 프로그램이 필요할 것 같습니다.'),
       ('user1046', 23, 4, '좋았어요! 다만 조금 더 긴 시간이었으면 좋겠어요.'),
       ('user1047', 24, 5, '정말 훌륭했어요! 다양한 활동이 있었고, 모두가 즐길 수 있었습니다.'),
       ('user1048', 24, 2, '그다지 재미있지 않았어요. 다음에는 더 개선되었으면 좋겠습니다.'),
       ('user1049', 25, 5, '매우 만족스러웠습니다. 다음에 또 참석하고 싶습니다.'),
       ('user1050', 25, 4, '전체적으로 좋았어요. 다만, 몇 가지 개선이 필요할 것 같습니다.'),
       ('user1051', 26, 3, '보통의 이벤트였습니다. 특별한 점은 없었어요.'),
       ('user1052', 26, 2, '실망스러웠어요. 다음에는 더 나은 이벤트가 되었으면 좋겠습니다.'),
       ('user1053', 27, 4, '정말 즐거운 시간이었어요. 하지만 더 많은 사람들이 참가할 수 있었으면 좋겠어요.'),
       ('user1054', 27, 5, '대만족입니다! 다시 참가하고 싶어요.'),
       ('user1055', 28, 3, '괜찮았어요. 그래도 더 다양한 프로그램이 있으면 좋겠어요.'),
       ('user1056', 28, 2, '조금 지루했습니다. 다음에는 더 재미있었으면 좋겠어요.'),
       ('user1057', 29, 4, '정말 즐거운 시간이었어요! 다만 조금 더 길었으면 좋겠어요.'),
       ('user1058', 29, 5, '너무 재밌었어요! 정말 즐거운 시간이었습니다.'),
       ('user1059', 30, 3, '그럭저럭 괜찮았어요. 특별히 기억에 남는 부분은 없었어요.'),
       ('user1060', 30, 2, '기대 이하였어요. 다소 실망스러웠습니다.'),
       ('user1061', 31, 4, '정말 재미있었고, 다채로운 프로그램이 좋았어요!'),
       ('user1062', 31, 5, '완벽한 이벤트였습니다! 또 참여하고 싶어요.'),
       ('user1063', 32, 3, '보통의 이벤트였습니다. 조금 더 다채로운 프로그램이 있었으면 좋겠어요.'),
       ('user1064', 32, 4, '좋은 시간이었지만, 인원이 너무 많아서 불편함이 있었습니다.'),
       ('user1065', 33, 5, '정말 즐겁고 재미있는 시간이었습니다! 모든 게 완벽했어요.'),
       ('user1066', 33, 2, '조금 지루하고, 특별한 점이 없었습니다. 개선이 필요해요.'),
       ('user1067', 34, 4, '좋았어요. 그러나 약간의 혼잡함이 있었던 점은 아쉬웠습니다.'),
       ('user1068', 34, 3, '무난한 이벤트였습니다. 특별한 기억은 없어요.'),
       ('user1069', 35, 5, '정말 멋진 이벤트였어요! 만족스러웠고, 즐거운 시간이었습니다.'),
       ('user1070', 35, 4, '좋았어요. 다음에는 더 많은 사람들이 참여할 수 있었으면 좋겠어요.'),
       ('user1071', 36, 3, '괜찮았어요. 다만 더 다양한 콘텐츠가 필요할 것 같습니다.'),
       ('user1072', 36, 5, '정말 즐거운 시간이었어요! 기대 이상의 이벤트였어요.'),
       ('user1073', 37, 4, '괜찮았지만, 몇 가지 개선이 필요해요.'),
       ('user1074', 37, 5, '대단히 만족스러웠습니다! 재미있었고 유익했어요.'),
       ('user1075', 38, 2, '기대보다는 아쉬운 점이 많았습니다.'),
       ('user1076', 38, 3, '보통의 이벤트였습니다. 특별히 기억에 남는 부분은 없었어요.'),
       ('user1077', 39, 4, '좋았어요. 다만 시간 제약이 조금 아쉬웠습니다.'),
       ('user1078', 39, 5, '정말 훌륭했어요! 다음에도 참여하고 싶습니다.'),
       ('user1079', 40, 3, '그럭저럭 괜찮았어요. 특별한 점은 없었습니다.'),
       ('user1080', 40, 4, '좋은 시간이었어요. 다만 몇 가지 점은 개선이 필요할 것 같아요.');


INSERT INTO event_review_images (review_id, img_url)
VALUES (1, 'https://picsum.photos/id/1/200'),
       (3, 'https://picsum.photos/id/2/200'),
       (5, 'https://picsum.photos/id/3/200'),
       (7, 'https://picsum.photos/id/4/200'),
       (9, 'https://picsum.photos/id/5/200'),
       (11, 'https://picsum.photos/id/6/200'),
       (13, 'https://picsum.photos/id/7/200'),
       (15, 'https://picsum.photos/id/8/200'),
       (17, 'https://picsum.photos/id/9/200'),
       (19, 'https://picsum.photos/id/10/200'),
       (21, 'https://picsum.photos/id/11/200'),
       (23, 'https://picsum.photos/id/12/200'),
       (25, 'https://picsum.photos/id/13/200'),
       (27, 'https://picsum.photos/id/14/200'),
       (29, 'https://picsum.photos/id/15/200'),
       (31, 'https://picsum.photos/id/16/200'),
       (33, 'https://picsum.photos/id/17/200'),
       (35, 'https://picsum.photos/id/18/200'),
       (37, 'https://picsum.photos/id/19/200'),
       (39, 'https://picsum.photos/id/20/200'),
       (41, 'https://picsum.photos/id/21/200'),
       (43, 'https://picsum.photos/id/22/200'),
       (45, 'https://picsum.photos/id/23/200'),
       (47, 'https://picsum.photos/id/24/200'),
       (49, 'https://picsum.photos/id/25/200'),
       (51, 'https://picsum.photos/id/26/200'),
       (53, 'https://picsum.photos/id/27/200'),
       (55, 'https://picsum.photos/id/28/200'),
       (57, 'https://picsum.photos/id/29/200'),
       (59, 'https://picsum.photos/id/30/200'),
       (61, 'https://picsum.photos/id/31/200'),
       (63, 'https://picsum.photos/id/32/200'),
       (65, 'https://picsum.photos/id/33/200'),
       (67, 'https://picsum.photos/id/34/200'),
       (69, 'https://picsum.photos/id/35/200'),
       (71, 'https://picsum.photos/id/36/200'),
       (73, 'https://picsum.photos/id/37/200'),
       (75, 'https://picsum.photos/id/38/200'),
       (77, 'https://picsum.photos/id/39/200'),
       (79, 'https://picsum.photos/id/40/200');

INSERT INTO user_event_likes (user_id, event_related)
VALUES ('user1001', 3),
       ('user1001', 8),
       ('user1001', 12),
       ('user1002', 1),
       ('user1002', 5),
       ('user1002', 15),
       ('user1003', 18),
       ('user1003', 9),
       ('user1003', 21),
       ('user1004', 2),
       ('user1004', 6),
       ('user1004', 13),
       ('user1005', 25),
       ('user1005', 7),
       ('user1005', 28),
       ('user1006', 19),
       ('user1006', 22),
       ('user1006', 29),
       ('user1007', 4),
       ('user1007', 27),
       ('user1007', 35),
       ('user1008', 10),
       ('user1008', 31),
       ('user1008', 23),
       ('user1009', 17),
       ('user1009', 12),
       ('user1009', 6),
       ('user1010', 8),
       ('user1010', 14),
       ('user1010', 30),
       ('user1011', 5),
       ('user1011', 33),
       ('user1011', 18),
       ('user1012', 20),
       ('user1012', 15),
       ('user1012', 2),
       ('user1013', 7),
       ('user1013', 25),
       ('user1013', 11),
       ('user1014', 4),
       ('user1014', 24),
       ('user1014', 9),
       ('user1015', 13),
       ('user1015', 10),
       ('user1015', 32),
       ('user1016', 21),
       ('user1016', 3),
       ('user1016', 6),
       ('user1017', 1),
       ('user1017', 28),
       ('user1017', 16),
       ('user1018', 29),
       ('user1018', 34),
       ('user1018', 18),
       ('user1019', 23),
       ('user1019', 25),
       ('user1019', 5),
       ('user1020', 32),
       ('user1020', 20),
       ('user1020', 15),
       ('user1021', 22),
       ('user1021', 13),
       ('user1021', 31),
       ('user1022', 24),
       ('user1022', 7),
       ('user1022', 30),
       ('user1023', 5),
       ('user1023', 17),
       ('user1023', 9),
       ('user1024', 8),
       ('user1024', 21),
       ('user1024', 14),
       ('user1025', 27),
       ('user1025', 6),
       ('user1025', 35),
       ('user1026', 12),
       ('user1026', 16),
       ('user1026', 28),
       ('user1027', 4),
       ('user1027', 10),
       ('user1027', 23),
       ('user1028', 26),
       ('user1028', 29),
       ('user1028', 19),
       ('user1029', 33),
       ('user1029', 20),
       ('user1029', 8),
       ('user1030', 31),
       ('user1030', 25),
       ('user1030', 14),
       ('user1031', 15),
       ('user1031', 34),
       ('user1031', 24),
       ('user1032', 18),
       ('user1032', 2),
       ('user1032', 12),
       ('user1033', 5),
       ('user1033', 11),
       ('user1033', 33),
       ('user1034', 13),
       ('user1034', 1),
       ('user1034', 30),
       ('user1035', 22),
       ('user1035', 19),
       ('user1035', 7),
       ('user1036', 14),
       ('user1036', 21),
       ('user1036', 27),
       ('user1037', 28),
       ('user1037', 6),
       ('user1037', 10),
       ('user1038', 9),
       ('user1038', 26),
       ('user1038', 23),
       ('user1039', 17),
       ('user1039', 4),
       ('user1039', 32),
       ('user1040', 16),
       ('user1040', 25),
       ('user1040', 13),
       ('user1041', 29),
       ('user1041', 20),
       ('user1041', 33),
       ('user1042', 22),
       ('user1042', 8),
       ('user1042', 6),
       ('user1043', 35),
       ('user1043', 27),
       ('user1043', 14),
       ('user1044', 18),
       ('user1044', 2),
       ('user1044', 9),
       ('user1045', 12),
       ('user1045', 28),
       ('user1045', 5);


INSERT INTO funding_categories (ctgr_id, ctgr_name, ctgr_contents)
VALUES (1, 'Arts & Culture', 'Projects focused on artistic and cultural activities.'),
       (2, 'Community Development', 'Initiatives aimed at improving local communities.'),
       (3, 'Education', 'Programs supporting educational opportunities and resources.'),
       (4, 'Environment', 'Efforts towards environmental preservation and sustainability.'),
       (5, 'Technology', 'Innovations and advancements in the field of technology.');

INSERT INTO fundings (fd_id, user_id, ctgr_id, fd_title, fd_goal_amount, created_at, fd_start_at, fd_end_at,
                      is_approved, is_used)
VALUES (1, 'user1001', 1, 'Community Art Project', 100000, NOW(), '2023-11-01', '2023-12-01', TRUE, TRUE),
       (2, 'user1002', 2, 'Neighborhood Cleanup Fundraiser', 50000, NOW(), '2023-11-05', '2023-12-15', TRUE, TRUE),
       (3, 'user1003', 3, 'Local Music Festival Support', 150000, NOW(), '2023-11-10', '2023-12-20', FALSE, TRUE),
       (4, 'user1004', 4, 'Animal Shelter Expansion Funding', 200000, NOW(), '2023-11-15', '2023-12-25', TRUE, FALSE),
       (5, 'user1005', 5, 'Tech Education for Kids', 75000, NOW(), '2023-11-20', '2023-12-30', FALSE, TRUE);

INSERT INTO funding_images (fd_img_id, fd_id, fd_img_url, fd_img_order, created_at)
VALUES (1, 1, 'https://dummyimage.com/500x500/808080/fff.jpg', 1, NOW()),
       (2, 2, 'https://dummyimage.com/500x500/808080/fff.jpg', 2, NOW()),
       (3, 3, 'https://dummyimage.com/500x500/808080/fff.jpg', 3, NOW()),
       (4, 4, 'https://dummyimage.com/500x500/808080/fff.jpg', 4, NOW()),
       (5, 5, 'https://dummyimage.com/500x500/808080/fff.jpg', 5, NOW());

INSERT INTO funding_detail_images (img_id, fd_id, img_url, img_order, created_at)
VALUES (1, 1, 'https://dummyimage.com/500x500/808080/fff.jpg', 1, NOW()),
       (2, 2, 'https://dummyimage.com/500x500/808080/fff.jpg', 2, NOW()),
       (3, 3, 'https://dummyimage.com/500x500/808080/fff.jpg', 3, NOW()),
       (4, 4, 'https://dummyimage.com/500x500/808080/fff.jpg', 4, NOW()),
       (5, 5, 'https://dummyimage.com/500x500/808080/fff.jpg', 5, NOW());

INSERT INTO funding_options (opt_id, fd_id, opt_name, extra_fee)
VALUES (1, 1, 'Exclusive Backer Package', 2500),
       (2, 2, 'Early Access Bonus', 1500),
       (3, 3, 'Community Support Gift', 2000),
       (4, 4, 'VIP Contribution Package', 3000),
       (5, 5, 'Limited Edition Perk', 3500);

INSERT INTO funding_reviews (review_id, fd_id, user_id, rate, contents, is_used, created_at)
VALUES (1, 1, 'user1001', 5, 'Absolutely loved this funding initiative!', TRUE, NOW()),
       (2, 2, 'user1002', 4, 'Great cause, happy to contribute.', TRUE, NOW()),
       (3, 3, 'user1003', 3, 'Good effort, but needs more clarity on goals.', TRUE, NOW()),
       (4, 4, 'user1004', 2, 'Not what I expected. Could be organized better.', TRUE, NOW()),
       (5, 5, 'user1005', 5, 'Fantastic project, exceeded my expectations!', TRUE, NOW());

INSERT INTO funding_review_images (img_id, user_id, img_url, created_at)
VALUES (1, 'user1001', 'https://dummyimage.com/500x500/808080/fff.jpg', NOW()),
       (2, 'user1002', 'https://dummyimage.com/500x500/808080/fff.jpg', NOW()),
       (3, 'user1003', 'https://dummyimage.com/500x500/808080/fff.jpg', NOW()),
       (4, 'user1004', 'https://dummyimage.com/500x500/808080/fff.jpg', NOW()),
       (5, 'user1005', 'https://dummyimage.com/500x500/808080/fff.jpg', NOW());

INSERT INTO hashtags (tagword, user_id)
VALUES ('여행', 'user1001'),
       ('맛집', 'user1001'),
       ('음악', 'user1001'),
       ('영화', 'user1001'),
       ('운동', 'user1001'),
       ('패션', 'user1002'),
       ('독서', 'user1002'),
       ('게임', 'user1002'),
       ('기술', 'user1002'),
       ('건강', 'user1002'),
       ('카페', 'user1003'),
       ('취미', 'user1003'),
       ('디지털', 'user1003'),
       ('요리', 'user1003'),
       ('휴식', 'user1003'),
       ('사진', 'user1004'),
       ('자기계발', 'user1004'),
       ('연애', 'user1004'),
       ('교육', 'user1004'),
       ('심리학', 'user1004'),
       ('패션', 'user1005'),
       ('푸드', 'user1005'),
       ('운동', 'user1005'),
       ('음악', 'user1005'),
       ('여행', 'user1005'),
       ('여행', 'user1006'),
       ('캠핑', 'user1006'),
       ('자전거', 'user1006'),
       ('배우기', 'user1006'),
       ('모험', 'user1006'),
       ('책', 'user1007'),
       ('디자인', 'user1007'),
       ('인테리어', 'user1007'),
       ('음식', 'user1007'),
       ('산책', 'user1007'),
       ('과학', 'user1008'),
       ('기술', 'user1008'),
       ('헬스', 'user1008'),
       ('인공지능', 'user1008'),
       ('소프트웨어', 'user1008'),
       ('패션', 'user1009'),
       ('화장품', 'user1009'),
       ('운동', 'user1009'),
       ('여행', 'user1009'),
       ('자연', 'user1009'),
       ('문화', 'user1010'),
       ('자기계발', 'user1010'),
       ('부동산', 'user1010'),
       ('요리', 'user1010'),
       ('음악', 'user1010'),
       ('영화', 'user1011'),
       ('연애', 'user1011'),
       ('음악', 'user1011'),
       ('도전', 'user1011'),
       ('건강', 'user1011'),
       ('패션', 'user1012'),
       ('미술', 'user1012'),
       ('디지털', 'user1012'),
       ('게임', 'user1012'),
       ('디자인', 'user1012'),
       ('운동', 'user1013'),
       ('요리', 'user1013'),
       ('책', 'user1013'),
       ('여행', 'user1013'),
       ('연애', 'user1013'),
       ('여행', 'user1014'),
       ('캠핑', 'user1014'),
       ('배우기', 'user1014'),
       ('음악', 'user1014'),
       ('헬스', 'user1014'),
       ('기술', 'user1015'),
       ('건강', 'user1015'),
       ('요리', 'user1015'),
       ('패션', 'user1015'),
       ('영화', 'user1015'),
       ('책', 'user1016'),
       ('디지털', 'user1016'),
       ('게임', 'user1016'),
       ('운동', 'user1016'),
       ('음악', 'user1016'),
       ('운동', 'user1017'),
       ('여행', 'user1017'),
       ('책', 'user1017'),
       ('디자인', 'user1017'),
       ('자기계발', 'user1017'),
       ('화장품', 'user1018'),
       ('패션', 'user1018'),
       ('미술', 'user1018'),
       ('운동', 'user1018'),
       ('영화', 'user1018'),
       ('자기계발', 'user1019'),
       ('게임', 'user1019'),
       ('영화', 'user1019'),
       ('건강', 'user1019'),
       ('책', 'user1019'),
       ('디지털', 'user1020'),
       ('카페', 'user1020'),
       ('운동', 'user1020'),
       ('여행', 'user1020'),
       ('미술', 'user1020'),
       ('게임', 'user1021'),
       ('책', 'user1021'),
       ('디지털', 'user1021'),
       ('패션', 'user1021'),
       ('운동', 'user1021'),
       ('패션', 'user1022'),
       ('책', 'user1022'),
       ('디지털', 'user1022'),
       ('음악', 'user1022'),
       ('요리', 'user1022'),
       ('디자인', 'user1023'),
       ('자기계발', 'user1023'),
       ('캠핑', 'user1023'),
       ('음악', 'user1023'),
       ('연애', 'user1023'),
       ('운동', 'user1024'),
       ('책', 'user1024'),
       ('디지털', 'user1024'),
       ('패션', 'user1024'),
       ('미술', 'user1024'),
       ('여행', 'user1025'),
       ('운동', 'user1025'),
       ('게임', 'user1025'),
       ('음악', 'user1025'),
       ('디지털', 'user1025');

INSERT INTO user_enter_chatroom (chat_id, user_id)
VALUES (1, 'user1001'),
       (1, 'user1002'),
       (2, 'user1003'),
       (2, 'user1004'),
       (3, 'user1005'),
       (3, 'user1006'),
       (4, 'user1007'),
       (4, 'user1008'),
       (5, 'user1009'),
       (5, 'user1010'),
       (6, 'user1011'),
       (6, 'user1012'),
       (7, 'user1013'),
       (7, 'user1014'),
       (8, 'user1015'),
       (8, 'user1016'),
       (9, 'user1017'),
       (9, 'user1018'),
       (10, 'user1019'),
       (10, 'user1020'),
       (11, 'user1021'),
       (11, 'user1022'),
       (12, 'user1023'),
       (12, 'user1024'),
       (13, 'user1025'),
       (13, 'user1026'),
       (14, 'user1027'),
       (14, 'user1028'),
       (15, 'user1029'),
       (15, 'user1030'),
       (16, 'user1031'),
       (16, 'user1032'),
       (17, 'user1033'),
       (17, 'user1034'),
       (18, 'user1035'),
       (18, 'user1036'),
       (19, 'user1037'),
       (19, 'user1038'),
       (20, 'user1039'),
       (20, 'user1040');

INSERT INTO messages (writer, chatroom_id, msg_body)
VALUES ('user1001', 1, '안녕하세요!'),
       ('user1002', 1, '안녕하세요, 어떻게 지내세요?'),
       ('user1003', 2, '안녕하세요!'),
       ('user1004', 2, '안녕하세요, 반갑습니다!'),
       ('user1005', 3, '오늘 날씨 좋네요.'),
       ('user1006', 3, '네, 맑고 따뜻하네요!'),
       ('user1007', 4, '여러분, 오늘 뭐 하세요?'),
       ('user1008', 4, '저는 일이 있어서요.'),
       ('user1009', 5, '새로운 프로젝트 시작했어요!'),
       ('user1010', 5, '와, 멋지네요! 화이팅!'),
       ('user1011', 6, '오늘 회의 잘 끝났어요.'),
       ('user1012', 6, '회의 진행이 잘 되어서 기뻐요.'),
       ('user1013', 7, '이 영화 정말 재밌어요.'),
       ('user1014', 7, '맞아요, 저도 봤어요!'),
       ('user1015', 8, '저는 이번 주말에 여행 가요.'),
       ('user1016', 8, '어디로 가세요?'),
       ('user1017', 9, '저는 운동 중이에요.'),
       ('user1018', 9, '운동은 언제나 좋죠!'),
       ('user1019', 10, '오늘은 쉬는 날입니다.'),
       ('user1020', 10, '저도요, 좀 쉬어야겠어요.'),
       ('user1021', 11, '새로운 기술을 배우고 있어요.'),
       ('user1022', 11, '어떤 기술인가요?'),
       ('user1023', 12, '저는 요즘 책을 많이 읽어요.'),
       ('user1024', 12, '좋은 책 추천해주세요!'),
       ('user1025', 13, '오늘 날씨가 너무 좋네요.'),
       ('user1026', 13, '맞아요, 정말 기분이 좋아요.'),
       ('user1027', 14, '저는 영화 보는 걸 좋아해요.'),
       ('user1028', 14, '저도요, 요즘 어떤 영화 봤어요?'),
       ('user1029', 15, '맛있는 음식을 먹었어요.'),
       ('user1030', 15, '오, 어떤 음식이었어요?'),
       ('user1031', 16, '이 웹사이트 정말 유용해요.'),
       ('user1032', 16, '그렇죠, 저도 자주 사용해요.'),
       ('user1033', 17, '주말에 등산 가려고요.'),
       ('user1034', 17, '좋은 선택이에요, 화이팅!'),
       ('user1035', 18, '저는 요즘 영어 공부 중이에요.'),
       ('user1036', 18, '영어 공부 잘 되고 있나요?'),
       ('user1037', 19, '오늘 회의에서 발표했어요.'),
       ('user1038', 19, '잘 하셨나요?'),
       ('user1039', 20, '요즘 운동에 빠졌어요.'),
       ('user1040', 20, '운동은 몸에 좋죠, 계속 하세요!');

INSERT INTO oneday_dates (date_id, od_id, od_price, od_date, is_used)
VALUES (1, 1, 50000, '2023-11-05', TRUE),
       (2, 2, 45000, '2023-11-06', TRUE),
       (3, 3, 60000, '2023-11-07', TRUE),
       (4, 4, 55000, '2023-11-08', TRUE),
       (5, 5, 48000, '2023-11-09', TRUE);

INSERT INTO oneday_images (img_id, od_id, img_url, img_order, created_at)
VALUES (1, 1, 'https://dummyimage.com/500x500/808080/fff.jpg', 1, NOW()),
       (2, 2, 'https://dummyimage.com/500x500/808081/fff.jpg', 2, NOW()),
       (3, 3, 'https://dummyimage.com/500x500/808082/fff.jpg', 3, NOW()),
       (4, 4, 'https://dummyimage.com/500x500/808083/fff.jpg', 4, NOW()),
       (5, 5, 'https://dummyimage.com/500x500/808084/fff.jpg', 5, NOW());

INSERT INTO oneday_detail_images (img_id, od_id, img_url, img_order, created_at)
VALUES (1, 1, 'https://dummyimage.com/650x650/808080/fff.jpg', 1, NOW()),
       (2, 2, 'https://dummyimage.com/650x650/808081/fff.jpg', 2, NOW()),
       (3, 3, 'https://dummyimage.com/650x650/808082/fff.jpg', 3, NOW()),
       (4, 4, 'https://dummyimage.com/650x650/808083/fff.jpg', 4, NOW()),
       (5, 5, 'https://dummyimage.com/650x650/808084/fff.jpg', 5, NOW());

INSERT INTO oneday_options (opt_id, date_id, opt_name, opt_price, created_at)
VALUES (1, 1, 'Beginner Materials Package', 25000, NOW()),
       (2, 2, 'Advanced Tools Package', 30000, NOW()),
       (3, 3, 'Exclusive Class Notes', 20000, NOW()),
       (4, 4, 'VIP Pass', 40000, NOW()),
       (5, 5, 'Post-Class Q&A Session', 15000, NOW());

INSERT INTO oneday_reviews (review_id, user_id, od_id, contents, rate, is_used, created_at)
VALUES (1, 'user1001', 1, 'Amazing experience, learned a lot!', 5, TRUE, NOW()),
       (2, 'user1002', 2, 'The session was well-organized and fun.', 4, TRUE, NOW()),
       (3, 'user1003', 3, 'Good overall, but could use more examples.', 3, TRUE, NOW()),
       (4, 'user1004', 4, 'Not as interesting as I hoped.', 2, TRUE, NOW()),
       (5, 'user1005', 5, 'Incredible class! Would highly recommend it.', 5, TRUE, NOW());

INSERT INTO oneday_review_images (img_id, user_id, img_url, created_at)
VALUES (1, 'user1001', 'https://dummyimage.com/500x500/808080/fff.jpg', NOW()),
       (2, 'user1002', 'https://dummyimage.com/500x500/808081/fff.jpg', NOW()),
       (3, 'user1003', 'https://dummyimage.com/500x500/808082/fff.jpg', NOW()),
       (4, 'user1004', 'https://dummyimage.com/500x500/808083/fff.jpg', NOW()),
       (5, 'user1005', 'https://dummyimage.com/500x500/808084/fff.jpg', NOW());

-- postings 테이블에 100개의 더미 데이터 삽입 (user1010까지 10개, user1050까지 3개)
INSERT INTO postings (user_id, contents, location_tag, person_tag_id, visibility_type)
VALUES ('user1001', '오늘은 정말 좋은 날입니다!', '여행', 'user1002', 'All'),
       ('user1001', '새로운 프로젝트를 시작했어요. 기대됩니다!', '프로젝트', 'user1003', 'Friends'),
       ('user1001', '여러분, 오늘 저녁은 뭐 먹을까요?', '저녁', 'user1004', 'Private'),
       ('user1001', '이번 주말에 여행을 가려고 해요.', '여행', 'user1005', 'All'),
       ('user1001', '건강을 위해 운동을 시작했어요. 여러분도 함께 해요!', '운동', 'user1006', 'Friends'),
       ('user1001', '책을 읽으며 여유로운 시간을 보냈어요.', '독서', 'user1007', 'Private'),
       ('user1001', '영화를 봤는데 너무 감동적이었어요.', '영화', 'user1008', 'All'),
       ('user1001', '오늘 날씨가 정말 좋네요!', '날씨', 'user1009', 'Private'),
       ('user1001', '새로운 카페를 발견했어요! 추천합니다.', '카페', 'user1010', 'Friends'),
       ('user1001', '일주일간의 여행을 다녀왔습니다. 너무 좋았어요!', '여행', 'user1001', 'All'),

       ('user1002', '디지털 마케팅에 대해 공부하고 있어요.', '마케팅', 'user1003', 'Friends'),
       ('user1002', '이번 주말에 드라이브 갈 계획이에요.', '드라이브', 'user1004', 'Private'),
       ('user1002', '맛있는 음식을 먹고 왔습니다! 추천해요!', '음식', 'user1005', 'All'),
       ('user1002', '이번에 새로운 운동을 시작했어요.', '운동', 'user1006', 'Friends'),
       ('user1002', '피트니스에 대해서 공부 중입니다.', '피트니스', 'user1007', 'Private'),
       ('user1002', '주말에 영화 보러 갑니다.', '영화', 'user1008', 'All'),
       ('user1002', '오랜만에 친구를 만나 즐거운 시간을 보냈습니다.', '친구', 'user1009', 'Friends'),
       ('user1002', '스포츠 게임을 즐겼습니다.', '스포츠', 'user1010', 'Private'),
       ('user1002', '새로운 레스토랑을 발견했습니다.', '레스토랑', 'user1001', 'All'),
       ('user1002', '주말에는 쇼핑을 갔다왔어요.', '쇼핑', 'user1002', 'Friends'),

       ('user1003', '최근에 새로운 운동 기구를 샀어요!', '운동', 'user1004', 'Private'),
       ('user1003', '음악 페스티벌에 다녀왔습니다!', '음악', 'user1005', 'All'),
       ('user1003', '요즘 책 읽는 게 재미있어요.', '독서', 'user1006', 'Friends'),
       ('user1003', '가을을 맞이하여 여행을 떠날 예정입니다.', '여행', 'user1007', 'Private'),
       ('user1003', '맛집을 찾아다니는 걸 좋아해요.', '맛집', 'user1008', 'All'),
       ('user1003', '오늘은 너무 피곤해서 일찍 자야겠어요.', '피곤', 'user1009', 'Friends'),
       ('user1003', '새로운 음식 레시피를 시도했어요.', '음식', 'user1010', 'Private'),
       ('user1003', '가을 산책은 정말 좋네요.', '산책', 'user1001', 'All'),
       ('user1003', '영화가 끝난 후 깊은 여운이 남았습니다.', '영화', 'user1002', 'Friends'),
       ('user1003', '바쁜 하루가 지나고 드디어 주말!', '주말', 'user1003', 'Private'),

       ('user1004', '새로운 친구를 만났어요!', '친구', 'user1005', 'All'),
       ('user1004', '가을이 되니 정말 좋은 날씨네요.', '날씨', 'user1006', 'Friends'),
       ('user1004', '다음 주에 여행을 떠나요.', '여행', 'user1007', 'Private'),
       ('user1004', '카페에서 차 한잔 마시고 왔어요.', '카페', 'user1008', 'All'),
       ('user1004', '여러분, 건강을 위해 운동합시다!', '운동', 'user1009', 'Friends'),
       ('user1004', '최근에 책을 많이 읽고 있어요.', '독서', 'user1010', 'Private'),
       ('user1004', '하루종일 바쁜 일정을 보냈습니다.', '일정', 'user1001', 'All'),
       ('user1004', '새로운 직장에서 일하고 있어요.', '직장', 'user1002', 'Friends'),
       ('user1004', '주말에는 주로 운동을 합니다.', '운동', 'user1003', 'Private'),
       ('user1004', '요즘 영화 보기가 취미입니다.', '영화', 'user1004', 'All'),

       ('user1005', '오늘은 친구랑 카페에서 시간을 보냈어요.', '카페', 'user1006', 'Friends'),
       ('user1005', '이번 주는 업무가 너무 많아요.', '업무', 'user1007', 'Private'),
       ('user1005', '이번 주는 날씨가 정말 좋네요.', '날씨', 'user1008', 'All'),
       ('user1005', '저녁에 외식했어요. 정말 맛있었습니다.', '외식', 'user1009', 'Friends'),
       ('user1005', '오늘은 운동을 하지 않았어요.', '운동', 'user1010', 'Private'),
       ('user1005', '책 한권 읽고 왔어요. 정말 유익했어요.', '책', 'user1001', 'All'),
       ('user1005', '피트니스 클럽에 다니고 있어요.', '피트니스', 'user1002', 'Friends'),
       ('user1005', '스포츠 경기 보러 갔습니다.', '스포츠', 'user1003', 'Private'),
       ('user1005', '주말에 친구들과 모임을 가졌어요.', '모임', 'user1004', 'All'),
       ('user1005', '오늘은 바쁘지만 즐거운 하루였어요.', '하루', 'user1005', 'Friends'),

       ('user1006', '오늘은 친구들과 운동을 했어요. 정말 즐거웠어요!', '운동', 'user1007', 'All'),
       ('user1006', '주말에는 등산을 계획하고 있습니다.', '등산', 'user1008', 'Friends'),
       ('user1006', '오늘 저녁은 집에서 간단히 먹을 거에요.', '저녁', 'user1009', 'Private'),
       ('user1006', '요즘 영화보기가 취미입니다. 다음 주에는 새로운 영화를 볼 예정이에요.', '영화', 'user1010', 'All'),
       ('user1006', '새로운 레스토랑에서 맛있는 음식을 먹었어요!', '음식', 'user1001', 'Friends'),
       ('user1006', '가을 날씨에 산책하는 게 정말 좋네요.', '산책', 'user1002', 'Private'),
       ('user1006', '오늘은 독서에 시간을 보냈어요. 책 추천해 주세요!', '독서', 'user1003', 'All'),
       ('user1006', '어제 영화가 너무 좋았어요. 추천합니다!', '영화', 'user1004', 'Friends'),
       ('user1006', '오늘은 하루종일 운동을 했어요. 피곤하지만 기분이 좋아요.', '운동', 'user1005', 'Private'),
       ('user1006', '주말에는 친구들과 함께 주차장에서 농구를 했습니다.', '농구', 'user1006', 'All'),

       ('user1007', '오늘 하루는 정말 힘들었어요. 다들 어떠신가요?', '일상', 'user1008', 'Friends'),
       ('user1007', '주말에 여행을 떠나려고 해요. 추천할 곳 있으면 알려주세요!', '여행', 'user1009', 'Private'),
       ('user1007', '새로운 요리법을 시도해봤어요. 아주 맛있었어요!', '음식', 'user1010', 'All'),
       ('user1007', '어제는 정말 신나는 하루였어요. 오늘은 푹 쉬어야겠어요.', '휴식', 'user1001', 'Friends'),
       ('user1007', '영화관에서 재미있는 영화를 봤어요!', '영화', 'user1002', 'Private'),
       ('user1007', '이번 주말에 좋은 책을 읽어볼 예정입니다.', '독서', 'user1003', 'All'),
       ('user1007', '가을이 되니 날씨가 정말 좋아요. 산책할 때 너무 기분이 좋아요.', '산책', 'user1004', 'Friends'),
       ('user1007', '오늘은 정말 피곤하지만 좋은 하루였어요.', '피곤', 'user1005', 'Private'),
       ('user1007', '친구들과 함께 놀러갔는데 너무 즐거웠어요!', '친구', 'user1006', 'All'),
       ('user1007', '영화를 보며 하루를 마무리하려고 해요.', '영화', 'user1007', 'Friends'),

       ('user1008', '최근에 운동을 시작했어요. 점점 더 좋아지는 것 같아요.', '운동', 'user1009', 'Private'),
       ('user1008', '이번 주말에 바다를 보러 가려고 해요. 기대됩니다!', '바다', 'user1010', 'All'),
       ('user1008', '친구와 함께 음식점에서 맛있는 음식을 먹었어요!', '음식', 'user1001', 'Friends'),
       ('user1008', '책을 한 권 읽고 왔습니다. 정말 유익한 내용이었어요.', '책', 'user1002', 'Private'),
       ('user1008', '저녁에 영화관에 가려고 해요. 기대됩니다!', '영화', 'user1003', 'All'),
       ('user1008', '가을 날씨에 산책하기 정말 좋은 날이었어요.', '산책', 'user1004', 'Friends'),
       ('user1008', '운동 후에는 항상 기분이 좋아요!', '운동', 'user1005', 'Private'),
       ('user1008', '오늘은 새로운 카페를 발견했어요. 맛있었어요!', '카페', 'user1006', 'All'),
       ('user1008', '새로운 취미를 찾아서 시작했어요. 너무 재밌어요!', '취미', 'user1007', 'Friends'),
       ('user1008', '오늘은 날씨가 좋아서 외출할 예정이에요.', '날씨', 'user1008', 'Private'),

       ('user1009', '오늘은 저녁을 외식했어요. 정말 맛있었어요!', '외식', 'user1010', 'All'),
       ('user1009', '이번 주에 새로운 운동을 시작했어요. 체력 향상 중이에요.', '운동', 'user1001', 'Friends'),
       ('user1009', '영화를 보고 나서 감동을 받았어요. 너무 좋았어요.', '영화', 'user1002', 'Private'),
       ('user1009', '주말에 여행을 갈 예정입니다. 정말 기대돼요!', '여행', 'user1003', 'All'),
       ('user1009', '어제는 정말 바쁜 하루였어요. 오늘은 좀 더 여유롭게 지내려고요.', '일상', 'user1004', 'Friends'),
       ('user1009', '새로운 책을 읽고 있습니다. 책에 빠져들었어요.', '책', 'user1005', 'Private'),
       ('user1009', '친구들과 함께 운동을 했어요. 너무 즐거웠어요!', '운동', 'user1006', 'All'),
       ('user1009', '카페에서 시간을 보냈어요. 정말 좋은 분위기였어요.', '카페', 'user1007', 'Friends'),
       ('user1009', '오늘은 바쁘게 일했지만 재미있는 일이 많았어요.', '일상', 'user1008', 'Private'),
       ('user1009', '이번 주에는 새로운 스포츠를 시작하려고 해요.', '스포츠', 'user1009', 'All'),

       ('user1010', '친구와 운동 후 피로를 풀었어요.', '운동', 'user1001', 'Friends'),
       ('user1010', '주말에는 바다를 보러 갈 예정이에요.', '바다', 'user1002', 'Private'),
       ('user1010', '오늘은 맛있는 음식을 먹고 왔어요.', '음식', 'user1003', 'All'),
       ('user1010', '책을 읽으며 여유롭게 시간을 보냈어요.', '책', 'user1004', 'Friends'),
       ('user1010', '친구와 함께 영화를 보고 왔어요. 정말 재미있었어요!', '영화', 'user1005', 'Private'),
       ('user1010', '새로운 취미를 찾았어요. 이제 매일 새로운 도전!', '취미', 'user1006', 'All'),
       ('user1010', '오늘은 날씨가 정말 좋아서 외출을 했어요.', '날씨', 'user1007', 'Friends'),
       ('user1010', '운동을 시작했어요. 내일은 더 열심히 하려고 해요.', '운동', 'user1008', 'Private'),
       ('user1010', '주말에는 친구들과 함께 여행을 갈 예정이에요.', '여행', 'user1009', 'All'),
       ('user1010', '오늘은 기분 좋은 하루였어요.', '일상', 'user1010', 'Friends'),

       ('user1011', '오늘도 열심히 일했어요. 조금 피곤하지만 만족스럽네요.', '일상', 'user1012', 'All'),
       ('user1011', '이번 주말에는 친구들과 함께 여행을 갈 예정이에요. 기대돼요!', '여행', 'user1013', 'Friends'),
       ('user1011', '새로운 취미를 찾았어요. 아주 재미있어요!', '취미', 'user1014', 'Private'),
       ('user1011', '오늘은 날씨가 너무 좋네요. 산책하기 딱 좋은 날이에요.', '산책', 'user1015', 'All'),
       ('user1011', '친구와 영화 보러 갔어요. 정말 재미있었어요!', '영화', 'user1016', 'Friends'),
       ('user1011', '새로운 레스토랑에서 맛있는 음식을 먹었어요.', '음식', 'user1017', 'Private'),
       ('user1011', '오늘은 독서에 시간을 보냈어요. 정말 유익한 책이었어요.', '독서', 'user1018', 'All'),
       ('user1011', '주말에 운동을 시작하려고 해요. 기대돼요!', '운동', 'user1019', 'Friends'),
       ('user1011', '친구와 함께 운동하고 왔어요. 피곤하지만 기분 좋아요.', '운동', 'user1020', 'Private'),
       ('user1011', '오늘은 피로가 많이 쌓였네요. 푹 쉬어야겠어요.', '휴식', 'user1021', 'All'),

       ('user1012', '이번 주말에는 가족과 함께 시간을 보낼 예정이에요. 기대돼요!', '가족', 'user1013', 'Friends'),
       ('user1012', '운동을 시작하고 나서 몸이 점점 좋아지고 있어요.', '운동', 'user1014', 'Private'),
       ('user1012', '오늘도 하루가 너무 빨리 지나갔어요.', '일상', 'user1015', 'All'),
       ('user1012', '새로운 운동을 시작했어요. 벌써 피로가 오네요.', '운동', 'user1016', 'Friends'),
       ('user1012', '오늘은 정말 피곤한 하루였어요.', '휴식', 'user1017', 'Private'),
       ('user1012', '친구와 함께 맛있는 음식을 먹었어요!', '음식', 'user1018', 'All'),
       ('user1012', '주말에는 독서에 집중할 예정이에요.', '독서', 'user1019', 'Friends'),


       ('user1013', '오늘은 날씨가 좋아서 공원에서 산책했어요. 기분 최고!', '산책', 'user1014', 'All'),
       ('user1013', '새로운 책을 시작했어요. 이번엔 역사에 관한 책이에요.', '독서', 'user1015', 'Friends'),
       ('user1013', '친구들과 점심을 먹으러 갔는데, 정말 맛있었어요!', '음식', 'user1016', 'Private'),

       ('user1014', '오늘은 운동을 했어요. 몸이 개운하네요.', '운동', 'user1015', 'All'),
       ('user1014', '새로운 취미를 시작했어요. 정말 재미있어요!', '취미', 'user1016', 'Friends'),
       ('user1014', '이번 주말에는 영화관에 갈 계획이에요. 기대돼요.', '영화', 'user1017', 'Private'),

       ('user1015', '주말에는 친구들과 캠핑을 가려고 해요. 너무 기대돼요!', '캠핑', 'user1016', 'All'),
       ('user1015', '오늘은 책을 읽으며 조용한 시간을 보냈어요.', '독서', 'user1017', 'Friends'),
       ('user1015', '친구와 맛있는 음식을 먹었어요. 정말 맛있었어요!', '음식', 'user1018', 'Private'),

       ('user1016', '새로운 레스토랑을 발견했어요. 정말 맛있어요!', '음식', 'user1017', 'All'),
       ('user1016', '오늘은 공원에서 친구들과 함께 시간을 보냈어요.', '공원', 'user1018', 'Friends'),
       ('user1016', '운동을 하러 갔는데 너무 피곤하네요.', '운동', 'user1019', 'Private'),

       ('user1017', '이번 주말에는 친구들과 영화 보러 갈 계획이에요!', '영화', 'user1018', 'All'),
       ('user1017', '독서를 시작했어요. 아주 재미있는 책이에요.', '독서', 'user1019', 'Friends'),
       ('user1017', '오늘은 피곤한 하루였어요. 이제 쉬어야겠어요.', '휴식', 'user1020', 'Private'),

       ('user1018', '오늘은 날씨가 너무 좋아서 밖에서 활동했어요.', '날씨', 'user1019', 'All'),
       ('user1018', '새로운 취미를 시작했어요. 정말 재미있어요!', '취미', 'user1020', 'Friends'),
       ('user1018', '친구와 함께 운동을 했어요. 피곤하지만 기분 좋아요.', '운동', 'user1021', 'Private'),

       ('user1019', '오늘은 운동을 했어요. 몸이 개운하네요.', '운동', 'user1020', 'All'),
       ('user1019', '새로운 책을 읽기 시작했어요. 정말 유익한 책이에요.', '독서', 'user1021', 'Friends'),
       ('user1019', '친구와 영화를 보고 왔어요. 재미있었어요!', '영화', 'user1022', 'Private'),

       ('user1020', '오늘은 기분이 좋아서 산책을 했어요. 기분이 정말 좋네요.', '산책', 'user1021', 'All'),
       ('user1020', '친구와 함께 카페에 갔어요. 분위기가 좋았어요.', '카페', 'user1022', 'Friends'),
       ('user1020', '새로운 운동을 시작했어요. 조금 힘들지만 재미있어요.', '운동', 'user1023', 'Private'),

       ('user1021', '이번 주말에 가족과 함께 시간을 보내려고 해요.', '가족', 'user1022', 'All'),
       ('user1021', '운동을 시작하고 나서 몸이 점점 좋아지고 있어요.', '운동', 'user1023', 'Friends'),
       ('user1021', '새로운 취미를 찾았어요. 정말 재미있어요!', '취미', 'user1024', 'Private'),

       ('user1022', '친구들과 맛있는 음식을 먹었어요. 정말 맛있었어요!', '음식', 'user1023', 'All'),
       ('user1022', '새로운 레스토랑에서 맛있는 음식을 먹었어요.', '음식', 'user1024', 'Friends'),
       ('user1022', '오늘은 기분 좋게 운동을 하고 왔어요.', '운동', 'user1025', 'Private'),

       ('user1023', '오늘은 날씨가 너무 좋아서 외출했어요. 기분이 최고!', '날씨', 'user1024', 'All'),
       ('user1023', '친구와 함께 독서를 했어요. 정말 유익한 시간이었어요.', '독서', 'user1025', 'Friends'),
       ('user1023', '주말에 운동을 할 계획이에요. 몸을 좀 더 키우고 싶어요.', '운동', 'user1026', 'Private'),

       ('user1024', '새로운 영화가 나왔네요. 이번 주말에 볼 계획이에요.', '영화', 'user1025', 'All'),
       ('user1024', '친구와 함께 카페에서 이야기를 나누었어요. 좋은 시간 보냈어요.', '카페', 'user1026', 'Friends'),
       ('user1024', '오늘은 운동을 끝내고 피곤해서 쉬고 있어요.', '운동', 'user1027', 'Private'),

       ('user1025', '오늘은 피로가 많이 쌓였어요. 푹 쉬어야겠어요.', '휴식', 'user1026', 'All'),
       ('user1025', '새로운 취미를 시작했어요. 정말 재밌어요!', '취미', 'user1027', 'Friends'),
       ('user1025', '친구들과 영화 보고 왔어요. 정말 재미있었어요.', '영화', 'user1028', 'Private'),

       ('user1050', '오늘은 정말 기분 좋은 하루입니다.', '일상', 'user1051', 'All'),
       ('user1050', '새로운 운동을 시작했습니다.', '운동', 'user1052', 'Friends'),
       ('user1050', '저는 요즘 카페에서 시간을 많이 보내요.', '카페', 'user1053', 'Private');

INSERT INTO posting_like (user_id, post_id)
VALUES ('user1001', 1),
       ('user1001', 2),
       ('user1001', 3),
       ('user1002', 4),
       ('user1002', 5),
       ('user1002', 6),
       ('user1003', 7),
       ('user1003', 8),
       ('user1003', 9),
       ('user1004', 10),
       ('user1004', 11),
       ('user1004', 12),
       ('user1005', 13),
       ('user1005', 14),
       ('user1005', 15),
       ('user1006', 16),
       ('user1006', 17),
       ('user1006', 18),
       ('user1007', 19),
       ('user1007', 20),
       ('user1007', 21),
       ('user1008', 22),
       ('user1008', 23),
       ('user1008', 24),
       ('user1009', 25),
       ('user1009', 26),
       ('user1009', 27),
       ('user1010', 28),
       ('user1010', 29),
       ('user1010', 30),
       ('user1011', 31),
       ('user1011', 32),
       ('user1011', 33),
       ('user1012', 34),
       ('user1012', 35),
       ('user1012', 36),
       ('user1013', 37),
       ('user1013', 38),
       ('user1013', 39),
       ('user1014', 40),
       ('user1014', 41),
       ('user1014', 42),
       ('user1015', 43),
       ('user1015', 44),
       ('user1015', 45),
       ('user1016', 46),
       ('user1016', 47),
       ('user1016', 48),
       ('user1017', 49),
       ('user1017', 50),
       ('user1017', 51),
       ('user1018', 52),
       ('user1018', 53),
       ('user1018', 54),
       ('user1019', 55),
       ('user1019', 56),
       ('user1019', 57),
       ('user1020', 58),
       ('user1020', 59),
       ('user1020', 60),
       ('user1021', 61),
       ('user1021', 62),
       ('user1021', 63),
       ('user1022', 64),
       ('user1022', 65),
       ('user1022', 66),
       ('user1023', 67),
       ('user1023', 68),
       ('user1023', 69),
       ('user1024', 70),
       ('user1024', 71),
       ('user1024', 72),
       ('user1025', 73),
       ('user1025', 74),
       ('user1025', 75),
       ('user1026', 76),
       ('user1026', 77),
       ('user1026', 78),
       ('user1027', 79),
       ('user1027', 80),
       ('user1027', 81),
       ('user1028', 82),
       ('user1028', 83),
       ('user1028', 84),
       ('user1029', 85),
       ('user1029', 86),
       ('user1029', 87),
       ('user1030', 88),
       ('user1030', 89),
       ('user1030', 90),
       ('user1031', 91),
       ('user1031', 92),
       ('user1031', 93),
       ('user1032', 94),
       ('user1032', 95),
       ('user1032', 96),
       ('user1033', 97),
       ('user1033', 98),
       ('user1033', 99),
       ('user1034', 100),
       ('user1034', 101),
       ('user1034', 102),
       ('user1035', 103),
       ('user1035', 104),
       ('user1035', 105),
       ('user1036', 106),
       ('user1036', 107),
       ('user1036', 108),
       ('user1037', 109),
       ('user1037', 110),
       ('user1037', 111),
       ('user1038', 112),
       ('user1038', 113),
       ('user1038', 114),
       ('user1039', 115),
       ('user1039', 116),
       ('user1039', 117),
       ('user1040', 118),
       ('user1040', 119),
       ('user1040', 120);

INSERT INTO posting_images (post_id, img_order, img_url)
VALUES (1, 0, 'https://picsum.photos/id/101/200'),
       (1, 1, 'https://picsum.photos/id/102/200'),
       (1, 2, 'https://picsum.photos/id/103/200'),
       (2, 0, 'https://picsum.photos/id/104/200'),
       (2, 1, 'https://picsum.photos/id/105/200'),
       (2, 2, 'https://picsum.photos/id/106/200'),
       (3, 0, 'https://picsum.photos/id/107/200'),
       (3, 1, 'https://picsum.photos/id/108/200'),
       (3, 2, 'https://picsum.photos/id/109/200'),
       (4, 0, 'https://picsum.photos/id/110/200'),
       (4, 1, 'https://picsum.photos/id/111/200'),
       (4, 2, 'https://picsum.photos/id/112/200'),
       (5, 0, 'https://picsum.photos/id/113/200'),
       (5, 1, 'https://picsum.photos/id/114/200'),
       (5, 2, 'https://picsum.photos/id/115/200'),
       (6, 0, 'https://picsum.photos/id/116/200'),
       (6, 1, 'https://picsum.photos/id/117/200'),
       (6, 2, 'https://picsum.photos/id/118/200'),
       (7, 0, 'https://picsum.photos/id/119/200'),
       (7, 1, 'https://picsum.photos/id/120/200'),
       (7, 2, 'https://picsum.photos/id/121/200'),
       (8, 0, 'https://picsum.photos/id/122/200'),
       (8, 1, 'https://picsum.photos/id/123/200'),
       (8, 2, 'https://picsum.photos/id/124/200'),
       (9, 0, 'https://picsum.photos/id/125/200'),
       (9, 1, 'https://picsum.photos/id/126/200'),
       (9, 2, 'https://picsum.photos/id/127/200'),
       (10, 0, 'https://picsum.photos/id/128/200'),
       (10, 1, 'https://picsum.photos/id/129/200'),
       (10, 2, 'https://picsum.photos/id/130/200'),
       (11, 0, 'https://picsum.photos/id/131/200'),
       (11, 1, 'https://picsum.photos/id/132/200'),
       (11, 2, 'https://picsum.photos/id/133/200'),
       (12, 0, 'https://picsum.photos/id/134/200'),
       (12, 1, 'https://picsum.photos/id/135/200'),
       (12, 2, 'https://picsum.photos/id/136/200'),
       (13, 0, 'https://picsum.photos/id/137/200'),
       (13, 1, 'https://picsum.photos/id/138/200'),
       (13, 2, 'https://picsum.photos/id/139/200'),
       (14, 0, 'https://picsum.photos/id/140/200'),
       (14, 1, 'https://picsum.photos/id/141/200'),
       (14, 2, 'https://picsum.photos/id/142/200'),
       (15, 0, 'https://picsum.photos/id/143/200'),
       (15, 1, 'https://picsum.photos/id/144/200'),
       (15, 2, 'https://picsum.photos/id/145/200'),
       (16, 0, 'https://picsum.photos/id/146/200'),
       (16, 1, 'https://picsum.photos/id/147/200'),
       (16, 2, 'https://picsum.photos/id/148/200'),
       (17, 0, 'https://picsum.photos/id/149/200'),
       (17, 1, 'https://picsum.photos/id/150/200'),
       (17, 2, 'https://picsum.photos/id/151/200'),
       (18, 0, 'https://picsum.photos/id/152/200'),
       (18, 1, 'https://picsum.photos/id/153/200'),
       (18, 2, 'https://picsum.photos/id/154/200'),
       (19, 0, 'https://picsum.photos/id/155/200'),
       (19, 1, 'https://picsum.photos/id/156/200'),
       (19, 2, 'https://picsum.photos/id/157/200'),
       (20, 0, 'https://picsum.photos/id/158/200'),
       (20, 1, 'https://picsum.photos/id/159/200'),
       (20, 2, 'https://picsum.photos/id/160/200'),
       (21, 0, 'https://picsum.photos/id/161/200'),
       (21, 1, 'https://picsum.photos/id/162/200'),
       (21, 2, 'https://picsum.photos/id/163/200'),
       (22, 0, 'https://picsum.photos/id/164/200'),
       (22, 1, 'https://picsum.photos/id/165/200'),
       (22, 2, 'https://picsum.photos/id/166/200'),
       (23, 0, 'https://picsum.photos/id/167/200'),
       (23, 1, 'https://picsum.photos/id/168/200'),
       (23, 2, 'https://picsum.photos/id/169/200'),
       (24, 0, 'https://picsum.photos/id/170/200'),
       (24, 1, 'https://picsum.photos/id/171/200'),
       (24, 2, 'https://picsum.photos/id/172/200'),
       (25, 0, 'https://picsum.photos/id/173/200'),
       (25, 1, 'https://picsum.photos/id/174/200'),
       (25, 2, 'https://picsum.photos/id/175/200'),
       (26, 0, 'https://picsum.photos/id/176/200'),
       (26, 1, 'https://picsum.photos/id/177/200'),
       (26, 2, 'https://picsum.photos/id/178/200'),
       (27, 0, 'https://picsum.photos/id/179/200'),
       (27, 1, 'https://picsum.photos/id/180/200'),
       (27, 2, 'https://picsum.photos/id/181/200'),
       (28, 0, 'https://picsum.photos/id/182/200'),
       (28, 1, 'https://picsum.photos/id/183/200'),
       (28, 2, 'https://picsum.photos/id/184/200'),
       (29, 0, 'https://picsum.photos/id/185/200'),
       (29, 1, 'https://picsum.photos/id/186/200'),
       (29, 2, 'https://picsum.photos/id/187/200'),
       (30, 0, 'https://picsum.photos/id/188/200'),
       (30, 1, 'https://picsum.photos/id/189/200'),
       (30, 2, 'https://picsum.photos/id/190/200'),
       (31, 0, 'https://picsum.photos/id/191/200'),
       (31, 1, 'https://picsum.photos/id/192/200'),
       (31, 2, 'https://picsum.photos/id/193/200'),
       (32, 0, 'https://picsum.photos/id/194/200'),
       (32, 1, 'https://picsum.photos/id/195/200'),
       (32, 2, 'https://picsum.photos/id/196/200'),
       (33, 0, 'https://picsum.photos/id/197/200'),
       (33, 1, 'https://picsum.photos/id/198/200'),
       (33, 2, 'https://picsum.photos/id/199/200'),
       (34, 0, 'https://picsum.photos/id/200/200'),
       (34, 1, 'https://picsum.photos/id/201/200'),
       (34, 2, 'https://picsum.photos/id/202/200'),
       (35, 0, 'https://picsum.photos/id/203/200'),
       (35, 1, 'https://picsum.photos/id/204/200'),
       (35, 2, 'https://picsum.photos/id/205/200'),
       (36, 0, 'https://picsum.photos/id/206/200'),
       (36, 1, 'https://picsum.photos/id/207/200'),
       (36, 2, 'https://picsum.photos/id/208/200'),
       (37, 0, 'https://picsum.photos/id/209/200'),
       (37, 1, 'https://picsum.photos/id/210/200'),
       (37, 2, 'https://picsum.photos/id/211/200'),
       (38, 0, 'https://picsum.photos/id/212/200'),
       (38, 1, 'https://picsum.photos/id/213/200'),
       (38, 2, 'https://picsum.photos/id/214/200'),
       (39, 0, 'https://picsum.photos/id/215/200'),
       (39, 1, 'https://picsum.photos/id/216/200'),
       (39, 2, 'https://picsum.photos/id/217/200'),
       (40, 0, 'https://picsum.photos/id/218/200'),
       (40, 1, 'https://picsum.photos/id/219/200'),
       (40, 2, 'https://picsum.photos/id/220/200'),
       (41, 0, 'https://picsum.photos/id/221/200'),
       (41, 1, 'https://picsum.photos/id/222/200'),
       (41, 2, 'https://picsum.photos/id/223/200'),
       (42, 0, 'https://picsum.photos/id/224/200'),
       (42, 1, 'https://picsum.photos/id/225/200'),
       (42, 2, 'https://picsum.photos/id/226/200'),
       (43, 0, 'https://picsum.photos/id/227/200'),
       (43, 1, 'https://picsum.photos/id/228/200'),
       (43, 2, 'https://picsum.photos/id/229/200'),
       (44, 0, 'https://picsum.photos/id/230/200'),
       (44, 1, 'https://picsum.photos/id/231/200'),
       (44, 2, 'https://picsum.photos/id/232/200'),
       (45, 0, 'https://picsum.photos/id/233/200'),
       (45, 1, 'https://picsum.photos/id/234/200'),
       (45, 2, 'https://picsum.photos/id/235/200'),
       (46, 0, 'https://picsum.photos/id/236/200'),
       (46, 1, 'https://picsum.photos/id/237/200'),
       (46, 2, 'https://picsum.photos/id/238/200'),
       (47, 0, 'https://picsum.photos/id/239/200'),
       (47, 1, 'https://picsum.photos/id/240/200'),
       (47, 2, 'https://picsum.photos/id/241/200'),
       (48, 0, 'https://picsum.photos/id/242/200'),
       (48, 1, 'https://picsum.photos/id/243/200'),
       (48, 2, 'https://picsum.photos/id/244/200'),
       (49, 0, 'https://picsum.photos/id/245/200'),
       (49, 1, 'https://picsum.photos/id/246/200'),
       (49, 2, 'https://picsum.photos/id/247/200'),
       (50, 0, 'https://picsum.photos/id/248/200'),
       (50, 1, 'https://picsum.photos/id/249/200'),
       (50, 2, 'https://picsum.photos/id/250/200');

-- posting_comments 데이터 삽입
INSERT INTO posting_comments (user_id, post_id, contents)
VALUES ('user1001', 1, '이 포스팅 정말 멋지네요!'),
       ('user1002', 2, '이 장소 너무 좋아요. 가고 싶어요!'),
       ('user1003', 3, '저도 이런 경험을 하고 싶어요!'),
       ('user1004', 4, '사진이 정말 예쁘네요. 여행 가고 싶어요.'),
       ('user1005', 5, '이 포스팅 덕분에 좋은 정보를 알게 됐어요!'),
       ('user1006', 6, '멋진 사진이네요. 또 가보고 싶어요.'),
       ('user1007', 7, '정말 대단한 경험이네요! 저도 도전해보고 싶어요.'),
       ('user1008', 8, '이 포스팅 보고 나도 꼭 가야겠어요!'),
       ('user1009', 9, '와, 이 사진 너무 감동적이네요!'),
       ('user1010', 10, '저도 이런 포스팅을 자주 보고 싶어요.'),
       ('user1011', 11, '이 여행지 정말 좋네요. 가고 싶어요!'),
       ('user1012', 12, '너무 멋진 풍경이에요. 다음에 가고 싶어요.'),
       ('user1013', 13, '여기 정말 아름다워요. 꼭 가보고 싶어요.'),
       ('user1014', 14, '이 포스팅 덕분에 장소에 대해 알게 됐어요!'),
       ('user1015', 15, '정말 멋진 장소네요. 꼭 가봐야겠어요.'),
       ('user1016', 16, '저도 이 경험을 해보고 싶어요. 포스팅 감사해요.'),
       ('user1017', 17, '이 곳을 알게 돼서 너무 기뻐요. 가고 싶어요!'),
       ('user1018', 18, '너무 멋지네요. 나도 이렇게 멋지게 찍고 싶어요.'),
       ('user1019', 19, '이곳을 꼭 가야겠어요! 감사합니다!'),
       ('user1020', 20, '정말 멋진 경험이네요. 저도 꼭 가보고 싶어요.'),
       ('user1021', 21, '와, 여기 너무 예뻐요. 가고 싶어요.'),
       ('user1022', 22, '이 포스팅 덕분에 좋은 장소를 알게 됐어요.'),
       ('user1023', 23, '이 여행지 정말 좋네요. 꼭 가보고 싶어요.'),
       ('user1024', 24, '저도 이런 장소에서 사진 찍어보고 싶어요.'),
       ('user1025', 25, '정말 대단한 곳이에요! 다음에는 가봐야겠어요.'),
       ('user1026', 26, '이 포스팅을 보고 나서 가고 싶어졌어요.'),
       ('user1027', 27, '멋진 여행지 소개해주셔서 감사합니다.'),
       ('user1028', 28, '이 곳 정말 예뻐요. 다음에 꼭 가보고 싶어요.'),
       ('user1029', 29, '저도 가고 싶어요! 이런 정보 너무 좋네요.'),
       ('user1030', 30, '정말 감동적인 여행이었겠어요.'),
       ('user1031', 31, '이 사진 정말 예쁘네요! 나도 찍고 싶어요.'),
       ('user1032', 32, '여기 정말 멋져요. 꼭 한번 가봐야겠어요.'),
       ('user1033', 33, '이 여행지 너무 예뻐요. 꼭 가고 싶어요.'),
       ('user1034', 34, '정말 멋진 장소를 알게 됐어요. 감사해요.'),
       ('user1035', 35, '저도 꼭 가고 싶어요! 이런 장소 찾기 힘들어요.'),
       ('user1036', 36, '이 포스팅을 보고 나서 여행 계획을 세우고 있어요.'),
       ('user1037', 37, '와, 이 곳은 정말 환상적이네요. 꼭 가야겠어요.'),
       ('user1038', 38, '이곳을 알게 돼서 정말 좋네요! 가고 싶어요.'),
       ('user1039', 39, '이 포스팅 덕분에 여행 계획을 다시 세우고 있어요.'),
       ('user1040', 40, '정말 멋진 사진이에요. 나도 이런 여행을 가보고 싶어요.'),
       ('user1041', 41, '이 여행지 너무 좋아요! 꼭 가고 싶어요.'),
       ('user1042', 42, '이곳을 알게 돼서 너무 기쁩니다. 감사해요!'),
       ('user1043', 43, '멋진 여행이었겠네요. 저도 가보고 싶어요.'),
       ('user1044', 44, '이 사진 정말 예쁘네요! 꼭 가봐야겠어요.'),
       ('user1045', 45, '저도 이런 여행을 해보고 싶어요. 멋진 사진이에요!'),
       ('user1046', 46, '와, 이 곳 너무 예뻐요! 나도 가고 싶어요.'),
       ('user1047', 47, '이 장소 정말 멋지네요. 감사합니다!'),
       ('user1048', 48, '정말 감동적인 여행지네요. 나도 가보고 싶어요.'),
       ('user1049', 49, '이곳 정말 멋져요. 꼭 가봐야겠어요.'),
       ('user1050', 50, '정말 좋은 장소를 소개해주셔서 감사합니다. 나도 가보고 싶어요!'),
       ('user1001', 51, '이 곳 너무 아름다워요! 꼭 가고 싶어요.'),
       ('user1002', 52, '사진 속 풍경 너무 예쁘네요! 여행 가고 싶어요.'),
       ('user1003', 53, '저도 이런 여행을 해보고 싶어요. 정보 감사합니다.'),
       ('user1004', 54, '이 곳 정말 멋져요! 한 번 가고 싶어요.'),
       ('user1005', 55, '정말 감동적인 장소네요. 꼭 방문해야겠어요.'),
       ('user1006', 56, '이 사진 보고 나서 여행 가고 싶어졌어요.'),
       ('user1007', 57, '와, 이곳은 정말 환상적이네요! 가보고 싶어요.'),
       ('user1008', 58, '이곳을 알게 돼서 정말 좋네요. 감사합니다!'),
       ('user1009', 59, '이 포스팅 덕분에 좋은 여행지를 알게 됐어요!'),
       ('user1010', 60, '멋진 풍경이네요. 꼭 가고 싶어요!'),
       ('user1011', 61, '여기 정말 예쁘네요. 나도 가고 싶어요.'),
       ('user1012', 62, '이 곳 너무 멋져요! 가고 싶은 장소가 하나 더 늘었어요.'),
       ('user1013', 63, '정말 멋진 사진이에요. 나도 이렇게 찍고 싶어요!'),
       ('user1014', 64, '이 여행지 너무 좋네요. 저도 가봐야겠어요.'),
       ('user1015', 65, '정말 멋진 장소네요! 꼭 가야겠어요.'),
       ('user1016', 66, '이곳을 알게 돼서 기쁩니다. 꼭 가고 싶어요!'),
       ('user1017', 67, '이 포스팅 덕분에 여행 계획을 세울 수 있었어요. 감사합니다.'),
       ('user1018', 68, '정말 멋진 풍경이에요. 저도 찍어보고 싶어요.'),
       ('user1019', 69, '이곳을 꼭 가야겠어요! 정보를 주셔서 감사합니다.'),
       ('user1020', 70, '와, 여기는 정말 예쁜 곳이네요. 가고 싶어요.'),
       ('user1021', 71, '이곳 너무 좋네요! 다음에 꼭 가보고 싶어요.'),
       ('user1022', 72, '정말 아름다운 장소예요. 저도 가고 싶어요.'),
       ('user1023', 73, '이 포스팅 보고 나서 여기 가고 싶어졌어요.'),
       ('user1024', 74, '정말 멋진 풍경이에요. 나도 찍고 싶어요.'),
       ('user1025', 75, '이 여행지 너무 예뻐요! 감사합니다!'),
       ('user1026', 76, '이 포스팅 보고 여행 계획 세워요. 감사해요!'),
       ('user1027', 77, '정말 멋진 여행지네요. 나도 꼭 가고 싶어요!'),
       ('user1028', 78, '이곳을 알게 돼서 기쁩니다. 꼭 가고 싶어요!'),
       ('user1029', 79, '이 포스팅 덕분에 좋은 여행지를 알게 됐어요!'),
       ('user1030', 80, '이 곳 너무 멋져요! 다음에 가고 싶어요.'),
       ('user1031', 81, '여기 정말 멋져요. 꼭 가보고 싶어요.'),
       ('user1032', 82, '이 포스팅 보고 나서 가고 싶은 곳이 추가되었어요!'),
       ('user1033', 83, '정말 멋진 장소네요. 가고 싶어요.'),
       ('user1034', 84, '와, 여기는 정말 예쁘네요. 꼭 가보고 싶어요.'),
       ('user1035', 85, '이 여행지 정말 좋네요. 정보 감사합니다!'),
       ('user1036', 86, '이곳을 알게 돼서 너무 기뻐요. 꼭 가야겠어요.'),
       ('user1037', 87, '정말 감동적인 여행지네요. 나도 가고 싶어요.'),
       ('user1038', 88, '이 포스팅 덕분에 여행지 선택이 쉬워졌어요.'),
       ('user1039', 89, '여기 정말 멋지네요. 저도 가보고 싶어요.'),
       ('user1040', 90, '정말 예쁜 풍경이에요. 나도 찍어보고 싶어요.'),
       ('user1041', 91, '이곳을 알게 돼서 너무 좋네요! 꼭 가고 싶어요.'),
       ('user1042', 92, '여기 정말 예쁘네요. 가고 싶어요.'),
       ('user1043', 93, '이 여행지 너무 예뻐요! 가고 싶어요.'),
       ('user1044', 94, '정말 멋진 풍경이에요. 저도 가고 싶어요.'),
       ('user1045', 95, '이 포스팅 덕분에 여행지를 알게 됐어요. 감사합니다!'),
       ('user1046', 96, '정말 멋진 장소네요. 꼭 가야겠어요.'),
       ('user1047', 97, '이곳을 알게 돼서 너무 기뻐요. 꼭 가보고 싶어요.'),
       ('user1048', 98, '여기 정말 아름다워요. 나도 가고 싶어요.'),
       ('user1049', 99, '정말 멋진 장소네요. 꼭 가봐야겠어요.'),
       ('user1050', 100, '이곳 너무 멋져요. 사진 보고 나서 가고 싶어요!');


INSERT INTO rents (rt_id, user_id, rt_name, rt_address, rt_capacity, rt_info, created_at)
VALUES (6, 'user1001', 'Ocean View Apartment', '123 Beach Road, Miami', 4,
        'A beautiful beachside apartment with stunning views.', NOW()),
       (7, 'user1002', 'City Center Condo', '456 Downtown Lane, New York', 3,
        'Convenient location, perfect for exploring the city.', NOW()),
       (8, 'user1003', 'Mountain Cabin', '789 Hilltop Drive, Denver', 6,
        'Rustic cabin surrounded by breathtaking mountain scenery.', NOW()),
       (9, 'user1004', 'Lakefront Villa', '101 Lakeside Ave, Chicago', 8,
        'Luxurious villa with direct access to the lake.', NOW()),
       (10, 'user1005', 'Cozy Studio', '202 Quiet Street, Austin', 2,
        'A small yet cozy studio in a peaceful neighborhood.', NOW());

INSERT INTO rent_rooms (room_id, rt_id, room_name, price_per_unit, rt_unit, ctgr, min_time)
VALUES (1, 1, 'Ocean Suite', 150, 'day', 'Premium', 1),
       (2, 1, 'Balcony Room', 100, 'day', 'Standard', 1),
       (3, 2, 'City View Room', 120, 'hour', 'Standard', 2),
       (4, 3, 'Loft Room', 200, 'hour', 'Deluxe', 3),
       (5, 4, 'Lakeview Master', 300, 'hour', 'Luxury', 2);

INSERT INTO rent_reviews (review_id, rt_id, user_id, rate, contents, is_used, created_at)
VALUES (1, 1, 'user1001', 5, 'Beautiful place with an amazing view!', TRUE, NOW()),
       (2, 2, 'user1002', 4, 'Very convenient location, but a bit noisy.', TRUE, NOW()),
       (3, 3, 'user1003', 5, 'The cabin was cozy and perfect for our getaway!', TRUE, NOW()),
       (4, 4, 'user1004', 3, 'The villa was nice, but some amenities were lacking.', TRUE, NOW()),
       (5, 5, 'user1005', 5, 'Perfect spot for a peaceful retreat, loved it!', TRUE, NOW());

INSERT INTO rent_review_images (img_id, user_id, img_url, created_at)
VALUES (1, 'user1001', 'https://dummyimage.com/500x500/808100/fff.jpg', NOW()),
       (2, 'user1002', 'https://dummyimage.com/500x500/808200/fff.jpg', NOW()),
       (3, 'user1003', 'https://dummyimage.com/500x500/808300/fff.jpg', NOW()),
       (4, 'user1004', 'https://dummyimage.com/500x500/808400/fff.jpg', NOW()),
       (5, 'user1005', 'https://dummyimage.com/500x500/808500/fff.jpg', NOW());

INSERT INTO rent_item_options (opt_id, rt_id, opt_name, extra_fee)
VALUES (1, 1, 'Breakfast', 20),
       (2, 2, 'Parking', 15),
       (3, 3, 'Firewood Bundle', 25),
       (4, 4, 'Boat Rental', 50),
       (5, 5, 'Room Cleaning', 30);

INSERT INTO rent_images (rt_img_id, rt_id, img_order, img_url, created_at)
VALUES (1, 1, 1, 'https://dummyimage.com/500x500/809000/fff.jpg', NOW()),
       (2, 2, 1, 'https://dummyimage.com/500x500/809001/fff.jpg', NOW()),
       (3, 3, 1, 'https://dummyimage.com/500x500/809002/fff.jpg', NOW()),
       (4, 4, 1, 'https://dummyimage.com/500x500/809003/fff.jpg', NOW()),
       (5, 5, 1, 'https://dummyimage.com/500x500/809004/fff.jpg', NOW());

INSERT INTO rent_detail_images (img_id, rt_id, img_url, img_order, user_id, created_at)
VALUES (1, 1, 'https://dummyimage.com/600x400/809005/fff.jpg', 1, 'user1001', NOW()),
       (2, 2, 'https://dummyimage.com/600x400/809006/fff.jpg', 2, 'user1002', NOW()),
       (3, 3, 'https://dummyimage.com/600x400/809007/fff.jpg', 3, 'user1003', NOW()),
       (4, 4, 'https://dummyimage.com/600x400/809008/fff.jpg', 4, 'user1004', NOW()),
       (5, 5, 'https://dummyimage.com/600x400/809009/fff.jpg', 5, 'user1005', NOW());

INSERT INTO rent_dates (rt_date_id, rt_id, rt_date, rt_price)
VALUES (1, 1, '2023-10-01', 200),
       (2, 2, '2023-10-02', 150),
       (3, 3, '2023-10-03', 250),
       (4, 4, '2023-10-04', 300),
       (5, 5, '2023-10-05', 180);
-- search_words 데이터 삽입 (200개)
INSERT INTO search_words (keyword, user_id)
VALUES ('여행', 'user1001'),
       ('맛집', 'user1002'),
       ('서울', 'user1003'),
       ('음악', 'user1004'),
       ('영화', 'user1005'),
       ('맛집', 'user1006'),
       ('사진', 'user1007'),
       ('도시', 'user1008'),
       ('산책', 'user1009'),
       ('해외여행', 'user1010'),
       ('음악', 'user1011'),
       ('영화', 'user1012'),
       ('커피', 'user1013'),
       ('서울', 'user1014'),
       ('패션', 'user1015'),
       ('날씨', 'user1016'),
       ('게임', 'user1017'),
       ('자연', 'user1018'),
       ('책', 'user1019'),
       ('음악', 'user1020'),
       ('여행', 'user1021'),
       ('맛집', 'user1022'),
       ('서울', 'user1023'),
       ('패션', 'user1024'),
       ('디자인', 'user1025'),
       ('산책', 'user1026'),
       ('문화', 'user1027'),
       ('도시', 'user1028'),
       ('음식', 'user1029'),
       ('디지털', 'user1030'),
       ('모바일', 'user1031'),
       ('커피', 'user1032'),
       ('패션', 'user1033'),
       ('게임', 'user1034'),
       ('뷰티', 'user1035'),
       ('책', 'user1036'),
       ('여행', 'user1037'),
       ('사진', 'user1038'),
       ('영화', 'user1039'),
       ('테크', 'user1040'),
       ('디지털', 'user1041'),
       ('영화', 'user1042'),
       ('자연', 'user1043'),
       ('산책', 'user1044'),
       ('패션', 'user1045'),
       ('서울', 'user1046'),
       ('커피', 'user1047'),
       ('맛집', 'user1048'),
       ('디지털', 'user1049'),
       ('게임', 'user1050'),
       ('서울', 'user1051'),
       ('책', 'user1052'),
       ('여행', 'user1053'),
       ('도시', 'user1054'),
       ('패션', 'user1055'),
       ('음악', 'user1056'),
       ('영화', 'user1057'),
       ('자연', 'user1058'),
       ('커피', 'user1059'),
       ('사진', 'user1060'),
       ('맛집', 'user1061'),
       ('서울', 'user1062'),
       ('디지털', 'user1063'),
       ('도시', 'user1064'),
       ('게임', 'user1065'),
       ('산책', 'user1066'),
       ('패션', 'user1067'),
       ('책', 'user1068'),
       ('여행', 'user1069'),
       ('디지털', 'user1070'),
       ('영화', 'user1071'),
       ('음악', 'user1072'),
       ('자연', 'user1073'),
       ('커피', 'user1074'),
       ('서울', 'user1075'),
       ('패션', 'user1076'),
       ('맛집', 'user1077'),
       ('산책', 'user1078'),
       ('여행', 'user1079'),
       ('디지털', 'user1080'),
       ('게임', 'user1081'),
       ('테크', 'user1082'),
       ('서울', 'user1083'),
       ('맛집', 'user1084'),
       ('도시', 'user1085'),
       ('영화', 'user1086'),
       ('책', 'user1087'),
       ('패션', 'user1088'),
       ('음악', 'user1089'),
       ('자연', 'user1090'),
       ('여행', 'user1091'),
       ('디지털', 'user1092'),
       ('맛집', 'user1093'),
       ('산책', 'user1094'),
       ('커피', 'user1095'),
       ('서울', 'user1096'),
       ('게임', 'user1097'),
       ('도시', 'user1098'),
       ('패션', 'user1099'),
       ('영화', 'user1100'),
       ('맛집', 'user1001'),
       ('자연', 'user1002'),
       ('여행', 'user1003'),
       ('음악', 'user1004'),
       ('커피', 'user1005'),
       ('디지털', 'user1006'),
       ('도시', 'user1007'),
       ('산책', 'user1008'),
       ('영화', 'user1009'),
       ('게임', 'user1010'),
       ('서울', 'user1011'),
       ('맛집', 'user1012'),
       ('디지털', 'user1013'),
       ('자연', 'user1014'),
       ('패션', 'user1015'),
       ('책', 'user1016'),
       ('도시', 'user1017'),
       ('맛집', 'user1018'),
       ('영화', 'user1019'),
       ('음악', 'user1020'),
       ('자연', 'user1021'),
       ('커피', 'user1022'),
       ('패션', 'user1023'),
       ('게임', 'user1024'),
       ('맛집', 'user1025'),
       ('서울', 'user1026'),
       ('산책', 'user1027'),
       ('영화', 'user1028'),
       ('음악', 'user1029'),
       ('책', 'user1030'),
       ('여행', 'user1031'),
       ('디지털', 'user1032'),
       ('패션', 'user1033'),
       ('산책', 'user1034'),
       ('도시', 'user1035'),
       ('맛집', 'user1036'),
       ('영화', 'user1037'),
       ('자연', 'user1038'),
       ('커피', 'user1039'),
       ('서울', 'user1040'),
       ('패션', 'user1041'),
       ('게임', 'user1042'),
       ('맛집', 'user1043'),
       ('디지털', 'user1044'),
       ('여행', 'user1045'),
       ('사진', 'user1046'),
       ('도시', 'user1047'),
       ('책', 'user1048'),
       ('영화', 'user1049'),
       ('음악', 'user1050');


INSERT INTO user_carts (user_id, product_id, product_type)
VALUES ('user1001', 6, 'event'),
       ('user1001', 9, 'event'),
       ('user1001', 12, 'event'),
       ('user1002', 15, 'event'),
       ('user1002', 18, 'event'),
       ('user1002', 21, 'event'),
       ('user1003', 24, 'event'),
       ('user1003', 27, 'event'),
       ('user1003', 30, 'event'),
       ('user1004', 33, 'event'),
       ('user1004', 36, 'event'),
       ('user1004', 39, 'event'),
       ('user1005', 42, 'event'),
       ('user1005', 45, 'event'),
       ('user1005', 48, 'event'),
       ('user1006', 51, 'event'),
       ('user1006', 54, 'event'),
       ('user1006', 57, 'event'),
       ('user1007', 60, 'event'),
       ('user1007', 63, 'event'),
       ('user1007', 66, 'event'),
       ('user1008', 6, 'event'),
       ('user1008', 9, 'event'),
       ('user1008', 12, 'event'),
       ('user1009', 15, 'event'),
       ('user1009', 18, 'event'),
       ('user1009', 21, 'event'),
       ('user1010', 24, 'event'),
       ('user1010', 27, 'event'),
       ('user1010', 30, 'event'),
       ('user1011', 33, 'event'),
       ('user1011', 36, 'event'),
       ('user1011', 39, 'event'),
       ('user1012', 42, 'event'),
       ('user1012', 45, 'event'),
       ('user1012', 48, 'event'),
       ('user1013', 51, 'event'),
       ('user1013', 54, 'event'),
       ('user1013', 57, 'event'),
       ('user1014', 60, 'event'),
       ('user1014', 63, 'event'),
       ('user1014', 66, 'event'),
       ('user1015', 6, 'event'),
       ('user1015', 9, 'event'),
       ('user1015', 12, 'event'),
       ('user1016', 15, 'event'),
       ('user1016', 18, 'event'),
       ('user1016', 21, 'event'),
       ('user1017', 24, 'event'),
       ('user1017', 27, 'event'),
       ('user1017', 30, 'event'),
       ('user1018', 33, 'event'),
       ('user1018', 36, 'event'),
       ('user1018', 39, 'event'),
       ('user1019', 42, 'event'),
       ('user1019', 45, 'event'),
       ('user1019', 48, 'event'),
       ('user1020', 51, 'event'),
       ('user1020', 54, 'event'),
       ('user1020', 57, 'event'),
       ('user1021', 60, 'event'),
       ('user1021', 63, 'event'),
       ('user1021', 66, 'event'),
       ('user1022', 6, 'event'),
       ('user1022', 9, 'event'),
       ('user1022', 12, 'event'),
       ('user1023', 15, 'event'),
       ('user1023', 18, 'event'),
       ('user1023', 21, 'event'),
       ('user1024', 24, 'event'),
       ('user1024', 27, 'event'),
       ('user1024', 30, 'event'),
       ('user1025', 33, 'event'),
       ('user1025', 36, 'event'),
       ('user1025', 39, 'event'),
       ('user1026', 42, 'event'),
       ('user1026', 45, 'event'),
       ('user1026', 48, 'event'),
       ('user1027', 51, 'event'),
       ('user1027', 54, 'event'),
       ('user1027', 57, 'event'),
       ('user1028', 60, 'event'),
       ('user1028', 63, 'event'),
       ('user1028', 66, 'event'),
       ('user1029', 6, 'event'),
       ('user1029', 9, 'event'),
       ('user1029', 12, 'event'),
       ('user1030', 15, 'event'),
       ('user1030', 18, 'event'),
       ('user1030', 21, 'event'),
       ('user1031', 24, 'event'),
       ('user1031', 27, 'event'),
       ('user1031', 30, 'event'),
       ('user1032', 33, 'event'),
       ('user1032', 36, 'event'),
       ('user1032', 39, 'event'),
       ('user1033', 42, 'event'),
       ('user1033', 45, 'event'),
       ('user1033', 48, 'event'),
       ('user1034', 51, 'event'),
       ('user1034', 54, 'event'),
       ('user1034', 57, 'event'),
       ('user1035', 60, 'event'),
       ('user1035', 63, 'event'),
       ('user1035', 66, 'event'),
       ('user1036', 6, 'event'),
       ('user1036', 9, 'event'),
       ('user1036', 12, 'event'),
       ('user1037', 15, 'event'),
       ('user1037', 18, 'event'),
       ('user1037', 21, 'event'),
       ('user1038', 24, 'event'),
       ('user1038', 27, 'event'),
       ('user1038', 30, 'event'),
       ('user1039', 33, 'event'),
       ('user1039', 36, 'event'),
       ('user1039', 39, 'event'),
       ('user1040', 42, 'event'),
       ('user1040', 45, 'event'),
       ('user1040', 48, 'event'),
       ('user1041', 51, 'event'),
       ('user1041', 54, 'event'),
       ('user1041', 57, 'event'),
       ('user1042', 60, 'event'),
       ('user1042', 63, 'event'),
       ('user1042', 66, 'event'),
       ('user1043', 6, 'event'),
       ('user1043', 9, 'event'),
       ('user1043', 12, 'event'),
       ('user1044', 15, 'event'),
       ('user1044', 18, 'event'),
       ('user1044', 21, 'event'),
       ('user1045', 24, 'event'),
       ('user1045', 27, 'event'),
       ('user1045', 30, 'event');

-- user_coupons 데이터 삽입
INSERT INTO user_coupons (user_id, dc_price, coupon_name, coupon_details, requirement, end_date)
VALUES ('user1001', 3000, '무료배송 쿠폰', '배송비 무료 혜택', '50,000원 이상 구매 시', '2025-12-31 23:59:59'),
       ('user1001', 4500, '여름 할인 쿠폰', '여름 시즌 한정 할인', '30,000원 이상 구매 시', '2025-08-31 23:59:59'),
       ('user1002', 3200, '생일 쿠폰', '생일 기념 10% 할인', '생일 당일 사용 가능', '2025-07-01 23:59:59'),
       ('user1002', 5000, '신규 가입 쿠폰', '첫 구매 시 5,000원 할인', '신규 회원 가입 후 첫 구매 시', '2025-12-31 23:59:59'),
       ('user1003', 3500, '주말 할인 쿠폰', '주말에만 사용할 수 있는 3,500원 할인', '주말에만 사용 가능', '2025-05-31 23:59:59'),
       ('user1003', 4000, '친구 추천 쿠폰', '친구 추천 시 제공되는 4,000원 할인', '추천인과 피추천인이 첫 구매 시', '2025-06-30 23:59:59'),
       ('user1004', 3900, '카드사 할인 쿠폰', '특정 카드사 결제 시 할인 제공', '특정 카드사 결제 시', '2025-07-31 23:59:59'),
       ('user1004', 3300, '추석 할인 쿠폰', '추석 맞이 특별 할인 쿠폰', '추석 연휴 전 사용', '2025-09-30 23:59:59'),
       ('user1005', 4200, '복권 응모 쿠폰', '복권 응모 시 제공되는 할인 쿠폰', '복권 응모 후 사용 가능', '2025-10-31 23:59:59'),
       ('user1005', 4800, '명절 선물 쿠폰', '명절 선물 할인 쿠폰', '선물세트 구매 시 사용 가능', '2025-12-25 23:59:59'),
       ('user1006', 3000, '겨울 시즌 쿠폰', '겨울 시즌 한정 3,000원 할인', '겨울 시즌에만 사용 가능', '2025-01-31 23:59:59'),
       ('user1006', 4500, '추석 대목 쿠폰', '추석 대목 할인 쿠폰', '추석 연휴 기간에 사용 가능', '2025-09-30 23:59:59'),
       ('user1007', 4000, '회원가입 1,000원 쿠폰', '회원가입 시 제공되는 1,000원 쿠폰', '회원가입 시 제공', '2025-08-01 23:59:59'),
       ('user1007', 3500, '배송비 0원 쿠폰', '배송비 0원 쿠폰', '2만 원 이상 구매 시', '2025-07-15 23:59:59'),
       ('user1008', 3100, '겨울철 할인 쿠폰', '겨울철 인기 상품 할인', '겨울철 상품에 한함', '2025-02-28 23:59:59'),
       ('user1008', 4700, '카드 결제 시 10% 할인', '카드 결제 시 10% 할인 혜택', '카드 결제 시', '2025-06-30 23:59:59'),
       ('user1009', 3200, '청춘 할인 쿠폰', '청년을 위한 할인 쿠폰', '20대 이하 사용 가능', '2025-11-30 23:59:59'),
       ('user1009', 4900, '결혼 기념 쿠폰', '결혼 기념 5,000원 할인 쿠폰', '결혼식 후 사용 가능', '2025-12-31 23:59:59'),
       ('user1010', 3300, '단체 주문 할인', '단체 주문 시 제공되는 3,300원 할인', '10명 이상 주문 시', '2025-07-20 23:59:59'),
       ('user1010', 4600, '신규 결제 쿠폰', '첫 결제 시 4,600원 할인', '첫 결제 시 사용 가능', '2025-06-15 23:59:59'),
       ('user1011', 3000, '소셜 미디어 할인 쿠폰', 'SNS 공유 시 할인 혜택 제공', 'SNS 공유 후 사용 가능', '2025-07-31 23:59:59'),
       ('user1011', 4400, '스페셜 선물 쿠폰', '스페셜 선물 세트 할인 쿠폰', '스페셜 선물에 한함', '2025-10-31 23:59:59'),
       ('user1012', 3600, '연말 특가 쿠폰', '연말 특가 3,600원 할인', '연말 쇼핑에 사용', '2025-12-31 23:59:59'),
       ('user1012', 4800, '크리스마스 할인 쿠폰', '크리스마스 한정 할인 쿠폰', '12월 25일까지 사용', '2025-12-25 23:59:59'),
       ('user1013', 4300, '무료 반품 쿠폰', '무료 반품 혜택 제공', '반품 시 사용 가능', '2025-09-30 23:59:59'),
       ('user1013', 3000, '추석 맞이 쿠폰', '추석 기념 쿠폰', '추석 연휴 사용 가능', '2025-09-30 23:59:59'),
       ('user1014', 3800, '가을 할인 쿠폰', '가을 한정 할인 쿠폰', '가을 상품에 한함', '2025-11-30 23:59:59'),
       ('user1014', 3000, '블랙 프라이데이 쿠폰', '블랙 프라이데이 할인 쿠폰', '11월 27일 사용 가능', '2025-11-27 23:59:59'),
       ('user1015', 4500, '추석 특별 할인', '추석 기념 특별 할인 쿠폰', '추석 연휴 기간 사용', '2025-09-30 23:59:59'),
       ('user1015', 3200, '여름 끝자락 쿠폰', '여름 한정 할인 쿠폰', '여름 상품에 한함', '2025-08-31 23:59:59'),
       ('user1016', 5000, '여름맞이 쿠폰', '여름 맞이 할인 쿠폰', '여름 상품에 한정', '2025-07-31 23:59:59'),
       ('user1016', 4000, '연휴 할인 쿠폰', '연휴 기간에 사용할 수 있는 할인 쿠폰', '연휴 기간 사용 가능', '2025-08-15 23:59:59'),
       ('user1017', 4500, '발렌타인 쿠폰', '발렌타인 데이 기념 할인 쿠폰', '2월 14일에만 사용 가능', '2025-02-14 23:59:59'),
       ('user1017', 3500, '단골 쿠폰', '단골 고객을 위한 3,500원 할인 쿠폰', '3회 이상 구매 시 제공', '2025-12-31 23:59:59'),
       ('user1018', 4200, '신년 맞이 할인', '2025년 신년 맞이 할인 쿠폰', '1월 1일 사용 가능', '2025-01-01 23:59:59'),
       ('user1018', 4600, '고객 감사 쿠폰', '고객 감사 4,600원 할인 쿠폰', '감사 기간 내 사용', '2025-03-31 23:59:59'),
       ('user1019', 3900, '오프라인 매장 쿠폰', '오프라인 매장에서 사용할 수 있는 3,900원 할인', '오프라인 매장 사용 가능', '2025-06-30 23:59:59'),
       ('user1019', 3400, '여름 한정 쿠폰', '여름 한정 3,400원 할인 쿠폰', '여름 시즌에 한정', '2025-07-31 23:59:59'),
       ('user1020', 3000, '무료 음료 쿠폰', '매장 방문 시 무료 음료 쿠폰', '매장 방문 시 사용', '2025-05-31 23:59:59'),
       ('user1020', 4300, '주말 할인 쿠폰', '주말에만 사용할 수 있는 할인 쿠폰', '주말에만 사용 가능', '2025-04-30 23:59:59'),
       ('user1021', 4600, '스페셜 쿠폰', '특별 이벤트를 위한 4,600원 할인 쿠폰', '특정 기간 사용', '2025-07-31 23:59:59'),
       ('user1021', 3300, '명절 선물 할인 쿠폰', '명절 선물 세트 할인 쿠폰', '선물 세트 구매 시', '2025-09-30 23:59:59'),
       ('user1022', 3900, '친구 추천 쿠폰', '친구 추천 시 제공되는 3,900원 할인 쿠폰', '추천인과 피추천인 첫 구매 시 사용', '2025-08-31 23:59:59'),
       ('user1022', 4200, '디지털 상품 쿠폰', '디지털 상품 할인 쿠폰', '디지털 상품에 한정', '2025-09-30 23:59:59'),
       ('user1023', 4700, '추석 쿠폰', '추석 맞이 4,700원 할인 쿠폰', '추석 연휴 기간에 사용', '2025-09-30 23:59:59'),
       ('user1023', 5000, 'VIP 쿠폰', 'VIP 회원 전용 5,000원 할인 쿠폰', 'VIP 회원 전용', '2025-12-31 23:59:59'),
       ('user1024', 3500, '여름 세일 쿠폰', '여름 시즌 할인 쿠폰', '여름 세일 기간 동안 사용', '2025-06-30 23:59:59'),
       ('user1024', 3000, '빨리 끝내는 쿠폰', '얼리버드 3,000원 할인 쿠폰', '얼리버드 특별 할인', '2025-05-31 23:59:59'),
       ('user1025', 3900, '학생 할인 쿠폰', '학생을 위한 할인 쿠폰', '학생 인증 후 사용', '2025-12-31 23:59:59'),
       ('user1025', 4800, '스페셜 이벤트 쿠폰', '특별 이벤트 기간에만 사용할 수 있는 할인 쿠폰', '이벤트 기간에만 사용', '2025-08-15 23:59:59'),
       ('user1026', 3200, '카드사 할인 쿠폰', '특정 카드사 사용 시 제공되는 할인 쿠폰', '특정 카드사 결제 시 사용', '2025-06-30 23:59:59'),
       ('user1026', 4700, '여름 한정 할인 쿠폰', '여름 한정 4,700원 할인 쿠폰', '여름 시즌 상품에 한정', '2025-07-31 23:59:59');

INSERT INTO user_event_bmarks (user_id, event_related)
VALUES ('user1001', 3),
       ('user1001', 6),
       ('user1001', 9),
       ('user1001', 12),
       ('user1002', 2),
       ('user1002', 5),
       ('user1002', 8),
       ('user1002', 11),
       ('user1003', 1),
       ('user1003', 4),
       ('user1003', 7),
       ('user1003', 10),
       ('user1004', 2),
       ('user1004', 5),
       ('user1004', 13),
       ('user1004', 17),
       ('user1005', 3),
       ('user1005', 6),
       ('user1005', 9),
       ('user1005', 18),
       ('user1006', 7),
       ('user1006', 10),
       ('user1006', 16),
       ('user1006', 20),
       ('user1007', 1),
       ('user1007', 3),
       ('user1007', 8),
       ('user1007', 11),
       ('user1008', 5),
       ('user1008', 9),
       ('user1008', 12),
       ('user1008', 18),
       ('user1009', 2),
       ('user1009', 4),
       ('user1009', 6),
       ('user1009', 15),
       ('user1010', 5),
       ('user1010', 10),
       ('user1010', 13),
       ('user1010', 20),
       ('user1011', 3),
       ('user1011', 7),
       ('user1011', 11),
       ('user1011', 17),
       ('user1012', 4),
       ('user1012', 8),
       ('user1012', 14),
       ('user1012', 19),
       ('user1013', 6),
       ('user1013', 9),
       ('user1013', 12),
       ('user1013', 18),
       ('user1014', 2),
       ('user1014', 5),
       ('user1014', 10),
       ('user1014', 13),
       ('user1015', 7),
       ('user1015', 11),
       ('user1015', 15),
       ('user1015', 19),
       ('user1016', 1),
       ('user1016', 3),
       ('user1016', 6),
       ('user1016', 9),
       ('user1017', 4),
       ('user1017', 8),
       ('user1017', 12),
       ('user1017', 17),
       ('user1018', 2),
       ('user1018', 5),
       ('user1018', 7),
       ('user1018', 20),
       ('user1019', 6),
       ('user1019', 9),
       ('user1019', 13),
       ('user1019', 18),
       ('user1020', 8),
       ('user1020', 12),
       ('user1020', 14),
       ('user1020', 19),
       ('user1021', 5),
       ('user1021', 10),
       ('user1021', 15),
       ('user1021', 17),
       ('user1022', 2),
       ('user1022', 4),
       ('user1022', 11),
       ('user1022', 16),
       ('user1023', 1),
       ('user1023', 6),
       ('user1023', 9),
       ('user1023', 13),
       ('user1024', 7),
       ('user1024', 11),
       ('user1024', 17),
       ('user1024', 20),
       ('user1025', 4),
       ('user1025', 8),
       ('user1025', 12),
       ('user1025', 16),
       ('user1026', 3),
       ('user1026', 6),
       ('user1026', 9),
       ('user1026', 12),
       ('user1027', 2),
       ('user1027', 5),
       ('user1027', 10),
       ('user1027', 13),
       ('user1028', 1),
       ('user1028', 4),
       ('user1028', 7),
       ('user1028', 11),
       ('user1029', 6),
       ('user1029', 9),
       ('user1029', 12),
       ('user1029', 17),
       ('user1030', 3),
       ('user1030', 8),
       ('user1030', 11),
       ('user1030', 15),
       ('user1031', 4),
       ('user1031', 7),
       ('user1031', 14),
       ('user1031', 16),
       ('user1032', 2),
       ('user1032', 5),
       ('user1032', 10),
       ('user1032', 13),
       ('user1033', 1),
       ('user1033', 3),
       ('user1033', 6),
       ('user1033', 9),
       ('user1034', 5),
       ('user1034', 8),
       ('user1034', 11),
       ('user1034', 14),
       ('user1035', 7),
       ('user1035', 10),
       ('user1035', 13),
       ('user1035', 16),
       ('user1036', 4),
       ('user1036', 9),
       ('user1036', 12),
       ('user1036', 18),
       ('user1037', 2),
       ('user1037', 5),
       ('user1037', 8),
       ('user1037', 20),
       ('user1038', 1),
       ('user1038', 6),
       ('user1038', 9),
       ('user1038', 11),
       ('user1039', 7),
       ('user1039', 10),
       ('user1039', 14),
       ('user1039', 17),
       ('user1040', 3),
       ('user1040', 8),
       ('user1040', 13),
       ('user1040', 18),
       ('user1041', 4),
       ('user1041', 7),
       ('user1041', 10),
       ('user1041', 15),
       ('user1042', 1),
       ('user1042', 6),
       ('user1042', 9),
       ('user1042', 12),
       ('user1043', 5),
       ('user1043', 11),
       ('user1043', 14),
       ('user1043', 16),
       ('user1044', 6),
       ('user1044', 9),
       ('user1044', 13),
       ('user1044', 20),
       ('user1045', 7),
       ('user1045', 10),
       ('user1045', 14),
       ('user1045', 18),
       ('user1046', 8),
       ('user1046', 12),
       ('user1046', 15),
       ('user1046', 19),
       ('user1047', 2),
       ('user1047', 5),
       ('user1047', 11),
       ('user1047', 14),
       ('user1048', 4),
       ('user1048', 9),
       ('user1048', 12),
       ('user1048', 17),
       ('user1049', 3),
       ('user1049', 8),
       ('user1049', 10),
       ('user1049', 13),
       ('user1050', 1),
       ('user1050', 6),
       ('user1050', 9),
       ('user1050', 18);

INSERT INTO user_follow (follower_id, followee_id)
VALUES ('user1001', 'user1002'),
       ('user1001', 'user1003'),
       ('user1002', 'user1004'),
       ('user1002', 'user1005'),
       ('user1003', 'user1001'),
       ('user1003', 'user1004'),
       ('user1004', 'user1001'),
       ('user1004', 'user1005'),
       ('user1005', 'user1003'),
       ('user1005', 'user1002'),
       ('user1006', 'user1007'),
       ('user1006', 'user1008'),
       ('user1007', 'user1009'),
       ('user1007', 'user1010'),
       ('user1008', 'user1006'),
       ('user1008', 'user1009'),
       ('user1009', 'user1010'),
       ('user1009', 'user1011'),
       ('user1010', 'user1006'),
       ('user1010', 'user1011'),
       ('user1011', 'user1008'),
       ('user1011', 'user1009'),
       ('user1012', 'user1013'),
       ('user1012', 'user1014'),
       ('user1013', 'user1012'),
       ('user1013', 'user1015'),
       ('user1014', 'user1015'),
       ('user1014', 'user1012'),
       ('user1015', 'user1016'),
       ('user1015', 'user1017'),
       ('user1016', 'user1017'),
       ('user1016', 'user1018'),
       ('user1017', 'user1018'),
       ('user1017', 'user1019'),
       ('user1018', 'user1019'),
       ('user1018', 'user1020'),
       ('user1019', 'user1020'),
       ('user1019', 'user1021'),
       ('user1020', 'user1022'),
       ('user1020', 'user1023'),
       ('user1021', 'user1023'),
       ('user1021', 'user1022'),
       ('user1022', 'user1023'),
       ('user1022', 'user1024'),
       ('user1023', 'user1025'),
       ('user1023', 'user1024'),
       ('user1024', 'user1025'),
       ('user1024', 'user1026'),
       ('user1025', 'user1026'),
       ('user1025', 'user1027'),
       ('user1026', 'user1027'),
       ('user1026', 'user1028'),
       ('user1027', 'user1029'),
       ('user1027', 'user1028'),
       ('user1028', 'user1030'),
       ('user1028', 'user1029'),
       ('user1029', 'user1031'),
       ('user1029', 'user1030'),
       ('user1030', 'user1031'),
       ('user1030', 'user1032'),
       ('user1031', 'user1032'),
       ('user1031', 'user1033'),
       ('user1032', 'user1034'),
       ('user1032', 'user1033'),
       ('user1033', 'user1034'),
       ('user1033', 'user1035'),
       ('user1034', 'user1035'),
       ('user1034', 'user1036'),
       ('user1035', 'user1036'),
       ('user1035', 'user1037'),
       ('user1036', 'user1037'),
       ('user1036', 'user1038'),
       ('user1037', 'user1038'),
       ('user1037', 'user1039'),
       ('user1038', 'user1040'),
       ('user1038', 'user1039'),
       ('user1039', 'user1040'),
       ('user1039', 'user1041'),
       ('user1040', 'user1041'),
       ('user1040', 'user1042'),
       ('user1041', 'user1043'),
       ('user1041', 'user1042'),
       ('user1042', 'user1043'),
       ('user1042', 'user1044'),
       ('user1043', 'user1044'),
       ('user1043', 'user1045'),
       ('user1044', 'user1045'),
       ('user1044', 'user1046'),
       ('user1045', 'user1046'),
       ('user1045', 'user1047'),
       ('user1046', 'user1047'),
       ('user1046', 'user1048'),
       ('user1047', 'user1048'),
       ('user1047', 'user1049'),
       ('user1048', 'user1050'),
       ('user1048', 'user1049'),
       ('user1049', 'user1050'),
       ('user1049', 'user1051'),
       ('user1050', 'user1051'),
       ('user1001', 'user1051'),
       ('user1002', 'user1052'),
       ('user1002', 'user1053'),
       ('user1003', 'user1054'),
       ('user1003', 'user1055'),
       ('user1004', 'user1056'),
       ('user1004', 'user1057'),
       ('user1005', 'user1058'),
       ('user1005', 'user1059'),
       ('user1006', 'user1060'),
       ('user1006', 'user1061'),
       ('user1007', 'user1062'),
       ('user1007', 'user1063'),
       ('user1008', 'user1064'),
       ('user1008', 'user1065'),
       ('user1009', 'user1066'),
       ('user1009', 'user1067'),
       ('user1010', 'user1068'),
       ('user1010', 'user1069'),
       ('user1011', 'user1070'),
       ('user1011', 'user1071'),
       ('user1012', 'user1072'),
       ('user1012', 'user1073'),
       ('user1013', 'user1074'),
       ('user1013', 'user1075'),
       ('user1014', 'user1076'),
       ('user1014', 'user1077'),
       ('user1015', 'user1078'),
       ('user1015', 'user1079'),
       ('user1016', 'user1080'),
       ('user1016', 'user1081'),
       ('user1017', 'user1082'),
       ('user1017', 'user1083'),
       ('user1018', 'user1084'),
       ('user1018', 'user1085'),
       ('user1019', 'user1086'),
       ('user1019', 'user1087'),
       ('user1020', 'user1088'),
       ('user1020', 'user1089'),
       ('user1021', 'user1090'),
       ('user1021', 'user1091'),
       ('user1022', 'user1092'),
       ('user1022', 'user1093'),
       ('user1023', 'user1094'),
       ('user1023', 'user1095'),
       ('user1024', 'user1096'),
       ('user1024', 'user1097'),
       ('user1025', 'user1098'),
       ('user1025', 'user1099'),
       ('user1026', 'user1100'),
       ('user1026', 'user1001'),
       ('user1027', 'user1002'),
       ('user1027', 'user1003'),
       ('user1028', 'user1004'),
       ('user1028', 'user1005'),
       ('user1029', 'user1006'),
       ('user1029', 'user1007'),
       ('user1030', 'user1008'),
       ('user1030', 'user1009'),
       ('user1031', 'user1010'),
       ('user1031', 'user1011'),
       ('user1032', 'user1012'),
       ('user1032', 'user1013'),
       ('user1033', 'user1014'),
       ('user1033', 'user1015'),
       ('user1034', 'user1016'),
       ('user1034', 'user1017'),
       ('user1035', 'user1018'),
       ('user1035', 'user1019'),
       ('user1036', 'user1020'),
       ('user1036', 'user1021'),
       ('user1037', 'user1022'),
       ('user1037', 'user1023'),
       ('user1038', 'user1024'),
       ('user1038', 'user1025'),
       ('user1039', 'user1026'),
       ('user1039', 'user1027'),
       ('user1040', 'user1028'),
       ('user1040', 'user1029'),
       ('user1041', 'user1030'),
       ('user1041', 'user1031'),
       ('user1042', 'user1032'),
       ('user1042', 'user1033'),
       ('user1043', 'user1034'),
       ('user1043', 'user1035'),
       ('user1044', 'user1036'),
       ('user1044', 'user1037'),
       ('user1045', 'user1038'),
       ('user1045', 'user1039'),
       ('user1046', 'user1040'),
       ('user1046', 'user1041'),
       ('user1047', 'user1042'),
       ('user1047', 'user1043'),
       ('user1048', 'user1044'),
       ('user1048', 'user1045'),
       ('user1049', 'user1046'),
       ('user1049', 'user1047'),
       ('user1050', 'user1048'),
       ('user1050', 'user1049'),
       ('user1051', 'user1050'),
       ('user1051', 'user1051'),
       ('user1052', 'user1052'),
       ('user1052', 'user1053'),
       ('user1053', 'user1054'),
       ('user1053', 'user1055'),
       ('user1054', 'user1056'),
       ('user1054', 'user1057'),
       ('user1055', 'user1058'),
       ('user1055', 'user1059');



INSERT INTO user_funding_bmarks (fd_id, user_id, created_at)
VALUES (1, 'user1001', NOW()),
       (2, 'user1002', NOW()),
       (3, 'user1003', NOW()),
       (4, 'user1004', NOW()),
       (5, 'user1005', NOW());


INSERT INTO user_funding_likes (fd_id, user_id, created_at)
VALUES (1, 'user1001', NOW()),
       (2, 'user1002', NOW()),
       (3, 'user1003', NOW()),
       (4, 'user1004', NOW()),
       (5, 'user1005', NOW());

INSERT INTO user_points (user_id, point_value, point_reason)
VALUES ('user1001', 100, '이벤트 참여'),
       ('user1001', 200, '포스트 작성'),
       ('user1001', 300, '친구 초대'),
       ('user1002', 150, '이벤트 참여'),
       ('user1002', 250, '포스트 작성'),
       ('user1003', 200, '이벤트 참여'),
       ('user1003', 100, '포스트 작성'),
       ('user1003', 350, '친구 초대'),
       ('user1004', 500, '이벤트 참여'),
       ('user1004', 100, '포스트 작성'),
       ('user1005', 150, '친구 초대'),
       ('user1005', 250, '이벤트 참여'),
       ('user1006', 300, '포스트 작성'),
       ('user1006', 100, '친구 초대'),
       ('user1007', 200, '이벤트 참여'),
       ('user1007', 150, '포스트 작성'),
       ('user1008', 100, '친구 초대'),
       ('user1008', 400, '이벤트 참여'),
       ('user1009', 300, '포스트 작성'),
       ('user1009', 150, '친구 초대'),
       ('user1010', 250, '이벤트 참여'),
       ('user1010', 200, '포스트 작성'),
       ('user1011', 350, '친구 초대'),
       ('user1011', 100, '이벤트 참여'),
       ('user1012', 500, '포스트 작성'),
       ('user1012', 150, '친구 초대'),
       ('user1013', 100, '이벤트 참여'),
       ('user1013', 200, '포스트 작성'),
       ('user1014', 300, '친구 초대'),
       ('user1014', 100, '이벤트 참여'),
       ('user1015', 150, '포스트 작성'),
       ('user1015', 250, '친구 초대'),
       ('user1016', 200, '이벤트 참여'),
       ('user1016', 100, '포스트 작성'),
       ('user1017', 350, '친구 초대'),
       ('user1017', 300, '이벤트 참여'),
       ('user1018', 250, '포스트 작성'),
       ('user1018', 200, '친구 초대'),
       ('user1019', 100, '이벤트 참여'),
       ('user1019', 150, '포스트 작성'),
       ('user1020', 300, '친구 초대'),
       ('user1020', 500, '이벤트 참여'),
       ('user1021', 200, '포스트 작성'),
       ('user1021', 100, '친구 초대'),
       ('user1022', 250, '이벤트 참여'),
       ('user1022', 150, '포스트 작성'),
       ('user1023', 300, '친구 초대'),
       ('user1023', 200, '이벤트 참여'),
       ('user1024', 350, '포스트 작성'),
       ('user1024', 100, '친구 초대'),
       ('user1025', 150, '이벤트 참여'),
       ('user1025', 250, '포스트 작성'),
       ('user1026', 200, '친구 초대'),
       ('user1026', 300, '이벤트 참여'),
       ('user1027', 500, '포스트 작성'),
       ('user1027', 150, '친구 초대'),
       ('user1028', 100, '이벤트 참여'),
       ('user1028', 250, '포스트 작성'),
       ('user1029', 350, '친구 초대'),
       ('user1029', 300, '이벤트 참여'),
       ('user1030', 200, '포스트 작성'),
       ('user1030', 150, '친구 초대'),
       ('user1031', 250, '이벤트 참여'),
       ('user1031', 100, '포스트 작성'),
       ('user1032', 350, '친구 초대'),
       ('user1032', 300, '이벤트 참여'),
       ('user1033', 200, '포스트 작성'),
       ('user1033', 150, '친구 초대'),
       ('user1034', 500, '이벤트 참여'),
       ('user1034', 100, '포스트 작성'),
       ('user1035', 300, '친구 초대'),
       ('user1035', 250, '이벤트 참여'),
       ('user1036', 200, '포스트 작성'),
       ('user1036', 150, '친구 초대'),
       ('user1037', 100, '이벤트 참여'),
       ('user1037', 200, '포스트 작성'),
       ('user1038', 300, '친구 초대'),
       ('user1038', 150, '이벤트 참여'),
       ('user1039', 500, '포스트 작성'),
       ('user1039', 100, '친구 초대'),
       ('user1040', 150, '이벤트 참여'),
       ('user1040', 250, '포스트 작성'),
       ('user1041', 300, '친구 초대'),
       ('user1041', 200, '이벤트 참여'),
       ('user1042', 100, '포스트 작성'),
       ('user1042', 150, '친구 초대'),
       ('user1043', 250, '이벤트 참여'),
       ('user1043', 300, '포스트 작성'),
       ('user1044', 200, '친구 초대'),
       ('user1044', 500, '이벤트 참여'),
       ('user1045', 150, '포스트 작성'),
       ('user1045', 100, '친구 초대'),
       ('user1046', 300, '이벤트 참여'),
       ('user1046', 200, '포스트 작성'),
       ('user1047', 350, '친구 초대'),
       ('user1047', 300, '이벤트 참여'),
       ('user1048', 250, '포스트 작성'),
       ('user1048', 200, '친구 초대'),
       ('user1049', 150, '이벤트 참여'),
       ('user1049', 500, '포스트 작성'),
       ('user1050', 100, '친구 초대'),
       ('user1050', 250, '이벤트 참여');


INSERT INTO user_purchase_lists (user_id, product_id, product_type, delivery_status)
VALUES ('user1001', 3, 'event', '구매접수'),
       ('user1001', 6, 'event', '배송준비'),
       ('user1001', 9, 'event', '배송중'),
       ('user1002', 12, 'event', '배송완료'),
       ('user1002', 15, 'event', '구매접수'),
       ('user1002', 18, 'event', '배송준비'),
       ('user1003', 21, 'event', '배송중'),
       ('user1003', 24, 'event', '배송완료'),
       ('user1003', 27, 'event', '구매접수'),
       ('user1004', 30, 'event', '배송준비'),
       ('user1004', 33, 'event', '배송중'),
       ('user1004', 36, 'event', '배송완료'),
       ('user1005', 39, 'event', '구매접수'),
       ('user1005', 42, 'event', '배송준비'),
       ('user1005', 45, 'event', '배송중'),
       ('user1006', 48, 'event', '배송완료'),
       ('user1006', 51, 'event', '구매접수'),
       ('user1006', 54, 'event', '배송준비'),
       ('user1007', 57, 'event', '배송중'),
       ('user1007', 60, 'event', '배송완료'),
       ('user1007', 3, 'event', '구매접수'),
       ('user1008', 6, 'event', '배송준비'),
       ('user1008', 9, 'event', '배송중'),
       ('user1008', 12, 'event', '배송완료'),
       ('user1009', 15, 'event', '구매접수'),
       ('user1009', 18, 'event', '배송준비'),
       ('user1009', 21, 'event', '배송중'),
       ('user1010', 24, 'event', '배송완료'),
       ('user1010', 27, 'event', '구매접수'),
       ('user1010', 30, 'event', '배송준비'),
       ('user1011', 33, 'event', '배송중'),
       ('user1011', 36, 'event', '배송완료'),
       ('user1011', 39, 'event', '구매접수'),
       ('user1012', 42, 'event', '배송준비'),
       ('user1012', 45, 'event', '배송중'),
       ('user1012', 48, 'event', '배송완료'),
       ('user1013', 51, 'event', '구매접수'),
       ('user1013', 54, 'event', '배송준비'),
       ('user1013', 57, 'event', '배송중'),
       ('user1014', 60, 'event', '배송완료'),
       ('user1014', 3, 'event', '구매접수'),
       ('user1014', 6, 'event', '배송준비'),
       ('user1015', 9, 'event', '배송중'),
       ('user1015', 12, 'event', '배송완료'),
       ('user1015', 15, 'event', '구매접수'),
       ('user1016', 18, 'event', '배송준비'),
       ('user1016', 21, 'event', '배송중'),
       ('user1016', 24, 'event', '배송완료'),
       ('user1017', 27, 'event', '구매접수'),
       ('user1017', 30, 'event', '배송준비'),
       ('user1017', 33, 'event', '배송중'),
       ('user1018', 36, 'event', '배송완료'),
       ('user1018', 39, 'event', '구매접수'),
       ('user1018', 42, 'event', '배송준비'),
       ('user1019', 45, 'event', '배송중'),
       ('user1019', 48, 'event', '배송완료'),
       ('user1019', 51, 'event', '구매접수'),
       ('user1020', 54, 'event', '배송준비'),
       ('user1020', 57, 'event', '배송중'),
       ('user1020', 60, 'event', '배송완료'),
       ('user1021', 3, 'event', '구매접수'),
       ('user1021', 6, 'event', '배송준비'),
       ('user1021', 9, 'event', '배송중'),
       ('user1022', 12, 'event', '배송완료'),
       ('user1022', 15, 'event', '구매접수'),
       ('user1022', 18, 'event', '배송준비'),
       ('user1023', 21, 'event', '배송중'),
       ('user1023', 24, 'event', '배송완료'),
       ('user1023', 27, 'event', '구매접수'),
       ('user1024', 30, 'event', '배송준비'),
       ('user1024', 33, 'event', '배송중'),
       ('user1024', 36, 'event', '배송완료'),
       ('user1025', 39, 'event', '구매접수'),
       ('user1025', 42, 'event', '배송준비'),
       ('user1025', 45, 'event', '배송중');

INSERT INTO user_inquires (user_id, inquire_category, payment_id, title, contents, inquiry_img_url)
VALUES ('user1001', '계정', NULL, '비밀번호를 잊어버렸어요', '비밀번호를 다시 설정하고 싶습니다.', 'https://picsum.photos/id/101/200'),
       ('user1002', '결제', 1, '결제 문제 발생', '결제 과정에서 오류가 발생했습니다. 다시 결제해야 하나요?', 'https://picsum.photos/id/102/200'),
       ('user1003', '데이터등록', NULL, '내 정보가 제대로 등록되지 않았어요', '내 프로필 정보가 잘못 등록된 것 같아요. 수정해 주세요.',
        'https://picsum.photos/id/103/200'),
       ('user1004', '기타', NULL, '앱이 자꾸 종료돼요', '앱을 사용하다가 갑자기 종료됩니다. 해결방법을 알려주세요.', 'https://picsum.photos/id/104/200'),
       ('user1005', '결제', 2, '결제 취소 요청', '결제 취소를 요청드립니다. 다시 결제하고 싶습니다.', 'https://picsum.photos/id/105/200'),
       ('user1006', '계정', NULL, '아이디 변경 요청', '아이디를 변경할 수 있나요?', 'https://picsum.photos/id/106/200'),
       ('user1007', '기타', NULL, '앱 업데이트 후 버그 발생', '앱을 업데이트한 후 버그가 발생했습니다. 해결 방법을 알려주세요.',
        'https://picsum.photos/id/107/200'),
       ('user1008', '결제', 3, '결제 금액 오류', '결제 금액이 다르게 계산되었습니다. 확인 부탁드립니다.', 'https://picsum.photos/id/108/200'),
       ('user1009', '데이터등록', NULL, '이벤트 등록 오류', '이벤트를 등록하려고 했지만 오류가 발생합니다.', 'https://picsum.photos/id/109/200'),
       ('user1010', '기타', NULL, '기타 문의', '앱에서 로그인에 문제가 생겼습니다. 어떻게 해결하나요?', 'https://picsum.photos/id/110/200'),
       ('user1011', '결제', 4, '결제 완료 안됨', '결제가 완료되지 않았습니다. 다시 시도할 수 있나요?', 'https://picsum.photos/id/111/200'),
       ('user1012', '계정', NULL, '계정 탈퇴하고 싶어요', '계정을 탈퇴하고 싶습니다. 어떻게 해야 하나요?', 'https://picsum.photos/id/112/200'),
       ('user1013', '결제', 5, '결제 오류', '결제 시 오류가 발생하여 결제가 되지 않았습니다.', 'https://picsum.photos/id/113/200'),
       ('user1014', '기타', NULL, '앱 사용법 문의', '앱의 사용법에 대해 궁금한 점이 있습니다. 설명을 부탁드립니다.', 'https://picsum.photos/id/114/200'),
       ('user1015', '결제', 6, '결제 취소 요청', '결제를 취소하고 싶습니다. 어떻게 해야 하나요?', 'https://picsum.photos/id/115/200'),
       ('user1016', '데이터등록', NULL, '프로필 이미지 등록 안됨', '프로필 이미지를 등록할 수 없습니다. 왜 그런가요?', 'https://picsum.photos/id/116/200'),
       ('user1017', '기타', NULL, '기타 문의', '앱에서 로그인이 안됩니다. 어떻게 해결할 수 있나요?', 'https://picsum.photos/id/117/200'),
       ('user1018', '계정', NULL, '계정이 잠겼습니다', '내 계정이 잠겨서 로그인이 안 됩니다. 어떻게 해야 하나요?', 'https://picsum.photos/id/118/200'),
       ('user1019', '결제', 7, '결제 금액 차이', '결제 금액이 다르게 청구되었습니다. 확인 부탁드립니다.', 'https://picsum.photos/id/119/200'),
       ('user1020', '기타', NULL, '앱 충돌', '앱이 자꾸 충돌합니다. 해결방법을 알려주세요.', 'https://picsum.photos/id/120/200'),
       ('user1021', '결제', 8, '결제 실패', '결제가 실패하여 결제 과정이 다시 시작되지 않습니다.', 'https://picsum.photos/id/121/200'),
       ('user1022', '계정', NULL, '계정 복구 요청', '내 계정이 잠겨서 복구 요청을 하고 싶습니다. 어떻게 해야 하나요?',
        'https://picsum.photos/id/122/200'),
       ('user1023', '기타', NULL, '앱 사용 중 오류 발생', '앱 사용 중 오류가 발생하여 앱을 종료했습니다. 어떻게 해야 하나요?',
        'https://picsum.photos/id/123/200'),
       ('user1024', '결제', 9, '결제 금액 차이', '결제 금액이 다르게 나왔습니다. 확인 부탁드립니다.', 'https://picsum.photos/id/124/200'),
       ('user1025', '데이터등록', NULL, '이벤트 등록이 되지 않아요', '이벤트를 등록하려고 했지만 계속 오류가 발생합니다. 확인 부탁드립니다.',
        'https://picsum.photos/id/125/200'),
       ('user1026', '기타', NULL, '앱 버전 업데이트 후 로그인 안됨', '앱을 최신 버전으로 업데이트했으나 로그인할 수 없습니다. 해결 방법을 알려주세요.',
        'https://picsum.photos/id/126/200'),
       ('user1027', '결제', 10, '결제 금액 오류', '결제 금액이 잘못 계산되었습니다. 확인 후 수정해주세요.', 'https://picsum.photos/id/127/200'),
       ('user1028', '기타', NULL, '앱 속도가 너무 느림', '앱 속도가 너무 느려서 사용이 불편합니다. 개선이 필요합니다.',
        'https://picsum.photos/id/128/200'),
       ('user1029', '계정', NULL, '아이디 찾기', '아이디를 잃어버려서 찾을 수 있도록 도와주세요.', 'https://picsum.photos/id/129/200'),
       ('user1030', '결제', 11, '결제 오류 발생', '결제 과정에서 오류가 발생하여 결제가 되지 않았습니다. 다시 시도할 수 있나요?',
        'https://picsum.photos/id/130/200'),
       ('user1031', '데이터등록', NULL, '프로필 사진 변경 안됨', '프로필 사진을 변경하려고 했으나 변경되지 않았습니다. 어떻게 해야 하나요?',
        'https://picsum.photos/id/131/200'),
       ('user1032', '기타', NULL, '앱 접속 불가', '앱에 접속하려고 하면 계속 로딩만 되고 접속이 되지 않습니다.', 'https://picsum.photos/id/132/200'),
       ('user1033', '결제', 12, '결제 취소 요청', '결제 후 실수로 잘못된 상품을 구매했습니다. 취소 부탁드립니다.', 'https://picsum.photos/id/133/200'),
       ('user1034', '기타', NULL, '앱에서 오류 메시지 발생', '앱에서 "시스템 오류"라는 메시지가 뜹니다. 어떻게 해결하나요?',
        'https://picsum.photos/id/134/200'),
       ('user1035', '계정', NULL, '계정 비활성화 요청', '더 이상 사용하지 않는 계정을 비활성화하고 싶습니다. 어떻게 해야 하나요?',
        'https://picsum.photos/id/135/200'),
       ('user1036', '결제', 13, '결제 금액 초과', '결제 금액이 예상보다 초과되었습니다. 확인 부탁드립니다.', 'https://picsum.photos/id/136/200'),
       ('user1037', '기타', NULL, '앱에서 알림이 안 와요', '앱에서 알림이 오지 않아서 확인 부탁드립니다.', 'https://picsum.photos/id/137/200'),
       ('user1038', '결제', 14, '결제 정보 수정 요청', '결제 정보가 잘못 입력되어 다시 수정하려고 합니다. 어떻게 해야 하나요?',
        'https://picsum.photos/id/138/200'),
       ('user1039', '데이터등록', NULL, '이벤트 등록 오류', '이벤트 등록 시 "등록 실패" 메시지가 뜨고 등록이 되지 않습니다. 해결 방법을 알려주세요.',
        'https://picsum.photos/id/139/200'),
       ('user1040', '계정', NULL, '비밀번호 변경 요청', '비밀번호를 변경하고 싶습니다. 절차를 안내해 주세요.', 'https://picsum.photos/id/140/200'),
       ('user1041', '기타', NULL, '앱에 새로운 기능 추가 요청', '앱에 새로운 기능을 추가해주시면 더 편리하게 사용할 수 있을 것 같습니다. 기능 추가를 요청합니다.',
        'https://picsum.photos/id/141/200'),
       ('user1042', '결제', 15, '결제 완료되지 않음', '결제를 완료했는데, 결제 내역이 반영되지 않았습니다. 확인 부탁드립니다.',
        'https://picsum.photos/id/142/200'),
       ('user1043', '계정', NULL, '아이디 변경 요청', '아이디를 변경하고 싶습니다. 가능할까요?', 'https://picsum.photos/id/143/200'),
       ('user1044', '결제', 16, '결제 취소 요청', '결제를 취소하고 싶습니다. 다시 결제할 수 있나요?', 'https://picsum.photos/id/144/200'),
       ('user1045', '기타', NULL, '앱에서 "로그인 실패" 오류', '앱에서 "로그인 실패"라는 오류가 발생합니다. 해결 방법을 알려주세요.',
        'https://picsum.photos/id/145/200'),
       ('user1046', '결제', 17, '결제 실패', '결제 과정 중 오류가 발생하여 결제가 완료되지 않았습니다. 어떻게 해야 하나요?',
        'https://picsum.photos/id/146/200'),
       ('user1047', '기타', NULL, '앱에서 설정 변경이 안 돼요', '앱의 설정을 변경하려고 했는데 변경이 되지 않습니다. 해결 방법을 알려주세요.',
        'https://picsum.photos/id/147/200'),
       ('user1048', '계정', NULL, '계정 복구 요청', '내 계정이 해킹 당한 것 같습니다. 복구 요청을 하고 싶습니다.', 'https://picsum.photos/id/148/200'),
       ('user1049', '결제', 18, '결제 취소 요청', '잘못된 결제 때문에 취소를 요청드립니다.', 'https://picsum.photos/id/149/200'),
       ('user1050', '기타', NULL, '앱에서 오류 발생', '앱에서 갑자기 오류가 발생하여 사용이 불가능합니다. 해결 방법을 알려주세요.',
        'https://picsum.photos/id/150/200');


INSERT INTO user_interests (user_id, ctgr_id, interest_order)
VALUES ('user1001', 1, 1000),
       ('user1001', 2, 2000),
       ('user1001', 3, 3000),
       ('user1001', 4, 4000),
       ('user1001', 5, 5000),
       ('user1002', 2, 1000),
       ('user1002', 4, 2000),
       ('user1002', 3, 3000),
       ('user1002', 1, 4000),
       ('user1002', 5, 5000),
       ('user1003', 5, 1000),
       ('user1003', 4, 2000),
       ('user1003', 3, 3000),
       ('user1003', 2, 4000),
       ('user1003', 1, 5000),
       ('user1004', 4, 1000),
       ('user1004', 2, 2000),
       ('user1004', 5, 3000),
       ('user1004', 1, 4000),
       ('user1004', 3, 5000),
       ('user1005', 3, 1000),
       ('user1005', 2, 2000),
       ('user1005', 4, 3000),
       ('user1005', 5, 4000),
       ('user1005', 1, 5000);

INSERT INTO user_oneday_bmarks (user_id, od_id, created_at)
VALUES ('user1001', 1, NOW()),
       ('user1002', 2, NOW()),
       ('user1003', 3, NOW()),
       ('user1004', 4, NOW()),
       ('user1005', 5, NOW());

INSERT INTO user_oneday_likes (user_id, od_id, created_at)
VALUES ('user1001', 1, NOW()),
       ('user1002', 2, NOW()),
       ('user1003', 3, NOW()),
       ('user1004', 4, NOW()),
       ('user1005', 5, NOW());

INSERT INTO user_rent_bmarks (user_id, rt_id, created_at)
VALUES ('user1001', 1, NOW()),
       ('user1002', 2, NOW()),
       ('user1003', 3, NOW()),
       ('user1004', 4, NOW()),
       ('user1005', 5, NOW());

INSERT INTO user_rent_likes (user_id, rt_id, created_at)
VALUES ('user1001', 1, NOW()),
       ('user1002', 2, NOW()),
       ('user1003', 3, NOW()),
       ('user1004', 4, NOW()),
       ('user1005', 5, NOW());

INSERT INTO user_settings (user_id, display_color, language)
VALUES ('user1001', 'Light', 'System'),
       ('user1002', 'Dark', 'English'),
       ('user1003', 'Light', 'Korean'),
       ('user1004', 'Dark', 'System'),
       ('user1005', 'Light', 'English'),
       ('user1006', 'Dark', 'Korean'),
       ('user1007', 'Light', 'System'),
       ('user1008', 'Dark', 'English'),
       ('user1009', 'Light', 'Korean'),
       ('user1010', 'Dark', 'System'),
       ('user1011', 'Light', 'English'),
       ('user1012', 'Dark', 'Korean'),
       ('user1013', 'Light', 'System'),
       ('user1014', 'Dark', 'English'),
       ('user1015', 'Light', 'Korean'),
       ('user1016', 'Dark', 'System'),
       ('user1017', 'Light', 'English'),
       ('user1018', 'Dark', 'Korean'),
       ('user1019', 'Light', 'System'),
       ('user1020', 'Dark', 'English'),
       ('user1021', 'Light', 'Korean'),
       ('user1022', 'Dark', 'System'),
       ('user1023', 'Light', 'English'),
       ('user1024', 'Dark', 'Korean'),
       ('user1025', 'Light', 'System'),
       ('user1026', 'Dark', 'English'),
       ('user1027', 'Light', 'Korean'),
       ('user1028', 'Dark', 'System'),
       ('user1029', 'Light', 'English'),
       ('user1030', 'Dark', 'Korean');


INSERT INTO userlogin_logs (log_id, user_id, login_at, ip_address, user_agent)
VALUES (1, 'user1001', NOW(), '192.168.1.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'),
       (2, 'user1002', NOW(), '192.168.1.2',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'),
       (3, 'user1003', NOW(), '192.168.1.3',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'),
       (4, 'user1004', NOW(), '192.168.1.4',
        'Mozilla/5.0 (Linux; Android 11; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'),
       (5, 'user1005', NOW(), '192.168.1.5',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0');


INSERT INTO widgets (widget_id, user_id, widget_size, widget_is_used, widget_theme)
VALUES (1, 'user1001', '1', TRUE, 'Light'),
       (2, 'user1001', '2', TRUE, 'Light'),
       (3, 'user1001', '3', TRUE, 'Light'),
       (4, 'user1001', '1', TRUE, 'Light'),
       (5, 'user1001', '2', TRUE, 'Light'),
       (6, 'user1001', '3', TRUE, 'Light'),
       (7, 'user1001', '1', TRUE, 'Light'),
       (8, 'user1001', '2', TRUE, 'Light'),
       (9, 'user1001', '3', TRUE, 'Light'),
       (10, 'user1001', '1', TRUE, 'Light'),
       (11, 'user1001', '2', TRUE, 'Light'),
       (12, 'user1001', '3', TRUE, 'Light'),
       (13, 'user1001', '1', TRUE, 'Light'),
       (14, 'user1001', '2', TRUE, 'Light'),
       (15, 'user1001', '3', TRUE, 'Light'),
       (16, 'user1001', '1', TRUE, 'Light'),
       (17, 'user1001', '2', TRUE, 'Light'),
       (18, 'user1001', '3', TRUE, 'Light'),
       (19, 'user1001', '1', TRUE, 'Light'),
       (20, 'user1001', '2', TRUE, 'Light'),
       (21, 'user1001', '3', TRUE, 'Light'),
       (22, 'user1001', '1', TRUE, 'Light'),
       (23, 'user1001', '2', TRUE, 'Light'),
       (24, 'user1001', '3', TRUE, 'Light');


INSERT INTO widget_details (user_id, widget_id, widget_json, is_used)
VALUES
    ('user1001', 1,  '{"type": "calander", "label": "캘린더"}', TRUE),
    ('user1001', 2,  '{"type": "calander", "label": "캘린더"}', TRUE),
    ('user1001', 3,  '{"type": "calander", "label": "캘린더"}', TRUE),
    ('user1001', 4,  '{"type": "weather", "label": "날씨"}', TRUE),
    ('user1001', 5,  '{"type": "weather", "label": "날씨"}', TRUE),
    ('user1001', 6,  '{"type": "weather", "label": "날씨"}', TRUE),
    ('user1001', 7,  '{"type": "memo", "label": "메모"}', TRUE),
    ('user1001', 8,  '{"type": "memo", "label": "메모"}', TRUE),
    ('user1001', 9,  '{"type": "memo", "label": "메모"}', TRUE),
    ('user1001', 10, '{"type": "info", "label": "소개"}', TRUE),
    ('user1001', 11, '{"type": "info", "label": "소개"}', TRUE),
    ('user1001', 12, '{"type": "info", "label": "소개"}', TRUE),
    ('user1001', 13, '{"type": "bookmark", "label": "북마크"}', TRUE),
    ('user1001', 14, '{"type": "bookmark", "label": "북마크"}', TRUE),
    ('user1001', 15, '{"type": "bookmark", "label": "북마크"}', TRUE),
    ('user1001', 16, '{"type": "display", "label": "전시대"}', TRUE),
    ('user1001', 17, '{"type": "display", "label": "전시대"}', TRUE),
    ('user1001', 18, '{"type": "display", "label": "전시대"}', TRUE),
    ('user1001', 19, '{"type": "image", "label": "이미지"}', TRUE),
    ('user1001', 20, '{"type": "image", "label": "이미지"}', TRUE),
    ('user1001', 21, '{"type": "image", "label": "이미지"}', TRUE),
    ('user1001', 22, '{"type": "countdown", "label": "카운트다운"}', TRUE),
    ('user1001', 23, '{"type": "countdown", "label": "카운트다운"}', TRUE),
    ('user1001', 24, '{"type": "countdown", "label": "카운트다운"}', TRUE);
