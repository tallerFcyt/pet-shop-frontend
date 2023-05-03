import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Switch,
  Grid
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import DELETE_PRODUCT from "../../service/graphql/mutations/deleteProduct";
import { useState } from "react";
import FormProduct from "./FormProduct";

const ProductCardAdmin = ({ product_id, title, price, stock, description, image_url, active, setUpdate, update, refetch, setProducts }) => {
  const navigate = useNavigate()

  const product = {
    product_id,
    title,
    price,
    description,
    stock,
    image_url,
    active
  }

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [checked, setChecked] = useState(active);
  
  const [deleteProd] = useMutation(DELETE_PRODUCT)

  const deleteProduct = async() => {
    try {
      await deleteProd({variables: {deleteProductId: product_id, active: !checked} })
    } catch (error) {
      
    }
  }

  const handleChange = (event) => {
    setChecked(product.stock > 0 ? event.target.checked : !event.target.checked);
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} key={product_id}>
      <Card
        sx={{
          backgroundColor:'#bdb9b0',
          transition: "transform .2s",
          height:'490px',
          display:'flex', 
          flexDirection:'column',
          justifyContent:'space-between',
          ":hover": {
            boxShadow: 20, // theme.shadows[20]
            transform: "scale(1.02)",
          },
        }}
      >
        <CardActionArea onClick={() => navigate(`/product/${product_id}`)}>
          <CardMedia
            component="img"
            alt={{ title }}
            height="250"
            image={image_url}
            title={{ title }}
          />
          <CardContent sx={{ bgcolor: "#bdb9b0" }}>
            <Typography gutterBottom variant="h6" sx={{ textDecoration: !checked ? 'line-through' : 'none' ,fontWeight: "bold" }
}>
              {title}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p" sx={{ textDecoration: !checked ? 'line-through' : 'none'}}>
            {Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(price)}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p" sx={{ textDecoration: !checked ? 'line-through' : 'none'}}>
              Stock: {stock}
            </Typography>
          </CardContent>
        </CardActionArea>
          <CardActions sx={{alignItems:'center', justifyContent:'space-around', backgroundColor:'rgba(0,0,0,0.02)', textDecoration: !checked ? 'line-through' : 'none'}}>
            <IconButton onClick={() => {handleClickOpen();setUpdate(true)}} >
              <EditIcon color='primary'/>
            </IconButton>
            <IconButton onClick={deleteProduct}>
              <Switch
                checked={checked}
                onChange={handleChange}
                color='primary'
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </IconButton>
          </CardActions>
          <FormProduct 
            open={open}
            handleClose={handleClose} 
            product={product}
            update={update}
            refetch={refetch}
            setProducts={setProducts}
          />
      </Card>
    </Grid>
  );
};

export default ProductCardAdmin;
