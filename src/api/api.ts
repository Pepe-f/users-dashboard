import type { User, UsersApiResponse } from '@/types/user';

const API_BASE_URL = 'https://dummyjson.com';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

function buildSearchParams(
  params: Record<string, string | number | undefined>,
): string {
  const searchParams = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') searchParams.set(k, String(v));
  }
  return searchParams.toString();
}

export interface FetchUsersParams {
  limit: number;
  skip: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export async function fetchUsers(
  params: FetchUsersParams,
): Promise<UsersApiResponse> {
  const { search, ...rest } = params;
  const qs = buildSearchParams(rest);

  const path = search
    ? `/users/search?q=${encodeURIComponent(search)}&${qs}`
    : `/users?${qs}`;

  return apiFetch<UsersApiResponse>(path);
}

export async function fetchUserById(id: number): Promise<User> {
  return apiFetch<User>(`/users/${id}`);
}
