//const API_URL = "https://vivosis-comunicaciones.onrender.com/api/whatsapp";
const API_URL = "http://localhost:3003/api/whatsapp";

export const enviarMensaje = async (numero, mensaje) => {
  try {
    //console.log('Pedido a actualizar:', pedido);
    const response = await fetch(`${API_URL}/enviar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero, mensaje }),
    });

    const data = await response.json();    
    return data;
  } catch (error) {    
    console.log("Error al enviar el mensaje:", error);
    throw error; // Lanza el error para que pueda ser manejado por la función que llame a esta.
  }
};

export const enviarMensajeMasivoAPI = async (mensajes) => {
  console.log('Mensajes a enviar:', mensajes);
  try {
    //console.log('Pedido a actualizar:', pedido);
    const response = await fetch(`${API_URL}/enviarMasivo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( mensajes ),
    });

    const data = await response.json();    
    return data;
  } catch (error) {    
    console.log("Error al enviar el mensaje:", error);
    throw error; // Lanza el error para que pueda ser manejado por la función que llame a esta.
  }
}