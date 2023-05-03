import { useContext, useState, useEffect } from "react";
import { Box, CardMedia, CircularProgress, Typography, IconButton, Grid, Button, TextField, Paper } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { paperStyles,contentInfoProductStyles, cardMediaStyles, loadingStyles, contentProductStyles, titleTypographyStyles, contentPriceAndStockStyles, buttonCartStyles, inputQuantity } from './styles'
import { useLazyQuery, useMutation } from "@apollo/client";
import AuthContext from "../../context/AuthContext";
import Comment from "../comment/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Swal from "sweetalert2";
import GET_PRODUCT from "../../service/graphql/querys/getProduct";
import GET_FAVORITE from "../../service/graphql/querys/getFavorite";
import CREATE_PRODUCT_FAVORITE from "../../service/graphql/mutations/createProductFavorite";
import GET_PRODUCT_FAVORITE from "../../service/graphql/querys/getProductFavorite";
import DELETE_PRODUCT_FAVORITE from "../../service/graphql/mutations/deleteProductFavorite";
import CREATE_PRODUCT_CART from "../../service/graphql/mutations/createProductCart";


const Product = ({ id }) => {

  //Obtenemos el usuario desde el contexto
  const { user, userData } = useContext(AuthContext);

  //Utilizamos este estado para guardar el producto actual
  const [product, setProduct] = useState();

  //Utilizamos este estado para guardar el favorito que pertenece al usuario
  const [favoriteUser, setFavoriteUser] = useState();

  //Utilizamos este estado para saber si ese producto es un favorito
  const [productFavorite, setProductFavorite] = useState();

  //Utilizamos este estado para guardar la cantidad de productos a comprar o a agregar al carrito
  const [quantity, setQuantity] = useState(1);

  //State para manejar la carga de productos.
  const [loading, setLoading] = useState(true);

  //State para manejar la carga al agregar el producto a favoritos.
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  //Query para obtener un producto.
  const [products] = useLazyQuery(GET_PRODUCT);
  //Query para obtener un favorito
  const [favorite] = useLazyQuery(GET_FAVORITE);
  //Query para obtener los productos que tiene un unsuario en favoritos.
  const [productFavoriteData, { fetchMore: fetchMoreGetProductFavoriteData }] = useLazyQuery(GET_PRODUCT_FAVORITE);
  //Mutation para agregar un productos a favoritos.
  const [createProductFavorite] = useMutation(CREATE_PRODUCT_FAVORITE);
  //Mutation para eliminar un producto de favoritos.
  const [deleteProductFavorite] = useMutation(DELETE_PRODUCT_FAVORITE);
  //Mutation para agregar un producto al carrito.
  const [createProductCart] = useMutation(CREATE_PRODUCT_CART);

  //Funcion para incrementar la cantidad de productos a agregar al carrito.
  const handleIncrement = () => {
    setQuantity(prevValue => prevValue < product.stock ? prevValue + 1 : prevValue);
  };

  //Funcion para decrementar la cantidad de productos a agregar al carrito.
  const handleDecrement = () => {
    setQuantity(prevValue => prevValue > 1 ? prevValue - 1 : 1);
  };

  //Esta funcion setea el producto actual en el estado
  const getProduct = async () => {
    try {
      const { data } = await products({ variables: { getProductId: id } });
      setProduct(data.getProduct);
    } catch (error) {}
  };

  //Esta funcion setea en el estado favoriteUser la data de favorite (id de favorito)
  const getFavorite = async () => {
    try {
      const { data } = await favorite({ variables: { userId: user.uid } });
      setFavoriteUser(data.getFavorite);
    } catch (error) {}
  };

  //Esta setea en el estado productFavorite un producto que esta en los favoritos de un usuario.
  const getProductFavorite = async () => {
    try {
      const { data } = await productFavoriteData({
        variables: {
          favoriteId: favoriteUser.id,
          productId: product.id,
        },
      });
      setProductFavorite(data.getProductFavorite);
    } catch (error) {
    }
  };

  //Cada vez que se agrega o elimina un favorito se hace una nueva consulta para refrescar los datos
  const fetchMoreFetProductFavorite = async () => {
    try {
      const { data } = await fetchMoreGetProductFavoriteData({
        variables: {
          favoriteId: favoriteUser.id,
          productId: product.id,
        },
      });
      setProductFavorite(data.getProductFavorite);
    } catch (error) {
    }
  };

  //Agregar un producto en favoritos y realizamos la nueva consulta con fetchMoreFetProductFavorite
  const addProductToFavorite = async () => {
    try {
      setLoadingFavorites(true);
      await createProductFavorite({
        variables: {
          favoriteId: favoriteUser.id,
          productId: product.id,
        },
      });

      await fetchMoreFetProductFavorite();
    } catch (error) {
    } finally {
      setLoadingFavorites(false);
    }
  };

  //Eliminar un producto de favoritos
  const removeProductToFavorite = async () => {
    setLoadingFavorites(true);
    try {
      await deleteProductFavorite({
        variables: {
          productId: product.id,
          favoriteId: favoriteUser.id,
        },
      });

      await fetchMoreFetProductFavorite();
    } catch (error) {
    } finally {
      setLoadingFavorites(false);
    }
  };

  //Funcion para agregar un producto al carrito
  const addProductToCart = async () => {
    try {
      const total = parseFloat(product.price * quantity)
      const { data } = await createProductCart({
        variables: {
          quantity: parseInt(quantity),
          total: total,
          productId: product.id, 
          userId: user.uid
        },
      });
      if (data.createProductCart === 'Producto agregado al carrito con exito'){
      Swal.fire({
        text: data.createProductCart,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
      })
      } else {
        Swal.fire({
          text: data.createProductCart,
          icon: 'error',
          confirmButtonColor: 'red',
          confirmButtonText: 'Ok'
        })
      }
    } catch (error) {
    }
  }

  // Hasta que no se tenga el id del producto y del favorito del usuario, estará cargando
  useEffect(() => {
    Promise.all([getProduct(), getFavorite()]).finally(() => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Cada vez que se actualice el id del product o del favoriteUser se consultara si ese producto esta en favoritos
  useEffect(() => {
    if (product && favoriteUser) {
      getProductFavorite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, favoriteUser]);

  return (
    <>
      {loading ? (
        <div
          style={loadingStyles}
        >
          <CircularProgress size={100} sx={{ color: "#FF914D" }} />
        </div>
      ) : product ? (
        <Grid container>
          <Grid item xs={12} sm={12} md={7}>
            <CardMedia
              component="img"
              sx={cardMediaStyles}
              image={ product.image_url }
              alt="Product"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={5}>
            <Box sx={contentProductStyles}>
              <Box sx={contentInfoProductStyles}>
                <Typography variant="h4" sx={titleTypographyStyles}> {product.title} </Typography>
                {loadingFavorites ? (
                  <>
                    <CircularProgress size={25} sx={{ color: "#FF914D", padding: "8px" }}/>
                  </>
                ) : (
                  <> { user && userData && !userData.isAdmin ?
                    <IconButton
                      onClick={() => {
                        if (productFavorite) {
                          removeProductToFavorite();
                        } else {
                          addProductToFavorite();
                        }
                      }}
                      sx={{ alignSelf: "flex-start" }}
                    >
                      <FavoriteIcon sx={{ fontSize: 30, color: productFavorite ? "red" : "#555" }} />
                    </IconButton> : (<></>)}
                  </>
                )}
              </Box>
              <Box sx={contentPriceAndStockStyles}>
                <Box sx={{mb: 5}}>
                  <Typography variant="h4" sx={{marginBottom:4, color: '#fff'}}>{Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(product.price)}</Typography>
                  <Typography variant="h5" sx={{color: '#fff'}}>Stock: {product.stock}</Typography>
                </Box>
                <Paper sx={paperStyles}>   
                  <Box sx={{display: 'flex', justifyContent:'center'}}>
                    <IconButton disabled={userData.isAdmin ? true : false} onClick={handleDecrement }>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                  <TextField
                    value={quantity}
                    sx={inputQuantity}
                   InputProps={{
                    readOnly: true,
                  }}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <Box sx={{display: 'flex', justifyContent:'center'}}>
                    <IconButton disabled={userData.isAdmin ? true : false} onClick={handleIncrement} >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Paper>
                <Button disabled={user && userData && userData.isAdmin ? true : false}  variant="contained" sx={buttonCartStyles} onClick={() => { addProductToCart() }}
                >
                  Añadir al carrito
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{mt: 5, wordWrap: "break-word"}}>
              <Typography sx={{ color: "#fff", fontWeight: "bold"}}>
                Descripción
              </Typography>
              <Typography sx={{ color: "#999" }}>
                {product.description}
              </Typography>
            </Box>
            <Comment productId={product.id} userData={userData} user={user}/>      
          </Grid>
        </Grid>
      ) : (
        <>Ese producto no se encuentra disponible</>
      )}
    </>
  );
};

export default Product;
