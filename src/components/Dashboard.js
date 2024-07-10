import { useEffect, useState } from "react";
import { Typography, Card, CardContent, Grid } from "@mui/material";
import { getPedidosPendientes, getTotalesDashboard } from "./api/pedido/pedido";

const Dashboard = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [pedidosPreparados, setPedidosPreparados] = useState([]);
  const [clientesConPedidosPendientes, setClientesConPedidosPendientes] =
    useState([]);
  const [clientesConPedidosPreparados, setClientesConPedidosPreparados] =
    useState([]);
  const [dineroPendiente, setDineroPendiente] = useState(0);
  const [totalesDashboard, setTotalesDashboard] = useState({
    pedidosHoy: { cantidadDia: 0, totalHoy: 0 },
    pedidosAyer: { cantidadAyer: 0, totalAyer: 0 },
    pedidosSemana: { cantidadSemana: 0, totalSemana: 0 },
    pedidosSemanaAnterior: {
      cantidadSemanaAnterior: 0,
      totalSemanaAnterior: 0,
    },
    pedidosMes: { cantidadMes: 0, totalMes: 0 },
    pedidosMesAnterior: { cantidadMesAnterior: 0, totalMesAnterior: 0 },
  });
  //const [montoTotal, setMontoTotal] = useState(0);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");

    const fetchData = async () => {
      try {
        //const pedidosMes = await getPedidosMes();
        const totalDashboard = await getTotalesDashboard();
        setTotalesDashboard(totalDashboard);
        console.log("totalesDashboard", totalDashboard);

        /*setMontoTotal(
          pedidosMes.reduce((total, pedido) => total + pedido.total, 0)
        );
*/
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
            <Typography variant="h4">
              {totalesDashboard.pedidosHoy?.cantidadDia ?? 0}
            </Typography>
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
              {totalesDashboard.pedidosHoy.totalHoy
                ? formatToCurrency(totalesDashboard.pedidosHoy.totalHoy)
                : 0}
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
              {totalesDashboard.pedidosAyer.cantidadAyer
                ? totalesDashboard.pedidosAyer.cantidadAyer
                : 0}
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
              {totalesDashboard.pedidosAyer.totalAyer
                ? formatToCurrency(totalesDashboard.pedidosAyer.totalAyer)
                : 0}
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
              {totalesDashboard.pedidosSemana.cantidadSemana
                ? totalesDashboard.pedidosSemana.cantidadSemana
                : 0}
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
              {totalesDashboard.pedidosSemana.totalSemana
                ? formatToCurrency(totalesDashboard.pedidosSemana.totalSemana)
                : 0}
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
              {totalesDashboard.pedidosSemanaAnterior.cantidadSemanaAnterior
                ? totalesDashboard.pedidosSemanaAnterior.cantidadSemanaAnterior
                : 0}
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
              {totalesDashboard.pedidosSemanaAnterior.totalSemanaAnterior
                ? formatToCurrency(
                    totalesDashboard.pedidosSemanaAnterior.totalSemanaAnterior
                  )
                : 0}
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
              {totalesDashboard.pedidosMes.totalMes
                ? totalesDashboard.pedidosMes.cantidadMes
                : 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total pedidos del mes
            </Typography>
            <Typography variant="h4">
              {totalesDashboard.pedidosMes.totalMes
                ? formatToCurrency(totalesDashboard.pedidosMes.totalMes)
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
              {totalesDashboard.pedidosMesAnterior.cantidadMesAnterior
                ? totalesDashboard.pedidosMesAnterior.cantidadMesAnterior
                : 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total pedidos del mes anterior
            </Typography>
            <Typography variant="h4">
              {totalesDashboard.pedidosMesAnterior.totalMesAnterior
                ? formatToCurrency(
                    totalesDashboard.pedidosMesAnterior.totalMesAnterior
                  )
                : 0}
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
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom></Typography>
            <Typography variant="h4"></Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
