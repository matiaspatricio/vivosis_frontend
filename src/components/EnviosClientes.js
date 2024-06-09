import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import { Card, Box, Typography, TextField, Paper, Stack, Grid, Autocomplete, CardContent } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Alert from '@mui/material/Alert';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { utcToZonedTime } from 'date-fns-tz';
import { format as formatDate, set } from 'date-fns';


const useStyles = makeStyles({
  card: {
    maxWidth: '90%',
    justifyContent: 'center',
    margin: '0 auto',    
    backgroundColor : '#f9fafb',    
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,   
    fontFamily: 'Public Sans, sans-serif',
    margin: '15px',         
  },
  button: {
    margin: '15px',},
  root: {
    height: 400,
    width: '100%',
    margin: '10px auto',
    '& .MuiDataGrid-root': {
      border: '0px solid #ccc',//tenia border 1
      backgroundColor: '#ffffff',
    },
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: '#f4f6f8', // Cambia este valor al color deseado
      color: '#6f7f8b', // Cambia este valor al color deseado para el texto del encabezado
    },

    '& .MuiDataGrid-cell': {
      border: '0.1px solid #ccc',
      padding: '8px',
      
    },
    '& .MuiButton-root': {
      marginLeft: '5px',
    },
  },
  filtersContainer: {    
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    marginBottom: '30px',        
  },
  filterInput: {
    width: '95%',        
    margin: '10px',
    marginBottom: '30px',
    maxWidth: '300px',           
  },
  roundedGrid: {
    borderRadius: 10, // Ajusta el valor según el radio de redondeo deseado
    height: '500px',
  },
});

