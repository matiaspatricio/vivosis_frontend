const API_URL = "https://vivosis.vercel.app/api/categoria";
//const API_URL = "http://localhost:3001/api/categoria";

export const getCategorias = async () => {
    const response = await fetch(`${API_URL}/getallcategorias`);
    const data = await response.json();
    return data;
    };
