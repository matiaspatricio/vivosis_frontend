import { useEffect, useState } from "react";
import { Typography, Card, CardContent, Grid } from "@mui/material";
import { startOfToday, subDays, format } from "date-fns";
import {
  getPedidosPendientes,
  getPedidosMes,
  getTotalesDashboard  
} from "./api/pedido/pedido";

const Dashboard = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [pedidosPreparados, setPedidosPreparados] = useState([]);
  const [clientesConPedidosPendientes, setClientesConPedidosPendientes] =
    useState([]);
  const [clientesConPedidosPreparados, setClientesConPedidosPreparados] =
    useState([]);
  const [dineroPendiente, setDineroPendiente] = useState(0);
  const [totalesDashboard, setTotalesDashboard] = useState(0);
  const [montoTotal, setMontoTotal] = useState(0);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");

    const fetchData = async () => {
      try {
        const pedidosMes = await getPedidosMes();
        const totalesDashboard = await getTotalesDashboard();
        setTotalesDashboard(totalesDashboard);

        setMontoTotal(
          pedidosMes.reduce((total, pedido) => total + pedido.total, 0)
        );

        const data = await getPedidosPendientes();
        setPedidosPendientes(
          data.filter((pedido) => pedido.estado_pedido === "PENDIENTE")
        );
        setPedidosPreparados(
          data.filter((pedido) => pedido.estado_pedido === "PREPARADO")
        );
        setClientesConPedidosPendientes(
          Array.from(new Set(data.map((pedido) => pedido.nombre_cliente)))
        );
        setClientesConPedidosPreparados(
          Array.from(
            new Set(
              data
                .filter((pedido) => pedido.estado_pedido === "PREPARADO")
                .map((pedido) => pedido.nombre_cliente)
            )
          )
        );

        setDineroPendiente(
          data
            .filter((pedido) => pedido.estado_pago === "PENDIENTE")
            .reduce((total, pedido) => total + pedido.total, 0)
        );
      } catch (error) {
        console.log("Error al cargar los pedidos:", error);
      }
    };

    fetchData();
  }, []);

  const formatToCurrency = (amount) => {
    return amount.toLocaleString("en-AR", {
      style: "currency",
      currency: "ARS",
    });
  };

  return (
    <Grid container spacing={2} mt={5}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pedidos pendientes
            </Typography>
            <Typography variant="h4">{pedidosPendientes.length}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Clientes con pedidos pendientes
            </Typography>
            <Typography variant="h4">
              {clientesConPedidosPendientes.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pedidos preparados
            </Typography>
            <Typography variant="h4">{pedidosPreparados.length}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Clientes con pedidos preparados
            </Typography>
            <Typography variant="h4">
              {clientesConPedidosPreparados.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cant. Pedidos hoy
            </Typography>
            <Typography variant="h4">{totalesDashboard.cantidadDia}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total de hoy
            </Typography>
            <Typography variant="h4">
              {formatToCurrency(totalesDashboard.totalHoy)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cant. Pedidos ayer
            </Typography>
            <Typography variant="h4">
              {totalesDashboard.cantidadAyer}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total de ayer
            </Typography>
            <Typography variant="h4">
              {formatToCurrency(totalesDashboard.totalAyer)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cant. esta semana
            </Typography>
            <Typography variant="h4">
              {totalesDashboard.cantidadSemana}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total esta semana
            </Typography>
            <Typography variant="h4">
              {formatToCurrency(totalesDashboard.totalSemana)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cant. semana anterior
            </Typography>
            <Typography variant="h4">
              {totalesDashboard.cantidadSemanaAnterior}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total semana anterior
            </Typography>
            <Typography variant="h4">
              {formatToCurrency(totalesDashboard.totalSemanaAnterior)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dinero pendiente de cobro
            </Typography>
            <Typography variant="h4">
              ${dineroPendiente ? formatToCurrency(dineroPendiente) : 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
            Cantidad pedidos mes              
            </Typography>
            <Typography variant="h4">
              {totalesDashboard.totalMes
                ? formatToCurrency(totalesDashboard.cantidadMes)
                : 0}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              
            </Typography>
            <Typography variant="h4">
            Total de pedidos del mes
            {totalesDashboard.totalMes ? formatToCurrency(totalesDashboard.totalMes)
                : 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cantidad pedidos mes anterior
            </Typography>
            <Typography variant="h4">
              {totalesDashboard.cantidadMesAnterior
                ? formatToCurrency(totalesDashboard.cantidadMesAnterior)
                : 0}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total de pedidos del mes anterior
            </Typography>
            <Typography variant="h4">
              {totalesDashboard.totalMesAnterior
                ? formatToCurrency(totalesDashboard.totalMesAnterior)
                : 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
