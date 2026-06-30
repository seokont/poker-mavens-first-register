export type UserRecord = {
  id: string;
  player: string;
  password: string;
  realName: string;
  gender: string;
  location: string;
  email: string;
  avatar: string;
  createdAt: string;
  lastLoginAt: string | null;
  approved: boolean;
  approvedAt: string | null;
};

export type DatabaseSchema = {
  users: UserRecord[];
};
