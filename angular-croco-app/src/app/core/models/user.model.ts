export interface Company {
  name: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  company: Company;
}

