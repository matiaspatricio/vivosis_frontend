import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { makeStyles } from "@mui/styles";
import {
  Card,
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
  Grid,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Send } from "@mui/icons-material";
import { utcToZonedTime } from "date-fns-tz";
import { format as formatDate, set } from "date-fns";
import {
  enviarMensaje,
  enviarMensajeMasivoAPI,
} from "./api/enviosClientes/enviosClientes";

const useStyles = makeStyles({
  card: {
    maxWidth: "90%",
    justifyContent: "center",
    margin: "0 auto",
    backgroundColor: "#f9fafb",
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontFamily: "Public Sans, sans-serif",
    margin: "15px",
  },
  button: {
    margin: "15px",
  },
  root: {
    height: 400,
    width: "100%",
    margin: "10px auto",
    "& .MuiDataGrid-root": {
      border: "0px solid #ccc", //tenia border 1
      backgroundColor: "#ffffff",
    },
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#f4f6f8", // Cambia este valor al color deseado
      color: "#6f7f8b", // Cambia este valor al color deseado para el texto del encabezado
    },

    "& .MuiDataGrid-cell": {
      border: "0.1px solid #ccc",
      padding: "8px",
    },
    "& .MuiButton-root": {
      marginLeft: "5px",
    },
  },
  filtersContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    marginBottom: "30px",
  },
  filterInput: {
    width: "95%",
    margin: "10px",
    marginBottom: "30px",
    maxWidth: "300px",
  },
  roundedGrid: {
    borderRadius: 10, // Ajusta el valor según el radio de redondeo deseado
    height: "500px",
  },
});

