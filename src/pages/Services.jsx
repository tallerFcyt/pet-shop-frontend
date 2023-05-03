import { useLazyQuery } from "@apollo/client";
import { Button, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import FormService from "../components/serviceCard/FormService";
import ServiceCard from "../components/serviceCard/ServiceCard";
import { useAuthContext } from "../context/AuthContext";
import GET_ALL_SERVICE from "../service/graphql/querys/getAllService";
import PaymentServiceSuccessful from "../components/serviceCard/PaymentServiceSuccessful";

const Services = () => {

  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState()
  const [paymentId, setPaymentId] = useState('');


  const [allService, {refetch}] = useLazyQuery(GET_ALL_SERVICE);

  const [ update, setUpdate ] = useState(false) 

  const [open, setOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClosePayment = () => {
    setOpenPayment(false);
  };

  const { userData } = useAuthContext();

  function getParameterByName(name) {
    // eslint-disable-next-line
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(window.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  
  const getAllService = async () => {
    try {
      const { data } = await allService();
      if (data) {
        setServices(data.getAllService);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getAllService().finally(() => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPaymentId(getParameterByName("payment_id"));
    if (paymentId) {
      setOpenPayment(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  return (
    <Container maxWidth="lg" sx={{ mt: "4rem", mb: "4rem" }}>
            {paymentId ? (
        <>
        <PaymentServiceSuccessful
          open={openPayment}
          handleClose={handleClosePayment}
          payment_id={paymentId}
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
          Servicios
        </Typography>
        {window.localStorage.getItem("user") &&
          userData &&
          userData.isAdmin ? (
            <div style={{display:'flex', width:'100%', justifyContent:'center', alignItems:'center'}}>
              <Button 
                variant='contained' 
                onClick={() => {
                  setUpdate(false);
                  handleClickOpen();
                }}
                sx ={{
                width: '100%',
                marginBottom:'20px',
                backgroundColor: "#2F3644",
                ":hover": {
                  backgroundColor: "#2F3640"
                },
              }}>Añadir servicio</Button>
            </div>
          ) : (
            <>
            </>
          )}
        <Grid container spacing={3}>
            {loading || !services ? (
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
            ) : (
              services.map((service) => {
                var s = {
                  service_id:service.id,
                  title: service.title,
                  price:service.price,
                  active: service.active,
                  description: service.description,
                  image_url:service.image_url
                }
                return (
                  userData.isAdmin || (service.active && !userData.isAdmin) ? (
                  <Grid
                    item xs={12}
                    key={service.id} 
                  >
                    <ServiceCard
                      service = {s}
                      setUpdate={setUpdate}
                      update={update}
                      refetch={refetch}
                      setServices={setServices}
                    />
                    <FormService 
                      open={open}
                      handleClose={handleClose} 
                      update={update}
                      refetch={refetch}
                      service={s}
                      setServices={setServices}
                    />
                  </Grid>) 
                  : (<></>)
                );
              })
            )}
          </Grid>
      </Box>
      {/* <FormService 
        open={open}
        handleClose={handleClose} 
        update={update}
        refetch={refetch}
        // service={s}
        setServices={setServices}
                    /> */}
    </Container>
  );
};

export default Services;
