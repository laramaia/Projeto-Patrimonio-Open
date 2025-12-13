// patrimonioService.ts
import api from "./api";
import { Asset } from "../types";

// POST
export async function createAsset(
  data: Omit<Asset, "id" | "createdAt">
) {
  const payload = {
    epc: data.epc,
    name: data.name,
    current_ambiente_id: Number(data.currentEnvironmentId),
    last_seen: data.lastReadAt
      ? data.lastReadAt.toISOString()
      : new Date().toISOString(),
  };

  const res = await api.post("patrimonios/criar/", payload);

  return {
    ...res.data,
    id: String(res.data.id),
    currentEnvironmentId: res.data.current_ambiente_id,
    lastReadAt: res.data.last_seen
      ? new Date(res.data.last_seen)
      : undefined,
    createdAt: new Date(res.data.createdAt),
  };
}

// GET ALL
export async function getAssets(){
    const res = await api.get("patrimonios/");
    return res.data;
}