const listaLocalidades = [
  { value: "", label: "VACIO" },
  { value: "AVELLANEDA", label: "AVELLANEDA" },
  {
    value: "BERAZATEGUI",
    label: "BERAZATEGUI",
    direccion: `✨ ENTREGA:
    -Vamos a estar enfrente de la estaciòn (Paseo del Andèn, al lado de la pancheria)
* Ubicacion en google maps: https://maps.app.goo.gl/TwSShYmAyBY4AKw67
`,
  },
  {
    value: "CRUCE VARELA",
    label: "CRUCE VARELA",
    direccion: `✨ ENTREGA:
-Vamos a estar en la puerta del banco provincia.
 - Ubicacion en google maps: https://maps.app.goo.gl/6zYSRufU8NexRrzp8
`,
  },
  { value: "ENVIO CORREO", label: "ENVIO CORREO" },
  { value: "ENVIO MENSAJERIA", label: "ENVIO MENSAJERIA" },
  {
    value: "EZPELETA",
    label: "EZPELETA",
    direccion: `✨ ENTREGA:
    -Vamos a estar en los molinetes de la estaciòn (del lado del supermercado DIA)`,
  },
  {
    value: "LANUS",
    label: "LANUS",
    direccion: `✨ ENTREGA:
    - Nos ubicamos al lado de la virgencita de cemento diagonal al mástil (en caso de movernos AVISAMOS por whatsapp
    `,
  },
  {
    value: "LOMAS",
    label: "LOMAS",
    direccion: `✨ ENTREGA:
- Nos ubicamos en Mostaza (CALLE FONROUGE 103)
- https://maps.app.goo.gl/tbYqCCBsT36EYQmx5
`,
  },
  {
    value: "QUILMES",
    label: "QUILMES",
    direccion: `✨ ENTREGA:
    - Vamos a estar enfrente de la casa de deportes (ex Fravega) en los bancos de cemento de la plaza que está enfrente de la estacion  (en caso de movernos AVISAMOS por whatsapp)
- Dirección: Av Rivadavia 23, Quilmes centro.
`,
  },
  { value: "RETIRO EN DOMICILIO", label: "RETIRO EN DOMICILIO" },
  {
    value: "SOLANO",
    label: "SOLANO",
    direccion: `✨ ENTREGA:

-Vamos a estar enfrente de Coppel, en la farmacia.
  - Ubicacion en google Maps: https://maps.app.goo.gl/BAA8acaknYf8SigV6
`,
  },
  {
    value: "VARELA",
    label: "VARELA",
    direccion: `✨ ENTREGA:

-Vamos a estar en la fuente de Varela, (AL COSTADO) del lado del restaurante. 
 - Ubicacion Google Maps: https://maps.app.goo.gl/SSqcpf6bzmQG7jxF7
`,
  },
];
function EnviosClientes() {
  const classes = useStyles();
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [filterLocalidad, setFilterLocalidad] = useState([]);
  const [isCamila, setIsCamila] = useState(true);
  const [mensajeSeleccionado, setMensajeSeleccionado] = React.useState("");
  const listaMensajes = [
    { id: "1", titulo: "Totales" },
    { id: "2", titulo: "Mensaje confirmación" },
    { id: "3", titulo: "Foto bolso" },
    { id: "4", titulo: "Enviar Alias Mercadopago" },
    //{ id: "5", titulo: "Toda la información" },
  ]; // Ejemplo de datos

  useEffect(() => {
    const usuario = localStorage.username;
    if (usuario === "cgimenez") {
      setIsCamila(true);
    } else {
      setIsCamila(false);
    }

    const fetchPedidos = async () => {
      try {
        const response = await axios.get(
          "https://vivosis.vercel.app/api/pedido/getpedidospendientes"
        );
        const data = response.data;
        setPedidos(data);
        setLoading(false);
      } catch (error) {
        console.log("Error al obtener los pedidos:", error);
        setLoading(false);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await axios.get(
          "https://vivosis.vercel.app/api/cliente/getallclientes"
        );
        const data = response.data;
        setClientes(data);
      } catch (error) {
        console.log("Error al obtener los clientes:", error);
      }
    };

    fetchPedidos();
    fetchClientes();
  }, []);

  useEffect(() => {
    if (mensaje !== "") {
      // Lógica a ejecutar cuando `mensaje` cambia y no es una cadena vacía
      // Aquí podrías, por ejemplo, enviar el mensaje a una API o realizar otra acción
    }
  }, [mensaje]);

  const handleMensajeChange = (event) => {
    setMensajeSeleccionado(event.target.value);
  };

  const enviarMensajeMasivo = async () => {
    if (!mensajeSeleccionado || filterLocalidad.length === 0) {
      toast.error("Debe seleccionar un mensaje y una localidad");
      return;
    }
    let estructuraDeMensajes = [];

    sortedPedidosPorCliente.forEach((cliente) => {
      // Asumiendo que cliente incluye el nombre del cliente y mensajeSeleccionado es accesible globalmente
      const mj = generarMensaje(cliente.cliente, mensajeSeleccionado);
      estructuraDeMensajes.push(mj);
    });
    try {
      //console.log("Estructura de mensajes:", estructuraDeMensajes);
      await enviarMensajeMasivoAPI(estructuraDeMensajes);
      toast.success(`Mensajes enviados con éxito`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      toast.error("Error al enviar el mensaje", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const generarMensaje = (cliente, mensajeSeleccionado) => {
    let mensaje = "";
    const pedidosCliente = pedidos.filter(
      (pedido) => pedido.nombre_cliente === cliente
    );
    //Hacer un switch para seleccionar el mensaje
    // eslint-disable-next-line default-case
    switch (mensajeSeleccionado) {
      case "1":
        mensaje = `✨Te dejo tu TOTAL y el alias para abonar es Narelamakeup  (sale a nombre de Narela Aldana Gimenez)
 *ATENCIÓN: (El total del pedido esta en "leer mas" abajo de todo)* :
    
      Detalle de tu pedido:
        Cliente: ${pedidosCliente[0].nombre_cliente}
        Localidad: ${pedidosCliente[0].localidad}        
        Total a pagar: $ ${pedidosCliente.reduce(
          (total, pedido) =>
            total + (pedido.estado_pago !== "ABONADO" ? pedido.total || 0 : 0),
          0
        )}
      
      Productos que compraste:
      ${pedidosCliente
        .map(
          (pedido) => `
        Producto: ${pedido.nombre_articulo}
        Cantidad: ${pedido.cantidad}
        Precio unitario: $${pedido.precio || 0}
        Total de este producto: $${pedido.total || 0}
        Comentarios: ${pedido.comentarios}
      --------------------------------------
      `
        )
        .join("")}
      `;
        break;
      case "2":
        mensaje = `Hola 👋🏻 CONFIRMAME si vas a retirar tu pedido en ${
          pedidosCliente[0].localidad
        } ?

✨ Tenés tiempo hasta las 10:00 (de la mañana) del día de entrega para avisarme✨

${
  listaLocalidades.find(
    (localidad) => localidad.value === pedidosCliente[0].localidad
  ).direccion
}

Tenemos una tolerancia de 10 min ya que tenemos que cumplir con otros puntos. 

-Si no llegas a retirar se tiene que dejar ABONADO (si es que aun no abonaste) y retiras otra semana.
- - ALIAS: Narelamakeup  (sale a nombre de Narela Aldana Gimenez)
`;
        break;
      case "3":
        mensaje = `Está semana, por la ola de calor, no estamos realizando entregas presenciales,

Si estamos realizando envios express (así que déjame tu dirección y te cotizamos el envío).

Opción 2: se deja abonado el pedido para reservarlo y mantener el precio hasta reanudar las entregas :)`;
        break;
      case "4":
        mensaje = `💸Te dejo mi ALIAS: Narelamakeup (sale a nombre de NARELA ALDANA GIMENEZ`;
        break;
      case "5":
        mensaje = `💸Te dejo mi ALIAS: Narelamakeup (sale a nombre de NARELA ALDANA GIMENEZ`;
        break;
      default:
        mensaje = "";
        break;
    }
    const clienteData = clientes.find((c) => c.nombre === cliente);
    if (!clienteData) {
      console.log("No se encontraron datos del cliente");
      return;
    }

    const telefonoCliente = clienteData.telefono;
    const idCliente = clienteData._id;
    return {
      id_cliente: idCliente,      
      nombre_cliente: cliente, // Asumiendo que el objeto cliente tiene una propiedad 'nombre'
      numero_telefono: telefonoCliente, // Asumiendo que el objeto cliente tiene una propiedad 'telefono'
      mensaje: mensaje,
    };
  };

  const localidadesData = pedidos.reduce((acc, pedido) => {
    const { localidad, total, nombre_cliente, estado_pago } = pedido;
    let grupo;
    if (["QUILMES", "EZPELETA", "BERAZATEGUI"].includes(localidad)) {
      grupo = "QUILMES, EZPELETA, BERAZATEGUI";
    } else if (["SOLANO", "VARELA", "CRUCE VARELA"].includes(localidad)) {
      grupo = "SOLANO, VARELA, CRUCE VARELA";
    } else if (["AVELLANEDA", "LANUS", "LOMAS"].includes(localidad)) {
      grupo = "AVELLANEDA, LANUS, LOMAS";
    } else if (!localidad || localidad.trim() === "") {
      grupo = "Localidad vacía";
    } else {
      grupo = "Otras localidades";
    }
    if (!acc[grupo]) {
      acc[grupo] = {
        nombre: grupo,
        cantidadClientes: 0,
        totalPagar: 0,
        clientes: [], // Initialize the array
      };
    }
    if (!acc[grupo].clientes.includes(nombre_cliente)) {
      acc[grupo].clientes.push(nombre_cliente); // Add the client name to the array if it's not already included
      acc[grupo].cantidadClientes++; // Increment the count of unique clients
    }
    if (estado_pago !== "ABONADO") {
      acc[grupo].totalPagar += total; // Sum the total to pay if the payment status is not 'ABONADO'
    }

    return acc;
  }, {});

  const handleCopyToClipboard = async (cliente, mensajeSeleccionado) => {
    if (!mensajeSeleccionado) {
      toast.error("Debe seleccionar un mensaje");
      return;
    }

    const msj = generarMensaje(cliente, mensajeSeleccionado).mensaje;
    setMensaje("");
    setMensaje(msj);
    navigator.clipboard.writeText(msj);
    toast.success(`Mensaje de ${cliente} copiado al portapapeles`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleEnvioAPI = async (cliente, mensajeSeleccionado) => {
    if (!mensajeSeleccionado) {
      toast.error("Debe seleccionar un mensaje");
      return;
    }
    const msj = generarMensaje(cliente, mensajeSeleccionado);
    setMensaje("");
    const telefonoCliente = msj.numero_telefono; //zzzz

    try {
      await enviarMensaje(telefonoCliente, msj.mensaje);
      toast.success(`Mensaje enviado con éxito a ${msj.nombre_cliente}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      toast.error("Error al enviar el mensaje", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleDetalle = async (cliente, mensajeSeleccionado) => {
    if (!mensajeSeleccionado) {
      toast.error("Debe seleccionar un mensaje");
      return;
    }
    const pedidosCliente = pedidos.filter(
      (pedido) => pedido.nombre_cliente === cliente
    );
    //setMensaje("");
    //setMensaje
    const mensajeWsp = `Hola 😁👋🏻 Soy Narela del vivo de maquillajes 😊, te dejo tu total *(El total del pedido esta en "leer mas" abajo de todo)* :

  Detalle de tu pedido:
    Cliente: ${pedidosCliente[0].nombre_cliente}
    Localidad: ${pedidosCliente[0].localidad}
    Fecha de entrega: ${pedidosCliente[0].fecha_entrega}
    Total a pagar: $ ${pedidosCliente.reduce(
      (total, pedido) =>
        total + (pedido.estado_pago !== "ABONADO" ? pedido.total || 0 : 0),
      0
    )}
  
  Productos que compraste:
  ${pedidosCliente
    .map(
      (pedido) => `
    Producto: ${pedido.nombre_articulo}
    Cantidad: ${pedido.cantidad}
    Precio unitario: $${pedido.precio || 0}
    Total de este producto: $${pedido.total || 0}
    Total a pagar de este producto: $${
      pedido.estado_pago === "ABONADO" ? 0 : pedido.total
    }
    Comentarios: ${pedido.comentarios}
  --------------------------------------
  `
    )
    .join("")}
  `;

    const clienteData = clientes.find((c) => c.nombre === cliente);
    if (!clienteData) {
      console.log("No se encontraron datos del cliente");
      return;
    }

    const telefonoCliente = clienteData.telefono;
    const enlace = `https://api.whatsapp.com/send/?phone=${telefonoCliente}&text=${encodeURIComponent(
      mensajeWsp
    )}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(enlace, "_blank");
  };

  const sumarizarPedidosPorCliente = () => {
    const pedidosPorCliente = {};
    pedidos.forEach((pedido) => {
      const { _id, nombre_cliente, total, cantidad, fecha_entrega, localidad } =
        pedido;
      if (!pedidosPorCliente[nombre_cliente]) {
        pedidosPorCliente[nombre_cliente] = {
          id: _id, // Agregar una propiedad "id" para evitar una advertencia en el DataGrid
          id_cliente: pedido.id_cliente,
          cliente: nombre_cliente,
          total: pedido.estado_pago === "ABONADO" ? 0 : total, // Establecer el total en 0 si el estado de pago es 'ABONADO'
          cant_items: cantidad,
          localidad: localidad,
          estado_pago: pedido.estado_pago,
          estado_pedido: pedido.estado_pedido,
          fecha_entrega: pedido.fecha_entrega
            ? formatFecha(pedido.fecha_entrega)
            : null,
        };
      } else {
        pedidosPorCliente[nombre_cliente].total +=
          pedido.estado_pago === "ABONADO" ? 0 : total;
        pedidosPorCliente[nombre_cliente].cant_items += cantidad;
      }
    });
    return Object.values(pedidosPorCliente);
  };

  const formatFecha = (fecha) => {
    const fechaUtc = new Date(fecha);
    const formattedFecha = utcToZonedTime(
      fechaUtc,
      "America/Argentina/Buenos_Aires"
    );
    const fechaFormateada = formatDate(formattedFecha, "yyyy-MM-dd"); //formatDate(formattedFecha, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx');
    return fechaFormateada;
  };

  const pedidosPorCliente = sumarizarPedidosPorCliente();

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };
  const filteredPedidosPorCliente = pedidosPorCliente.filter((pedido) =>
    pedido.cliente.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleFilterLocalidadChange = (event, value) => {
    setFilterLocalidad(value);
  };
  const getOptionLabel = (option) => option.label;

  const filteredPedidosPorLocalidad = filterLocalidad.length
    ? filteredPedidosPorCliente.filter((pedido) =>
        filterLocalidad.some(
          (localidad) => pedido.localidad === localidad.value
        )
      )
    : filteredPedidosPorCliente;
  const sortedPedidosPorCliente = filteredPedidosPorLocalidad.sort((a, b) => {
    const clienteA = a.cliente.toLowerCase();
    const clienteB = b.cliente.toLowerCase();
    if (clienteA < clienteB) {
      return -1;
    }
    if (clienteA > clienteB) {
      return 1;
    }
    return 0;
  });

  const columns = [
    { field: "cliente", headerName: "Cliente", flex: 1 },
    { field: "total", headerName: "Total a pagar", flex: 1 },
    { field: "cant_items", headerName: "Cantidad de productos", flex: 1 },
    { field: "fecha_entrega", headerName: "Fecha de Entrega", flex: 1 },
    { field: "localidad", headerName: "Localidad", flex: 1 },
    { field: "estado_pedido", headerName: "Estado del Pedido", flex: 1 },
    { field: "estado_pago", headerName: "Estado del Pago", flex: 1 },
    {
      field: "detalle",
      headerName: "Acciones",
      flex: 1,
      align: "center",
      renderCell: (params) => (
        <Box>
          <Button
            color="success"
            onClick={() =>
              handleDetalle(params.row.cliente, mensajeSeleccionado)
            }
            size="small"
            style={{ marginLeft: 5, marginTop: 5, marginBottom: 5 }}
          >
            <WhatsAppIcon />
          </Button>
          <CopyToClipboard
            text={mensaje}
            onCopy={() =>
              handleCopyToClipboard(params.row.cliente, mensajeSeleccionado)
            }
          >
            <Button color="success" size="small" style={{ marginLeft: 16 }}>
              <ContentCopyIcon />
            </Button>
          </CopyToClipboard>
          <Button
            color="success"
            onClick={() =>
              handleEnvioAPI(params.row.cliente, mensajeSeleccionado)
            }
            size="small"
            style={{ marginLeft: 5, marginTop: 5, marginBottom: 5 }}
          >
            <Send />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {loading ? (
        <div>Cargando clientes...</div>
      ) : (
        <Card className={classes.card}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom className={classes.h4}>
              Resumen de Pedidos por Cliente
            </Typography>
          </Stack>
          <ToastContainer />
          {!isCamila && (
            <DataGrid
              rows={Object.values(localidadesData)}
              columns={[
                { field: "nombre", headerName: "Localidad", flex: 1 },
                {
                  field: "cantidadClientes",
                  headerName: "Cantidad de Clientes",
                  flex: 1,
                },
                {
                  field: "totalPagar",
                  headerName: "Total a Pagar",
                  flex: 1,
                  valueFormatter: (params) => {
                    const formattedTotal = new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }).format(params.value);
                    return formattedTotal;
                  },
                },
              ]}
              getRowId={(row) => row.nombre} // Usa el nombre de la localidad como id
              disableRowSelectionOnClick
              density="compact"
            />
          )}

          <Grid container className={classes.filtersContainer}>
            <Grid item xs={2}>
              <TextField
                label="Buscar por cliente"
                variant="outlined"
                margin="dense"
                value={searchValue}
                onChange={handleSearchChange}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl
                variant="outlined"
                size="small"
                className={classes.filterInput}
              >
                <InputLabel id="mensaje-select-label">Mensaje</InputLabel>
                <Select
                  labelId="mensaje-select-label"
                  value={mensajeSeleccionado}
                  onChange={handleMensajeChange}
                  label="Mensaje"
                >
                  {listaMensajes.map((mensaje) => (
                    <MenuItem key={mensaje.id} value={mensaje.id}>
                      {mensaje.titulo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={enviarMensajeMasivo}
              >
                Enviar Mensaje masivo
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Autocomplete
                size="small"
                getOptionLabel={getOptionLabel}
                multiple
                options={listaLocalidades}
                value={filterLocalidad}
                onChange={handleFilterLocalidadChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Localidad"
                    variant="outlined"
                    className={classes.filterInput}
                    size="small"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Paper className={classes.roundedGrid}>
            <DataGrid
              rows={sortedPedidosPorCliente}
              columns={columns}
              disableRowSelectionOnClick
              density="compact"
            />
          </Paper>
        </Card>
      )}
    </Box>
  );
}

export default EnviosClientes;
