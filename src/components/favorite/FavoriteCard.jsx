import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, Card, Typography, Button, CardMedia, Grid, CircularProgress } from "@mui/material";
import { loadingStyles } from "../comment/styles";
import { btnEliminarStyles, contentImageStyles, contentInfoStyles } from "./styles";
import DELETE_PRODUCT_FAVORITE from "../../service/graphql/mutations/deleteProductFavorite";
import GET_PRODUCT from "../../service/graphql/querys/getProduct";

const FavoriteCard = ({ product_id, favorite_id, fetchMoreFetAllProductFavoriteData }) => {

  //Usamos useNavigate para navegar a los detalles del producto clickeado.
  const navigate = useNavigate()

  //State para guardar el producto que se va a mostrar en la card.
  const [product, setProduct] = useState();

  //State para manejar la carga de los productos.
  const [loading, setLoading] = useState(true);

  //State para esperar cuando se borra un producto de favoritos.
  const [loadingFavorites, setLoadingFavorites] = useState();

  //Query para obtener la data del producto que se va a mostrar en la card.
  const [getProductData] = useLazyQuery(GET_PRODUCT);

  //Mutación para eliminar un producto de favoritos.
  const [deleteProductFavorite] = useMutation(DELETE_PRODUCT_FAVORITE);

  //Esta funcion setea el producto actual en el estado
  const getProduct = async () => {
    try {
      const { data } = await getProductData({
        variables: { getProductId: product_id },
      });
      setProduct(data.getProduct);
    } catch (error) {}
  };

  //Esta funcion elimina un producto de favoritos.
  const removeProductToFavorite = async () => {
    setLoadingFavorites(true);
    try {
      await deleteProductFavorite({
        variables: {
          productId: product_id,
          favoriteId: favorite_id,
        },
      });

      await fetchMoreFetAllProductFavoriteData();
    } catch (error) {
    } finally {
      setLoadingFavorites(false);
    }
  };

  //UseEffect para obtener el producto cada vez que se renderiza el componente.
  useEffect(() => {
    getProduct().finally(() => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card sx={{ display: "flex" }}>
      {loading ? (
        <div style={loadingStyles}>
          <CircularProgress size={30} sx={{ color: "#FF914D" }} />
        </div>
      ) : (
        <Grid container>
          <Grid item xs={12} sm={4} md={3} onClick={() => navigate(`/product/${product_id}`)} sx={{cursor: 'pointer' }}>
            <CardMedia
              component="img"
              sx={contentImageStyles}
              alt={ product.title }
              image={product.image_url}
            />
          </Grid>
          <Grid item xs={12} sm={7} md={9}>
            <Box sx={contentInfoStyles}>
              <Typography component="div" variant="h5" sx={{margin: '1.5% 1.5% 0 1.5%'}}>
                {product.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
                sx={{margin: '1.5% 1.5% 0 1.5%'}}
              >
                {product.description}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
                sx={{margin: '1.5% 1.5% 0 1.5%'}}
              >
                {product.price}
              </Typography>
              <Box>
                {loadingFavorites ? (
                  <div
                    style={loadingStyles}
                  >
                    <CircularProgress size={100} sx={{ color: "#FF914D" }} />
                  </div>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={btnEliminarStyles}
                    onClick={() => {
                      removeProductToFavorite();
                    }}
                  >
                    Eliminar
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </Card>
  );
};

export default FavoriteCard;
