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
  console.log(data);
  return data;
};

export const createTemporaryWorkspace = async () => {
  const response = await fetch(`${API_URL}workspaces/create_temporary_chat`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
};

export const attachFile = async (files: File[], id: string) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("id", id);

  return await fetch(`${API_URL}workspaces/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
};

export const deleteFile = async (id: string, fileId: string) => {
  const response = await fetch(`${API_URL}workspaces/${id}/files/${fileId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json();
  return data;
};
