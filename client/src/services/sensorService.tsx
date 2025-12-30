import api from "./api";

// POST
export async function createSensor(data: {name: string; exit_to_ambiente: string; entry_to_ambiente: string;}){
    const res = await api.post("sensores/criar", data)
    return res.data
}

// GET ALL