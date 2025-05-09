const API_URL = "https://vivosis.vercel.app/api/ingreso";
//const API_URL = "http://localhost:3001/api/ingreso";

export const getIngresos = async () => {
  const response = await fetch(`${API_URL}/getallingresos`);
  const data = await response.json();
  return data;
};
export const getIngreso = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  const data = await response.json();
  return data;
};
export const createIngreso = async (ingreso) => {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingreso),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error al agregar el ingreso:", error);
    throw error;
  }
};

export const updateIngreso = async (ingreso) => {
  try {
    const response = await fetch(`${API_URL}/${ingreso._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingreso),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error al modificar el ingreso:", error);
    throw error;
  }
};
export const deleteIngreso = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error al eliminar el ingreso:", error);
    throw error;
  }
};