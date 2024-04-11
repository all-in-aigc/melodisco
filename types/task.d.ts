export interface SongTask {
  uuid: string;
  user_uuid: string;
  created_at: string;
  updated_at: string;
  status: string;
  description: string;
  title?: string;
  lyrics?: string;
  tags?: string;
  is_no_lyrics?: boolean;
  lyrics_provider?: string;
  lyrics_uuid?: string;
  song_provider?: string;
  song_model?: string;
  song_uuids?: string;
}
