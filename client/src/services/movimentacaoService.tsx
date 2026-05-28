import api from "./api";

import { MovementLog } from "../types";

// GET ALL
export async function getMovementLogs(): Promise<MovementLog[]> {
    const res = await api.get("movimentacoes/");
    return res.data.map((log: any) => ({
        ...log,
        id: String(log.id),
        patrimonio: String(log.patrimonio),
        sensor: String(log.sensor),
        from_ambiente: String(log.from_ambiente),
        to_ambiente: String(log.to_ambiente),
    }));
}

// TESTE
export async function createMovement(data: { epc: string; sensor: string }) {
    const payload = {
        epc: data.epc,
        sensor: Number(data.sensor)
    };
    const res = await api.post("movimentacoes/criar/", payload);
    return {
        ...res.data,
        id: String(res.data.id),
        patrimonio: String(res.data.patrimonio),
        sensor: String(res.data.sensor),
        from_ambiente: String(res.data.from_ambiente),
        to_ambiente: String(res.data.to_ambiente),
    };
}