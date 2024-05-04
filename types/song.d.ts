export interface Song {
  uuid: string;
  video_url?: string;
  audio_url?: string;
  image_url?: string;
  image_large_url?: string;
  llm_model?: string;
  tags?: string;
  lyrics?: string;
  description?: string;
  duration?: number;
  user_uuid?: string;
  title?: string;
  play_count?: number;
  upvote_count?: number;
  created_at?: string;
  status: string;
  is_public?: boolean;
  is_trending?: boolean;
  type?: string;
  provider?: string;
  artist?: string;
  prompt?: string;
}

export interface FavoriteSong {
  song_uuid: string;
  user_uuid: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface PlaySong {
  song_uuid: string;
  user_uuid: string;
  created_at: string;
}
