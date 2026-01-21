import api from "./api";

// POST
export async function createSensor(data: {name: string; exit_to_ambiente: string; entry_to_ambiente: string;}){
    const payload = {
        name: data.name,
        exit_to_ambiente: Number(data.exit_to_ambiente),
        entry_to_ambiente: Number(data.entry_to_ambiente),
    };
    const res = await api.post("sensores/criar/", payload);
    return {
        ...res.data,
        id: String(res.data.id),
        exit_to_ambiente: String(res.data.exit_to_ambiente),
        entry_to_ambiente: String(res.data.entry_to_ambiente),
    };
}

// GET ALL
export async function getSensors() {
    const res = await api.get("sensores/");
    return res.data.map((sensor: any) => ({
        ...sensor,
        id: String(sensor.id),
        exit_to_ambiente: String(sensor.exit_to_ambiente),
        entry_to_ambiente: String(sensor.entry_to_ambiente),
    }));
}

// DELETE
export async function deleteSensor(id: string) {
    await api.delete(`sensores/${id}/`);
}

// PUT
export async function updateSensor(id: string, data: any) {
    const payload = {
        ...data,
        exit_to_ambiente: data.exit_to_ambiente ? Number(data.exit_to_ambiente) : undefined,
        entry_to_ambiente: data.entry_to_ambiente ? Number(data.entry_to_ambiente) : undefined,
    };
    const res = await api.put(`sensores/${id}/`, payload);
    return res.data;
}