const listaLocalidades = [
  { value: '', label: 'VACIO' },
  { value: 'AVELLANEDA', label: 'AVELLANEDA' },
  { value: 'BERAZATEGUI', label: 'BERAZATEGUI' },
  { value: 'CRUCE VARELA', label: 'CRUCE VARELA' },
  { value: 'ENVIO CORREO', label: 'ENVIO CORREO' },
  { value: 'ENVIO MENSAJERIA', label: 'ENVIO MENSAJERIA' },
  { value: 'EZPELETA', label: 'EZPELETA' },
  { value: 'LANUS', label: 'LANUS' },
  { value: 'LOMAS', label: 'LOMAS' },
  { value: 'QUILMES', label: 'QUILMES' },
  { value: 'RETIRO EN DOMICILIO', label: 'RETIRO EN DOMICILIO' },
  { value: 'SOLANO', label: 'SOLANO' },
  { value: 'VARELA', label: 'VARELA' }
];
function EnviosClientes() {
  const classes = useStyles();
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [mensaje, setMensaje] = useState('');  
  const [filterLocalidad, setFilterLocalidad] = useState([]);
  
  

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get('https://vivosis.vercel.app/api/pedido/getpedidospendientes');
        const data = response.data;
        setPedidos(data);
        console.log(pedidos)
        setLoading(false);
      } catch (error) {
        console.log('Error al obtener los pedidos:', error);
        setLoading(false);
      }
    };

    

    const fetchClientes = async () => {
      try {
        const response = await axios.get('https://vivosis.vercel.app/api/cliente/getallclientes');
        const data = response.data;
        setClientes(data);
      } catch (error) {
        console.log('Error al obtener los clientes:', error);
      }
    };

    fetchPedidos();
    fetchClientes();
  }, []);
  const localidadesData = pedidos.reduce((acc, pedido) => {
    const { localidad, total, nombre_cliente, estado_pago } = pedido;
    let grupo;
    if (['QUILMES', 'EZPELETA', 'BERAZATEGUI'].includes(localidad)) {
      grupo = 'QUILMES, EZPELETA, BERAZATEGUI';
    } else if (['SOLANO', 'VARELA', 'CRUCE VARELA'].includes(localidad)) {
      grupo = 'SOLANO, VARELA, CRUCE VARELA';
    } else if (['AVELLANEDA', 'LANUS', 'LOMAS'].includes(localidad)) {
      grupo = 'AVELLANEDA, LANUS, LOMAS';
    } else if (!localidad || localidad.trim() === '') {
      grupo = 'Localidad vacía';
    } else {
      grupo = 'Otras localidades';
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
    if (estado_pago !== 'ABONADO') {
      acc[grupo].totalPagar += total; // Sum the total to pay if the payment status is not 'ABONADO'
    
    }
    console.log(acc);
    return acc;
    
  }, {});

  const handleCopyToClipboard  = async (cliente) => {
    setCopied(true);
    const pedidosCliente = pedidos.filter((pedido) => pedido.nombre_cliente === cliente);
    setMensaje(`Hola 😁👋🏻 Soy Narela del vivo de maquillajes 😊, te dejo tu total *(El total del pedido esta en "leer mas" abajo de todo)* :

  Detalle de tu pedido:
    Cliente: ${pedidosCliente[0].nombre_cliente}
    Localidad: ${pedidosCliente[0].localidad}
    Fecha de entrega: ${pedidosCliente[0].fecha_entrega}
    Total a pagar: $ ${pedidosCliente.reduce((total, pedido) => total + (pedido.estado_pago !== 'ABONADO' ? (pedido.total || 0) : 0), 0)}
  
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
    .join('')}
  `);


    setTimeout(() => {
      setCopied(false);
    }, 1500); // Duración del mensaje en milisegundos (ej. 3000ms = 3 segundos)
  };                 
    

  const handleDetalle = async (cliente) => {
    const pedidosCliente = pedidos.filter((pedido) => pedido.nombre_cliente === cliente);
    setMensaje('');
    setMensaje(`Hola 😁👋🏻 Soy Narela del vivo de maquillajes 😊, te dejo tu total *(El total del pedido esta en "leer mas" abajo de todo)* :

  Detalle de tu pedido:
    Cliente: ${pedidosCliente[0].nombre_cliente}
    Localidad: ${pedidosCliente[0].localidad}
    Fecha de entrega: ${pedidosCliente[0].fecha_entrega}
    Total a pagar: $ ${pedidosCliente.reduce((total, pedido) => total + (pedido.estado_pago !== 'ABONADO' ? (pedido.total || 0) : 0), 0)}
  
  Productos que compraste:
  ${pedidosCliente
    .map(
      (pedido) => `
    Producto: ${pedido.nombre_articulo}
    Cantidad: ${pedido.cantidad}
    Precio unitario: $${pedido.precio || 0}
    Total de este producto: $${pedido.total || 0}
    Total a pagar de este producto: $${pedido.estado_pago === 'ABONADO' ? 0 :pedido.total}
    Comentarios: ${pedido.comentarios}
  --------------------------------------
  `
    )
    .join('')}
  `);

    const clienteData = clientes.find((c) => c.nombre === cliente);
    if (!clienteData) {
      console.log('No se encontraron datos del cliente');
      return;
    }

    const telefonoCliente = clienteData.telefono;
    const enlace = `https://api.whatsapp.com/send/?phone=${telefonoCliente}&text=${encodeURIComponent(mensaje)}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(enlace, '_blank');
  };

  const sumarizarPedidosPorCliente = () => {
    const pedidosPorCliente = {};
    pedidos.forEach((pedido) => {
      const { nombre_cliente, total,cantidad, fecha_entrega, localidad } = pedido;
      if (!pedidosPorCliente[nombre_cliente]) {
        pedidosPorCliente[nombre_cliente] = {
          id: nombre_cliente, // Agregar una propiedad "id" para evitar una advertencia en el DataGrid
          cliente: nombre_cliente,
          total: pedido.estado_pago === 'ABONADO' ? 0 : total, // Establecer el total en 0 si el estado de pago es 'ABONADO'
          cant_items:  cantidad,          
          localidad: localidad,
          estado_pago: pedido.estado_pago,
          estado_pedido: pedido.estado_pedido,
          fecha_entrega: pedido.fecha_entrega ? formatFecha(pedido.fecha_entrega): null,
        };
      } else {
        pedidosPorCliente[nombre_cliente].total += pedido.estado_pago === 'ABONADO' ? 0 : total;
        pedidosPorCliente[nombre_cliente].cant_items +=  cantidad; 
      }
    });
    return Object.values(pedidosPorCliente);
  };

  const formatFecha = fecha => {
    const fechaUtc = new Date(fecha);
    const formattedFecha = utcToZonedTime(fechaUtc, 'America/Argentina/Buenos_Aires');
    const fechaFormateada = formatDate(formattedFecha, 'yyyy-MM-dd');     //formatDate(formattedFecha, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx');    
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
  ? filteredPedidosPorCliente.filter((pedido) => filterLocalidad.some((localidad) => pedido.localidad === localidad.value))
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
    { field: 'cliente', headerName: 'Cliente', flex: 1 },
    { field: 'total', headerName: 'Total a pagar', flex: 1 },
    { field: 'cant_items', headerName: 'Cantidad de productos', flex: 1 },
    { field: 'fecha_entrega', headerName: 'Fecha de Entrega', flex: 1 },
    { field: 'localidad', headerName: 'Localidad', flex: 1 },
    { field: 'estado_pedido', headerName: 'Estado del Pedido', flex: 1 },
    { field: 'estado_pago', headerName: 'Estado del Pago', flex: 1 },
    {
      field: 'detalle',
      headerName: 'Detalle',
      flex: 1,
      align: 'center',
      renderCell: (params) => (
        <Box>
          <Button  color="success" onClick={() => handleDetalle(params.row.cliente)} size="small" style={{ marginLeft: 5, marginTop: 5, marginBottom: 5 } }>
          <WhatsAppIcon/>
          </Button>
          <CopyToClipboard text={mensaje} onCopy={() => handleCopyToClipboard(params.row.cliente)}>
            <Button  color="success" size="small" style={{ marginLeft: 16 }}>
              <ContentCopyIcon />
            </Button>
          </CopyToClipboard>
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom className={classes.h4}>
            Resumen de Pedidos por Cliente
            </Typography>                        
          </Stack>  
          <DataGrid
            rows={Object.values(localidadesData)}
            columns={[
              { field: 'nombre', headerName: 'Localidad', flex: 1 },
              { field: 'cantidadClientes', headerName: 'Cantidad de Clientes', flex: 1 },
              { 
                field: 'totalPagar', 
                headerName: 'Total a Pagar', 
                flex: 1,
                valueFormatter: (params) => {
                  const formattedTotal = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(params.value);
                  return formattedTotal;
                },
              },
            ]}
            getRowId={(row) => row.nombre} // Usa el nombre de la localidad como id
            disableRowSelectionOnClick
            density="compact"
          />

        <Grid container className={classes.filtersContainer}>
          <Grid item xs={2} >        
              <TextField
                label="Buscar por cliente"
                variant="outlined"
                margin="dense"
                value={searchValue}
                onChange={handleSearchChange}
              />  
          </Grid>       
          <Grid item xs={2}>
              <Autocomplete 
                size='small'
                getOptionLabel={getOptionLabel}
                multiple
                options={listaLocalidades}
                value={filterLocalidad}
                onChange={handleFilterLocalidadChange}
                renderInput={params => (
                  <TextField {...params} label="Localidad" variant="outlined" className={classes.filterInput}size='small'  />
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
      <Box style={{ margin: '1rem 0' }} align="center">
        {copied && (
          <Alert severity="success">
            Mensaje copiado al portapapeles.
          </Alert>
        )}
      </Box> 
    </Box>
  );
}

export default EnviosClientes;