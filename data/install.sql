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

CREATE OR REPLACE FUNCTION get_random_songs(provider_param VARCHAR(50), page integer, results_limit integer)
RETURNS SETOF songs AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM songs s
  WHERE s.status = 'complete'
    AND s.audio_url != ''
    AND (provider_param IS NULL OR s.provider = provider_param)
  ORDER BY random()
  LIMIT results_limit OFFSET (page - 1) * results_limit;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_play_songs(user_uuid VARCHAR(255), results_limit INTEGER, results_offset INTEGER)
RETURNS SETOF songs AS $$
BEGIN
  RETURN QUERY
  SELECT s.*
  FROM (
    SELECT song_uuid, MAX(created_at) AS MaxCreatedAt
    FROM play_songs ps
    WHERE ps.user_uuid = get_user_play_songs.user_uuid 
    GROUP BY song_uuid
  ) AS latest
  JOIN play_songs p ON latest.song_uuid = p.song_uuid AND latest.MaxCreatedAt = p.created_at
  JOIN songs s ON p.song_uuid = s.uuid
  ORDER BY p.created_at DESC LIMIT results_limit OFFSET results_offset;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_favorite_songs(user_uuid VARCHAR(255), results_limit INTEGER, results_offset INTEGER)
RETURNS SETOF songs AS $$
BEGIN
  RETURN QUERY
  SELECT s.*
  FROM songs AS s
  LEFT JOIN favorite_songs AS fs ON s.uuid = fs.song_uuid
  WHERE fs.user_uuid = get_user_favorite_songs.user_uuid AND fs.status = 'on'
  ORDER BY fs.updated_at DESC
  LIMIT results_limit OFFSET results_offset;
END;
$$ LANGUAGE plpgsql;