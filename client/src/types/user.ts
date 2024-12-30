export interface DashboardUser {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface UserRole {
  user_id: string;
  role: 'owner' | 'admin' | 'user' | 'manager';
}

export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}
