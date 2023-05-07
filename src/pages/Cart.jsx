import { useLazyQuery, useMutation} from "@apollo/client";
import { Button, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState, useEffect } from "react";
import CartCard from "../components/cart/CartCard";
import AuthContext from "../context/AuthContext";
import DELETE_ALL_PRODUCT_CART from "../service/graphql/mutations/deleteAllProductCart";
import GET_ALL_PRODUCT_CART from "../service/graphql/querys/getAllProductCart";
import { API_URL } from "../utils/config";


const Cart = () => {
  
  const { user } = useContext(AuthContext);

  const [allProductCart, setAllProductCart] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadingBuy, setLoadingBuy] = useState(false);

  const [allProductCartData, {fetchMore: fetchMoreGetAllProductCartData}] = useLazyQuery(GET_ALL_PRODUCT_CART);

  const [deleteAllProductCart] = useMutation(DELETE_ALL_PRODUCT_CART);

  var totalCart = 0;

  //Traemos los datos y cada vez que se agrega o elimina un favorito se hace una nueva consulta para refrescar los datos
  const getAllProductCart = async ()=>{
    try {
      const {data} = await allProductCartData({ variables: {
        userId: user.uid
      }});
      if (data){
        setAllProductCart(data.getProductCart);
      }
    } catch (error) {
    }
  }

  const fetchMoreFetAllProductCartData = async ()=>{
    try {
      const {data} = await fetchMoreGetAllProductCartData({ variables: {
        userId: user.uid
      }});
      if (data){
        setAllProductCart(data.getProductCart);
      }
    } catch (error) {
    }
  }

  //Eliminar un producto del carrito
  const removeAllProductToCart = async () => {
    try {
      await deleteAllProductCart({
        variables: {
          userId: user.uid,
        },
      });

      await fetchMoreFetAllProductCartData();
    } catch (error) {
    }
  };

  //Cada vez que se actualice el id del product o del favoriteUser se consultara si ese producto esta en favoritos
  useEffect(() => {
      Promise.all([getAllProductCart(), fetchMoreFetAllProductCartData()]).finally(()=>{
        setLoading(false); 
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Realizar la compra del carrito
  const Buy = async () => {
  try {
    const items = []
    allProductCart.forEach(product => {
      items.push({
        "id": product.product_id,
        "title": product.product.title,
        "quantity": parseInt(product.quantity),
        "picture_url": product.product.image_url,
        "currency_id": "ARS",
        "unit_price": product.product.price
      })
    });

    const data = {
      "user_id":user.uid,
      "name":user.displayName,
      "email":user.email,
      items,
    }
    

    const result = await fetch(`${API_URL}/payment`,{
      method: 'POST',
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
    
    const payment = await result.json();
    window.open(payment.init_point, "_self")
    setLoadingBuy(false)
  } catch (error) {
  
  }
    // window.open(resolve.url)
  }

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
          Carrito
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
            ) : allProductCart.length !== 0? (
                allProductCart.map((product) => {
                  totalCart += product.total
                return (
                  <Grid
                    item xs={12}
                    key={product.product_id} 
                  >
                    <CartCard
                      product_id={product.product_id}
                      quantity = {product.quantity}
                      total = {product.total}
                      productCart = {product.product}
                      user_id={user.uid}
                      fetchMoreFetAllProductCartData={fetchMoreFetAllProductCartData}
                    />
                  </Grid>
                );
              })
            ): (
              <Box sx={{width:'100%', display:'flex', alignItems: 'center', justifyContent:'center'}}>
                <Typography sx={{mt: 40 ,color: '#FFF', fontWeight: 'bold'}}>No tiene productos en su carrito 🫣</Typography>
              </Box>
            )}
            {allProductCart.length !== 0 ? (
            <>
              <Grid item md={12}>
                <Typography align='center' variant='h4' sx={{color:'#fff'}}>Total: ${totalCart}</Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{}}>
                <Button
                  type="submit"
                  variant="contained"
                  target="_blank"
                  sx={{
                    width:'100%',
                    backgroundColor: "#FF914D",
                    margin:'1.5%',
                    ":hover": {
                      backgroundColor: "#f57627"
                    },
                  }}
                  onClick={() => {
                    setLoadingBuy(true)
                    Buy();
                  }}
                >
                 {loadingBuy ?  <CircularProgress size={20} sx={{ color: "#fff" }}/> : 'Comprar'}
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{
                    width:'100%',
                    borderColor: "#FF914D",
                    margin:'1.5%',
                    color: '#fff',
                    ":hover": {
                      borderColor: "#f57627"
                    },
                  }}
                  onClick={() => {
                    removeAllProductToCart()
                  }}
                >
                  Vaciar
                </Button>
              </Grid>
            </>
            ) : (
              <></>
            )}
          </Grid>
      </Box>
    </Container>
  );
}
 
export default Cart;