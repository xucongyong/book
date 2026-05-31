CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at timestamptz,
    nickname VARCHAR(255),
    avatar_url VARCHAR(255),
    locale VARCHAR(50),
    signin_type VARCHAR(50),
    signin_ip VARCHAR(255),
    signin_provider VARCHAR(50),
    signin_openid VARCHAR(255),
    invite_code VARCHAR(255) NOT NULL default '',
    updated_at timestamptz,
    invited_by VARCHAR(255) NOT NULL default '',
    is_affiliate BOOLEAN NOT NULL default false,
    UNIQUE (email, signin_provider)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_no VARCHAR(255) UNIQUE NOT NULL,
    created_at timestamptz,
    user_uuid VARCHAR(255) NOT NULL DEFAULT '',
    user_email VARCHAR(255) NOT NULL DEFAULT '',
    amount INT NOT NULL,
    interval VARCHAR(50),
    expired_at timestamptz,
    status VARCHAR(50) NOT NULL,
    stripe_session_id VARCHAR(255),
    credits INT NOT NULL,
    currency VARCHAR(50),
    sub_id VARCHAR(255),
    sub_interval_count int,
    sub_cycle_anchor int,
    sub_period_end int,
    sub_period_start int,
    sub_times int,
    product_id VARCHAR(255),
    product_name VARCHAR(255),
    valid_months int,
    order_detail TEXT,
    paid_at timestamptz,
    paid_email VARCHAR(255),
    paid_detail TEXT
);


CREATE TABLE apikeys (
    id SERIAL PRIMARY KEY,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(100),
    user_uuid VARCHAR(255) NOT NULL,
    created_at timestamptz,
    status VARCHAR(50)
);

CREATE TABLE credits (
    id SERIAL PRIMARY KEY,
    trans_no VARCHAR(255) UNIQUE NOT NULL,
    created_at timestamptz,
    user_uuid VARCHAR(255) NOT NULL,
    trans_type VARCHAR(50) NOT NULL,
    credits INT NOT NULL,
    order_no VARCHAR(255),
    expired_at timestamptz
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    content TEXT,
    created_at timestamptz,
    updated_at timestamptz,
    status VARCHAR(50),
    cover_url VARCHAR(255),
    author_name VARCHAR(255),
    author_avatar_url VARCHAR(255),
    locale VARCHAR(50)
);

create table affiliates (
    id SERIAL PRIMARY KEY,
    user_uuid VARCHAR(255) NOT NULL,
    created_at timestamptz,
    status VARCHAR(50) NOT NULL default '',
    invited_by VARCHAR(255) NOT NULL,
    paid_order_no VARCHAR(255) NOT NULL default '',
    paid_amount INT NOT NULL default 0,
    reward_percent INT NOT NULL default 0,
    reward_amount INT NOT NULL default 0
);

CREATE TABLE feedbacks (
    id SERIAL PRIMARY KEY,
    created_at timestamptz,
    status VARCHAR(50),
    user_uuid VARCHAR(255),
    content TEXT,
    rating INT
);

CREATE TABLE influencers (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    avatar_url VARCHAR(255),
    description TEXT,
    aliases JSONB,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    keywords JSONB,
    description TEXT,
    url VARCHAR(255),
    content TEXT,
    metadata JSONB,
    images JSONB,
    phash VARCHAR(255),
    download_status INT DEFAULT 0,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    influencer_id INT REFERENCES influencers(id),
    influencer_uuid VARCHAR(255)
);

CREATE TABLE keywords (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    search_volume INT DEFAULT 0,
    kd INT DEFAULT 0,
    influencer_id INT REFERENCES influencers(id),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rank_history (
    id SERIAL PRIMARY KEY,
    keyword_id INT REFERENCES keywords(id),
    rank INT,
    recorded_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sites (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE,
    domain VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    language VARCHAR(50) DEFAULT 'en',
    theme VARCHAR(50),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);