import axios from "axios";

const API_BASE_URL = "http://localhost:5245/api";

export interface Account {
  id: number;
  name: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const accountApi = {
  getAll: () => api.get<Account[]>("/accounts"),
  getById: (id: number) => api.get<Account>(`/accounts/${id}`),
  create: (account: Omit<Account, "id">) =>
    api.post<Account>("/accounts", account),
  update: (id: number, account: Account) =>
    api.put<Account>(`/accounts/${id}`, account),
  delete: (id: number) => api.delete(`/accounts/${id}`),
};
