const API_URL = "https://vivosis.vercel.app/api/pedido";
//const API_URL = "http://localhost:3001/api/pedido";

export const getPedidosPendientes = async () => {
  const response = await fetch(`${API_URL}/getpedidospendientes`);
  const data = await response.json();
  return data;
};
export const getTotalesDashboard = async () => {
  const response = await fetch(`${API_URL}/gettotalesdashboard`);
  const data = await response.json();
  return data;
}

export const getAllPedidos = async () => {
  const response = await fetch(`${API_URL}/getallpedidos`);
  const data = await response.json();
  return data;
};
export const actualizarPedido = async (pedido) => {
  try {
    //console.log('Pedido a actualizar:', pedido);
    const response = await fetch(
      `https://vivosis.vercel.app/api/pedido/${pedido._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Error al modificar el pedido:", error);
    throw error; // Lanza el error para que pueda ser manejado por la función que llame a esta.
  }
};

export const deletePedido = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error al eliminar el pedido:", error);
    throw error;
  }
};
export const createPedido = async (pedido) => {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedido),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error al agregar el pedido:", error);
    throw error;
  }
};

export const getPedido = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  const data = await response.json();
  return data;
};
