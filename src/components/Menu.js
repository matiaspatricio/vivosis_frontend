import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, Button, useMediaQuery, useTheme } from '@material-ui/core';
import { MenuSharp as MenuSharpIcon, Home as HomeIcon, Person as PersonIcon, ShoppingCart as ShoppingCartIcon, MonetizationOn as MonetizationOnIcon, LocalShipping as LocalShippingIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, Create as CreateIcon, Visibility as VisibilityIcon, WhatsApp as WhatsAppIcon } from '@material-ui/icons';

function Menu({ isAuthenticated, handleLogout }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);//useState(!isSmallScreen);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [clientesOpen, setClientesOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleServicesToggle = () => {
    setServicesOpen(!servicesOpen);
  };

  const handleClientesToggle = () => {
    setClientesOpen(!clientesOpen);
  };

  const handleProductosToggle = () => {
    setProductosOpen(!productosOpen);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
            <MenuSharpIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Menu
          </Typography>
          <div>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/logout" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
        <List style={{ width: isSmallScreen ? '100vw' : 350 }}>
          <ListItem button component={Link} to="/" onClick={handleDrawerClose}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="INICIO" />
          </ListItem>
          <ListItem button onClick={handleClientesToggle}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="CLIENTES" />
            {clientesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={clientesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button component={Link} to="/crearcliente" onClick={handleDrawerClose} style={{ paddingLeft: 32 }}>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary="CREAR " />
              </ListItem>
              <ListItem button component={Link} to="/verclientes" onClick={handleDrawerClose} style={{ paddingLeft: 32 }}>
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="VISUALIZAR" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={handleProductosToggle}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="PRODUCTOS" />
            {productosOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={productosOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button component={Link} to="/crearproducto" onClick={handleDrawerClose} style={{ paddingLeft: 32 }}>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary="CREAR" />
              </ListItem>
              <ListItem button component={Link} to="/verproductos" onClick={handleDrawerClose} style={{ paddingLeft: 32 }}>
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="VISUALIZAR" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={handleServicesToggle}>
            <ListItemIcon>
              <MonetizationOnIcon />
            </ListItemIcon>
            <ListItemText primary="PEDIDOS" />
            {servicesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={servicesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button component={Link} to="/crearpedido" onClick={handleDrawerClose} style={{ paddingLeft: 32 }}>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary="CREAR" />
              </ListItem>
              <ListItem button component={Link} to="/verpedidos" onClick={handleDrawerClose} style={{ paddingLeft: 32 }}>
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="VISUALIZAR" />
              </ListItem>
              <ListItem button component={Link} to="/enviosclientes" onClick={handleDrawerClose} style={{ paddingLeft: 32 }}>
                <ListItemIcon>
                  <WhatsAppIcon />
                </ListItemIcon>
                <ListItemText primary="ENVIOS TOTALES WHATSAPP" />
              </ListItem>
              <ListItem button component={Link} to="/verpedidoshistorico" onClick={handleDrawerClose} style={{ paddingLeft: 32 }}>
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="HISTORICO (PEDIDOS)" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button component={Link} to="/veringresos" onClick={handleDrawerClose}>
            <ListItemIcon>
              <LocalShippingIcon />
            </ListItemIcon>
            <ListItemText primary="INGRESOS" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default Menu;