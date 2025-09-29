export type User = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  image?: string | null;
  role?: string;
  name?: string | null;
  createdAt?: string;
} | null;
