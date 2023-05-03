import { Typography, CardMedia, Grid , Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CardMediaStyle } from "./styles";

const CardBuy = ({ buy }) => {

  const navigate = useNavigate()
  
  return (

    buy.products ? ( buy.products.map((b) => {
      return(
        <>
          <Grid container sx={{backgroundColor:'#fff'}}>
            <Grid item sx={{cursor: 'pointer'}} onClick={() => {navigate(`/product/${b.product_id}`)}}>
              <CardMedia
                  component="img"
                  sx={CardMediaStyle}
                  image={ b.product.image_url }
                  alt={ b.product.title }
                />
            </Grid>
            <Grid sx={{padding: '10px'}}>
              <Typography sx={{fontWeight: 'bold'}}>{b.product.title}</Typography>
              <Typography>Cantidad: {b.quantity}</Typography>
              <Typography>Precio unitario: {Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(b.price)}</Typography>
            </Grid>
          </Grid>
          <Divider></Divider>
        </>
      )
    })) : (<>loading..</>)
  )
}
 
export default CardBuy;