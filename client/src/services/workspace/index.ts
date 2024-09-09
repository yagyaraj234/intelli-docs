import { API_URL } from "../constant";

export const getWorkspace = async (id: string) => {
  const response = await fetch(`${API_URL}workspaces/${id}`, {
    credentials: "include",
    method: "GET",
  });
  const data = await response.json();
  return data;
};

export const getAllWorkspaces = async () => {
  const response = await fetch(`${API_URL}workspaces`, {
    credentials: "include",
    method: "GET",
  });
  const data = await response.json();
  return data;
};

export const createWorkspace = async (
  name: string,
  role: string,
  url?: string
) => {
  const response = await fetch(`${API_URL}workspaces/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, role, url }),
  });
  const data = await response.json();
  return data;
};

export const deleteWorkspace = async (id: string) => {
  const response = await fetch(`${API_URL}workspaces/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json();
  return data;
};

export const createTemporaryWorkspace = async () => {
  const response = await fetch(`${API_URL}workspaces/create_temporary_chat`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
};
