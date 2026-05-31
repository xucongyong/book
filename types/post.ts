export enum PostStatus {
  Created = "created",
  Deleted = "deleted",
  Online = "online",
  Offline = "offline",
}

export interface Post {
  uuid?: string;
  slug?: string;
  title?: string;
  description?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
  status?: PostStatus | string;
  cover_url?: string;
  author_name?: string;
  author_slug?: string;
  author_avatar_url?: string;
  locale?: string;
  is_paid?: boolean;
  images?: string[];
  tags?: string[];
  influencer_id?: string;
}
