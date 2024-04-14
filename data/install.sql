CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at timestamptz,
    nickname VARCHAR(255),
    avatar_url VARCHAR(255),
    locale VARCHAR(50),
    signin_type VARCHAR(50),
    signin_ip VARCHAR(255),
    signin_provider VARCHAR(50),
    signin_openid VARCHAR(255)
);

CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    video_url VARCHAR(255),
    audio_url VARCHAR(255),
    image_url VARCHAR(255),
    image_large_url VARCHAR(255),
    llm_model VARCHAR(50),
    tags VARCHAR(255),
    lyrics TEXT,
    description TEXT,
    duration DOUBLE PRECISION,
    type VARCHAR(50),
    user_uuid VARCHAR(255),
    title VARCHAR(255),
    play_count INT,
    upvote_count INT,
    created_at timestamptz,
    status VARCHAR(50),
    is_public BOOLEAN,
    is_trending BOOLEAN,
    provider VARCHAR(50),
    artist VARCHAR(100),
    prompt TEXT
);

CREATE TABLE favorite_songs (
    song_uuid VARCHAR(255) NOT NULL,
    user_uuid VARCHAR(255) NOT NULL,
    created_at timestamptz,
    updated_at timestamptz,
    status VARCHAR(50),
    CONSTRAINT unique_favorite_song UNIQUE (song_uuid, user_uuid) 
);

CREATE TABLE play_songs (
    song_uuid VARCHAR(255) NOT NULL,
    user_uuid VARCHAR(255) NOT NULL,
    created_at timestamptz
);

CREATE TABLE upvote_songs (
    song_uuid VARCHAR(255) NOT NULL,
    user_uuid VARCHAR(255) NOT NULL,
    created_at timestamptz,
    updated_at timestamptz,
    is_signin BOOLEAN,
    status VARCHAR(50)
)

CREATE TABLE song_tasks (
    uuid VARCHAR(255) UNIQUE NOT NULL,
    user_uuid VARCHAR(255) NOT NULL,
    created_at timestamptz,
    updated_at timestamptz,
    status VARCHAR(50),
    description TEXT,
    title VARCHAR(255),
    lyrics TEXT,
    tags VARCHAR(255),
    is_no_lyrics BOOLEAN,
    lyrics_provider VARCHAR(50),
    lyrics_uuid VARCHAR(50),
    song_provider VARCHAR(50),
    song_model VARCHAR(50),
    song_uuids TEXT
);

CREATE TABLE orders (
    order_no VARCHAR(255) UNIQUE NOT NULL,
    created_at timestamptz,
    user_uuid VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    plan VARCHAR(50),
    expired_at timestamptz,
    order_status SMALLINT NOT NULL,
    paied_at timestamptz,
    stripe_session_id VARCHAR(255),
    credits INT NOT NULL,
    currency VARCHAR(50)
);