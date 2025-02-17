type UserRole = 'owner' | 'admin' | 'user';

export interface UserRoleData {
  user_id: string;
  role: UserRole;
}
