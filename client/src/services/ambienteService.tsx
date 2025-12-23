import api from "./api";

// POST
export async function createEnvironment(data: { name: string; description?: string }) {
  const res = await api.post("ambientes/criar/", data);
  const retorno = {
    ...res.data,
    id: String(res.data.id),
  };
  return retorno;
}

// GET ALL
export async function getEnvironments() {
  const res = await api.get("ambientes/");
  return res.data;
}

// PUT
export async function updateEnvironment(id: string, environment: any) {
  const res = await api.put(`ambientes/${id}/`, environment);
  return res.data;
}

// DELETE
export async function deleteEnvironment(id: string) {
  await api.delete(`ambientes/${id}/`);
}