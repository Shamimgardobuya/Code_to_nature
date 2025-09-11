export interface User {
  username: string;
  email: string;

}

export interface Profile {
  user: User;
  profile_pic: string | null;
  github_username: string | null;
  github_token: string | null;
  eco_credits: number;
  locked_credits: number;
  current_streak: number;
  longest_streak: number;
}