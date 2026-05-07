import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { User, DashboardFilters } from '@/types/user';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fullName(u: Pick<User, 'firstName' | 'lastName'>) {
  return `${u.firstName} ${u.lastName}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function maskCard(cardNumber: string): string {
  return `•••• •••• •••• ${cardNumber.slice(-4)}`;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

export function applyClientFilters(
  users: User[],
  filters: DashboardFilters,
): User[] {
  return users.filter((u) => {
    if (filters.gender !== 'all' && u.gender !== filters.gender) {
      return false;
    }
    if (filters.role !== 'all' && u.role !== filters.role) {
      return false;
    }
    if (filters.ageMin !== '' && u.age < Number(filters.ageMin)) {
      return false;
    }
    if (filters.ageMax !== '' && u.age > Number(filters.ageMax)) {
      return false;
    }
    return true;
  });
}

export function roleColors(role: User['role']) {
  return {
    admin: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    moderator:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    user: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  }[role];
}

export function genderIcon(gender: User['gender']) {
  return gender === 'male' ? '♂' : '♀';
}
