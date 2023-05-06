import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
  IconButton
} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import CardBuy from "../components/buyCard/CardBuy";
import GET_PRODUCT_BUY from "../service/graphql/querys/getAllProductBuy";
import DialogState from "../components/buyCard/DialogState";
import FilterDrawer from "../components/sales/FilterDrawer";

const Sales = () => {

  const [buys, setBuys] = useState([]);

  const [loading, setLoading] = useState(true);

  const [shipment, setShipment] = useState("");

  const [open, setOpen] = useState(false);

  const [openFilters, setOpenFilters] = useState(false);

  const handleDrawerOpen = () => {
    setOpenFilters(true);
  };

  const handleDrawerClose = () => {
    setOpenFilters(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [AllProductBuy, {refetch}] = useLazyQuery(GET_PRODUCT_BUY);

  const getAllProductBuy = async () => {
    const { data } = await AllProductBuy();
    if (data) {
      setBuys(data.getAllProductBuy);
    }
  };
  useEffect(() => {
    getAllProductBuy().finally(() => {
      setLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: "4rem", mb: "4rem" }}>
      <Box
        sx={{
          bgcolor: "#1D222B",
          minHeight: "100vh",
          padding: "3rem",
          borderRadius: 2,
          mr: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontSize: 25,
            fontFamily: "monospace",
            fontWeight: 700,
            textDecoration: "none",
            color: "#fff",
            mb: "1.5rem",
          }}
        >
          Ventas
        </Typography>
        <DialogState
          handleClose={handleClose}
          open={open}
          shipment={shipment}
          refetch={refetch}
          setBuys={setBuys}
        />
        <Grid container spacing={3}>
          <Grid item align='center' xs={12}>
            <Box sx={{width: '80%', display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
              <IconButton onClick={handleDrawerOpen}><Typography sx={{color:'#fff', fontSize:'14px', mr:'10px'}}>FILTROS</Typography><FilterListIcon sx={{color:'#fff', fontSize: '30px'}}/></IconButton>
            </Box>
            <FilterDrawer
                openFilters={openFilters}
                handleDrawerClose={handleDrawerClose}
                AllProductBuy={AllProductBuy}
                setBuys={setBuys}
            />
          </Grid>
          {loading ? (
            <div
              style={{
                width: "100%",
                height: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={100} sx={{ color: "#FF914D" }} />
            </div>
          ) : buys.length !== 0 ? (
            buys.map((buy) => {
              const date = new Date(buy.buy.createdAt);
              const dateString = date.toISOString().slice(0, 10);
              return (
                <Grid item sx={{ width: "100%" }} align="center" key={buy.buy.id}>
                  <Card sx={{ width: { md: "80%", sm: "100%" } }}>
                    <CardContent
                      sx={{
                        display: "flex",
                        justifyContent: 'space-around',
                        flexDirection: {xs:'column',sm:'row'},
                        alignItems: {sm:'center', md:'none'},
                        padding: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "justify",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            ID compra:
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              ml: "5px",
                              color: "#555",
                            }}
                          >
                            {buy.buy.id}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Precio total:
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              ml: "5px",
                              color: "#555",
                            }}
                          >
                            {Intl.NumberFormat("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            }).format(buy.buy.totalPrice)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: 'justify' }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Usuario:
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              ml: "5px",
                              color: "#555",
                            }}
                          >
                            {buy.buy.user.lastName}, {buy.buy.user.name}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            flexDirection: "column",
                            display: "flex",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Fecha compra:
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: "bold",
                                ml: "5px",
                                color: "#555",
                              }}
                            >
                              {dateString}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                    <Divider></Divider>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: "10px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: "20px",
                        }}
                      >
                        <Typography sx={{ fontWeight: "bold", display:{xs:'none', sm:'flex'} }}>
                          Estado:
                        </Typography>
                        <Typography
                          sx={{ fontWeight: "bold", ml: "5px", color: "#555" }}
                        >
                          {buy.buy.shipment.state.name}
                        </Typography>
                      </Box>
                      <Button
                        onClick={() => {
                          handleClickOpen();
                          setShipment(buy.buy.shipment);
                        }}
                        size="small"
                      >
                        Cambiar estado
                      </Button>
                    </Box>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography sx={{ color: "#555" }}>
                          Ver detalles
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <CardBuy buy={buy} />
                      </AccordionDetails>
                    </Accordion>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'40vh'}}>
              <Typography fontWeight='bold' sx={{color:'#fff'}}>No se encontraron ventas con los filtros que aplicaste 🫣</Typography>
            </Box>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Sales;
