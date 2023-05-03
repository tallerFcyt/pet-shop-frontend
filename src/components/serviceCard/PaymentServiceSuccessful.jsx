import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Stack, Typography } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";import { useAuthContext } from "../../context/AuthContext";
import { useMutation } from "@apollo/client";
import CREATE_SERVICE_PET from "../../service/graphql/mutations/createServicePet";
import { PetIconStyles } from "../nav/styles";
import { useNavigate } from "react-router-dom";

const PaymentServiceSuccessful = ({ open, handleClose, payment_id }) => {

  const { user } = useAuthContext()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [ServicePet] = useMutation(CREATE_SERVICE_PET);

  const sendNotification = async () => {
    try {
      const data = {
        payment_id: payment_id,
        email: user.email,
      }
      
      await fetch("http://localhost:4000/payment/notification",{
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
      }
    catch (error) {
    }
  }

  const createServicePet = async (paymnet_id, totalAmount, items) => {
    await ServicePet({
      variables: {
        createServicePetId: payment_id,
        price: parseFloat(totalAmount),
        petId: parseInt(items[0].category_id),
        serviceId: parseInt(items[0].id)
      }
    })
  }

  const getItems = async () => {
    try {
      const data = {
        payment_id: payment_id,
      }
      const result = await fetch("http://localhost:4000/payment/items",{
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
      const resolve = await result.json()
      const totalAmount = resolve[0]
      const items = resolve[1]
      createServicePet(payment_id, totalAmount, items)

    } catch (error) {
    }
  }

  useEffect(() => {
    Promise.all([sendNotification(), getItems()]).finally(() => {
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog disableEscapeKeyDown open={open} sx={{display: 'flex', justifyContent:' center', alignItems:'center'}}>
      {loading ? 
        (<>
          <DialogTitle sx={{fontWeight: 'bold'}}>Estamos procesando la compra del servicio</DialogTitle>
          <DialogContent sx={{display: 'flex', justifyContent:' center', alignItems:'center', flexDirection:'column', color:'grey.500'}}>
            <Typography>Por favor aguarde un momento...</Typography>
            <PetsIcon sx={ PetIconStyles } />
            <Stack sx={{ width: '100%', color: 'grey.500', mt:'20px' }}>
              <LinearProgress color="primary" />
            </Stack>
          </DialogContent>
          </>):(
          <>
            <DialogContent sx={{display: 'flex', justifyContent:' center', alignItems:'center', flexDirection:'column'}}>
              <DialogTitle sx={{fontWeight: 'bold'}}>¡Muchas gracias por adquirir nuestro servicio!</DialogTitle>
              <PetsIcon sx={ PetIconStyles } />
            </DialogContent>
            <DialogActions>
              <Button 
              onClick={async () => {
                handleClose();
                navigate('/services')
                window.location.reload()
              }}>
                Cerrar
              </Button>
            </DialogActions>
          </>
)}

    </Dialog>
  );
}

export default PaymentServiceSuccessful;