export interface User {
  id?: number;
  uuid: string;
  email: string;
  created_at?: string;
  nickname: string;
  avatar_url: string;
  locale?: string;
  signin_type?: string;
  signin_ip?: string;
  signin_provider?: string;
  signin_openid?: string;
  credits?: UserCredits;
}

export interface UserCredits {
  one_time_credits: number;
  monthly_credits: number;
  total_credits: number;
  used_credits: number;
  left_credits: number;
}
