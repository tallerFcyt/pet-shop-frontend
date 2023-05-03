import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Stack, Typography } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import { useAuthContext } from "../../context/AuthContext";
import { useMutation } from "@apollo/client";
import DELETE_ALL_PRODUCT_CART from "../../service/graphql/mutations/deleteAllProductCart";
import CREATE_BUY from "../../service/graphql/mutations/createBuy"
import CREATE_PRODUCT_BUY from "../../service/graphql/mutations/createProductBuy";
import CREATE_SHIPMENT from "../../service/graphql/mutations/createShipment";
import { PetIconStyles } from "../nav/styles";
import { useNavigate } from "react-router-dom";

const PaymentSuccessful = ( { open, handleClose, refetch, setBuys , payment_id, userId } ) => {

  const navigate = useNavigate()

  const { user } = useAuthContext()

  const [deleteAllProductCart] = useMutation(DELETE_ALL_PRODUCT_CART);
  const [createBuy] = useMutation(CREATE_BUY);
  const [createShipment] = useMutation(CREATE_SHIPMENT);
  const [createProductBuy] = useMutation(CREATE_PRODUCT_BUY);
  const [loading, setLoading] = useState(true)

  const removeAllProductToCart = async () => {
      await deleteAllProductCart({
        variables: {
          userId: user.uid,
        },
      });
  };

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
      removeAllProductToCart()
      }
    catch (error) {
    }
  }

  const createBuyUser = async (totalAmount, items) => {
    await createBuy({ variables: {
      createBuyId: payment_id,
      totalPrice: totalAmount,
      userId: user.uid,
      addressId: 1
    }});
    
    await createShipment({ variables: {
      buyId: payment_id,
      stateId: 1,
    }});
  
    for (let i = 0; i < items.length; i++) {
      await createProductBuy({variables:{
        price: parseFloat(items[i].unit_price),
        quantity: parseInt(items[i].quantity),
        productId: parseInt(items[i].id),
        buyId: payment_id
      }})
    }
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
      // setDataBuy({
      //   payment_id: payment_id,
      //   items: items,
      //   totalAmount: totalAmount
      // })
      createBuyUser(totalAmount, items)

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
          <DialogTitle sx={{fontWeight: 'bold'}}>Estamos procesando tu compra</DialogTitle>
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
              <DialogTitle sx={{fontWeight: 'bold'}}>¡Muchas gracias por tu compra!</DialogTitle>
              <PetsIcon sx={ PetIconStyles } />
            </DialogContent>
            <DialogActions>
              <Button 
              onClick={async () => {
                const { data } = await refetch({
                  variables: { userId },
                });
                setBuys(data.getProductBuyByUser)
                handleClose();
                navigate('/buys')
              }}>
                Cerrar
              </Button>
            </DialogActions>
          </>
)}

    </Dialog>
  );
}

export default PaymentSuccessful;