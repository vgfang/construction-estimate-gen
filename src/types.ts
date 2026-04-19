export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  taxable: boolean;
};

export type Section = {
  id: string;
  title: string;
  items: LineItem[];
};

export type Company = {
  name: string;
  address: string;
  phone: string;
  email: string;
  license?: string;
  logo?: string;
};

export type Client = {
  name: string;
  address: string;
  phone: string;
  email: string;
};

export type Estimate = {
  number: string;
  date: string;
  client: Client;
  sections: Section[];
  taxRate: number;
  notes: string;
};
