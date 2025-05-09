const API_URL = "https://vivosis.vercel.app/api/producto";
//const API_URL = "http://localhost:3001/api/producto";

export const getProductos = async () => {
    const response = await fetch(`${API_URL}/getallproductos`);
    const data = await response.json();
    return data;
    }
export const getProducto = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();
    return data;
};
export const addProducto = async (producto) => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(producto),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al agregar el producto:", error);
        throw error;
    }
};
export const updateProducto = async (producto) => {
    try {
        const response = await fetch(`${API_URL}/${producto._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(producto),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al modificar el producto:", error);
        throw error;
    }
};
export const deleteProducto = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al eliminar el producto:", error);
        throw error;
    }
};
export const createProducto = async (producto) => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(producto),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al crear el producto:", error);
        throw error;
    }
};


export const actualizarStockProducto = async (id,cantidad) => {
    try {
        const response = await fetch(`${API_URL}/actualizarstockproducto/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({cantidad:cantidad}),
        });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error al modificar el producto:", error);
        throw error;
    }

};