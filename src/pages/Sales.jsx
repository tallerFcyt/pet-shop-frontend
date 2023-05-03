import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useAuthContext } from "../context/AuthContext";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import CardBuy from "../components/buyCard/CardBuy";
import GET_PRODUCT_BUY from "../service/graphql/querys/getAllProductBuy";
import DialogState from "../components/buyCard/DialogState";

const Sales = () => {
  const { user, userData } = useAuthContext();

  const [buys, setBuys] = useState([]);

  const [loading, setLoading] = useState(true);

  const [shipment, setShipment] = useState("")

  const [open, setOpen] = useState(false);

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
        <DialogState handleClose={handleClose} open={open} shipment={shipment} refetch={refetch} setBuys={setBuys}/>
        <Grid container spacing={3}>
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
          ) : buys ? (
            buys.map((buy) => {
              const date = new Date(buy.buy.createdAt);
              const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
              };
              const dateString = date.toLocaleDateString("es-ES", options);
              return (
                <Grid item sx={{ width: "100%" }}>
                  <Card sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px",
                      }}
                    >
                      <Typography sx={{ color: "#555" }}>
                        {dateString}
                      </Typography>
                              {user && userData && userData.isAdmin ? (
                        <Typography sx={{ color: "#555" }}>
                          {buy.buy.user.lastName}, {buy.buy.user.name}
                        </Typography>
                      ) : (
                        <></>
                      )}
                    </Box>
                    <Divider></Divider>
                    <CardBuy buy={buy} />
                    <Box
                      sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems:'center' }}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Precio total:
                        </Typography>
                        <Typography
                          sx={{ fontWeight: "bold", ml: "5px", color: "#555" }}
                        >
                          {Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          }).format(buy.buy.totalPrice)}
                        </Typography>
                      </Box>
                      {user && userData && userData.isAdmin ? (
                        <Box sx={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                          <Typography sx={{mr:'5px', fontWeight:'bold'}}>{buy.buy.shipment.state.name}</Typography>
                          <Button
                            onClick={ () => {handleClickOpen(); setShipment(buy.buy.shipment)}}
                            size='small'>Cambiar estado</Button>
                        </Box>
                      ) : (
                        <Typography
                          sx={{
                            color:
                              buy.buy.shipment.state.id === 1
                                ? "green"
                                : "green",
                            fontWeight: "bold",
                          }}
                        >
                          {buy.buy.shipment.state.name}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <CircularProgress size={100} sx={{ color: "#FF914D" }} />
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Sales;
