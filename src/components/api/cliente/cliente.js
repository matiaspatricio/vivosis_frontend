const API_URL = "https://vivosis.vercel.app/api/cliente";
//const API_URL = "http://localhost:3001/api/cliente";

export const getAllClientes = async () => {
    const response = await fetch(`${API_URL}/getallclientes`);
    const data = await response.json();
    
    return data;
    };
export const getCliente = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();
    return data;
    }
export const createCliente = async (cliente) => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cliente),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al crear el cliente:", error);
        throw error;
    }
};
export const updateCliente = async (cliente) => {
    try {
        const response = await fetch(`${API_URL}/${cliente._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cliente),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al modificar el cliente:", error);
        throw error;
    }
};

export const deleteCliente = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al eliminar el cliente:", error);
        throw error;
    }
};