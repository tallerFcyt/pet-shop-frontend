import {
  Box,
  Card,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useAuthContext } from "../context/AuthContext";
import { useLazyQuery } from "@apollo/client";
import GET_PRODUCT_BUY_BY_USER from "../service/graphql/querys/getProductBuyByUser";
import { useEffect, useState } from "react";
import CardBuy from "../components/buyCard/CardBuy";
import PaymentSuccessful from "../components/buyCard/PaymentSuccessful";

const Buys = () => {
  const { user } = useAuthContext();

  const [paymentId, setPaymentId] = useState('');

  const [buys, setBuys] = useState([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [ProductBuyByUser, { refetch }] = useLazyQuery(GET_PRODUCT_BUY_BY_USER);

  function getParameterByName(name) {
    // eslint-disable-next-line
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(window.location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  const getProductBuyByUser = async () => {
    const { data } = await ProductBuyByUser({
      variables: { userId: user.uid },
    });
    if (data) {
      setBuys(data.getProductBuyByUser);
    }
  };

  useEffect(() => {
    getProductBuyByUser().finally(() => {
      setLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setPaymentId(getParameterByName("payment_id"));
    if (paymentId) {
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  return (
    <Container maxWidth="lg" sx={{ mt: "4rem", mb: "4rem" }}>
      {paymentId ? (
        <>
        <PaymentSuccessful
          open={open}
          handleClose={handleClose}
          refetch={refetch}
          setBuys={setBuys}
          payment_id={paymentId}
          userId={user.uid}
          />
        </>
      ) : (
        <></>
      )}
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
          Mis compras
        </Typography>
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
                  <Card sx={{ width: "100%", backgroundColor: "#eaeaea" }}>
                    <Typography sx={{ color: "#555", padding: "10px" }}>
                      {dateString}
                    </Typography>
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
                      <Box sx={{ display: "flex" }}>
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
                      <Typography
                        sx={{
                          color:
                            buy.buy.shipment.state.id === 1 ? "green" : "green",
                          fontWeight: "bold",
                        }}
                      >
                        {buy.buy.shipment.state.name}
                      </Typography>
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

export default Buys;
