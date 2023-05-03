import { useMutation } from "@apollo/client";
import { Card, Typography, Button, CardMedia, Grid } from "@mui/material";
import { Box } from "@mui/system";
import DELETE_PRODUCT_CART from "../../service/graphql/mutations/deleteProductCart";
import { TypographyCartStyle, btnEliminarStyles, contentImageStyles, contentInfoStyles, footerCartCard } from "./styles";
import { useNavigate } from "react-router-dom";

const CartCard = ({ quantity, total ,productCart, product_id, user_id, fetchMoreFetAllProductCartData }) => {

  const navigate = useNavigate()

  const [deleteProductCart] = useMutation(DELETE_PRODUCT_CART);

  //Eliminar un producto del carrito
  const removeProductToCart = async () => {
    try {
      await deleteProductCart({
        variables: {
          userId: user_id,
          productId: product_id
        },
      });

      await fetchMoreFetAllProductCartData();
    } catch (error) {
    }
  };

  return (
    <Card sx={{ display: "flex" }}>
      <Grid container>
        <Grid 
          item xs={12} sm={4} md={3}
          onClick={() => navigate(`/product/${product_id}`)} sx={{cursor: 'pointer' }}
        >
          <CardMedia
            component="img"
            sx={contentImageStyles}
            image={productCart.image_url}
            alt=""
          />
        </Grid>
        <Grid item xs={12} sm={7} md={9}>
          <Box sx={contentInfoStyles}>
            <Typography component="div" variant="h5" sx={TypographyCartStyle}>
              {productCart.title}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={TypographyCartStyle}
            >
              {productCart.description}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={TypographyCartStyle}
            >
              Unidades: {quantity}
            </Typography>
            <Box sx={footerCartCard}>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                ${total}
              </Typography>
              <Button variant="contained" sx={btnEliminarStyles} onClick={() => { removeProductToCart(); }} >
                Eliminar
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CartCard;
