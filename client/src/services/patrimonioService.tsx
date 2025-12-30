// patrimonioService.ts
import api from "./api";
import { Asset } from "../types";

// POST
export async function createAsset(data: { epc: string; name: string; current_ambiente_id: string }) {
  const res = await api.post("patrimonios/criar/", data);
  return res.data; // já retorna o objeto criado
}


// GET ALL
export async function getAssets(){
    const res = await api.get("patrimonios/");
    return res.data;
}

// PUT
export async function updateAssetsApi(id: string, asset: any) {
  const res = await api.put(`patrimonios/${id}/`, asset);
  return res.data;
}

// DELETE
export async function deleteAsset(id: string) {
  await api.delete(`patrimonios/${id}/`);
}