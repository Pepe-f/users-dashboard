export interface Hair {
  color: string;
  type: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

export interface Company {
  department: string;
  name: string;
  title: string;
  address: Address;
}

export interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

export type Gender = 'male' | 'female';

export type UserRole = 'admin' | 'moderator' | 'user';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: Gender;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: UserRole;
}

export interface UsersApiResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export type ViewMode = 'grid' | 'table';

export type SortField = 'firstName' | 'lastName' | 'age' | 'email' | 'company';

export type SortOrder = 'asc' | 'desc';

export type GenderFilter = 'all' | 'male' | 'female';

export type RoleFilter = 'all' | 'admin' | 'moderator' | 'user';

export interface DashboardFilters {
  search: string;
  gender: GenderFilter;
  role: RoleFilter;
  ageMin: string;
  ageMax: string;
  sortField: SortField;
  sortOrder: SortOrder;
}
