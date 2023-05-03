import { useLazyQuery, useMutation} from "@apollo/client";
import { Button, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState, useEffect } from "react";
import FavoriteCard from "../components/favorite/FavoriteCard";
import AuthContext from "../context/AuthContext";
import DELETE_ALL_PRODUCT_FAVORITE from "../service/graphql/mutations/deleteAllProductFavorite";
import GET_ALL_PRODUCT_FAVORITE from "../service/graphql/querys/getAllProductFavorite";
import GET_FAVORITE from "../service/graphql/querys/getFavorite";


const Favorite = () => {
  
  const { user } = useContext(AuthContext);

  //Utilizamos este estado para guardar el favorito que pertenece al usuario
  const [favoriteUser, setFavoriteUser] = useState();
  
  const [allProductFavorite, setAllProductFavorite] = useState([]);

  const [loading, setLoading] = useState(true);

  const [favorite] = useLazyQuery(GET_FAVORITE);

  const [allProductFavoriteData, {fetchMore: fetchMoreGetAllProductFavoriteData}] = useLazyQuery(GET_ALL_PRODUCT_FAVORITE);

  const [deleteAllProductFavorite] = useMutation(DELETE_ALL_PRODUCT_FAVORITE)

  //Esta funcion setea en el estado favoriteUser la data de favorite (id de favorito)
  const getFavorite = async ()=>{ 
    try {
      const {data} = await favorite({variables: { userId: user.uid }});
      setFavoriteUser(data.getFavorite);
    } catch (error) {
      
    }
  }

  //Traemos los datos y cada vez que se agrega o elimina un favorito se hace una nueva consulta para refrescar los datos
  const getAllProductFavorite = async ()=>{
    try {
      const {data} = await allProductFavoriteData({ variables: {
        favoriteId: favoriteUser.id
      }});
      if (data){
        setAllProductFavorite(data.getAllProductFavorite);
      }
    } catch (error) {
    }
  }

  const fetchMoreFetAllProductFavoriteData = async ()=>{
    try {
      const {data} = await fetchMoreGetAllProductFavoriteData({ variables: {
        favoriteId: favoriteUser.id
      }});
      if (data){
        setAllProductFavorite(data.getAllProductFavorite);
      }
      else if (!data){ 
        setAllProductFavorite(undefined);
      }
    } catch (error) {
    }
  }

  //Cada vez que se actualice el id del product o del favoriteUser se consultara si ese producto esta en favoritos
  useEffect(() => {
    if(favoriteUser){
      Promise.all([getAllProductFavorite(), fetchMoreFetAllProductFavoriteData()]).finally(()=>{
        setLoading(false); 
      });
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteUser]);

    //Eliminar todos los productos del favorito
    const removeAllProductToFavorite = async () => {
      try {
        if (favoriteUser){
          await deleteAllProductFavorite({
            variables: {
              favoriteId: favoriteUser.id,
            },
          });
        }
  
        await fetchMoreFetAllProductFavoriteData();
      } catch (error) {
      }
    };

  useEffect(() => {
    getFavorite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            ) : allProductFavorite.length !== 0 ? (
                allProductFavorite.map((product) => {
                return (
                  <Grid
                    item xs={12}
                    key={product.product_id} 
                  >
                    <FavoriteCard
                      product_id={product.product_id}
                      favorite_id={favoriteUser.id}
                      fetchMoreFetAllProductFavoriteData={fetchMoreFetAllProductFavoriteData}
                    />
                  </Grid>
                );
              })
            ): (
              <Box sx={{width:'100%', display:'flex', alignItems: 'center', justifyContent:'center'}}>
                <Typography sx={{mt: 40 ,color: '#fff', fontWeight: 'bold'}}>No tiene productos en sus favoritos 🫣</Typography>
              </Box>
            )}
            {(allProductFavorite.length !== 0) ? (
            <Grid align='center' item md={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#f57627",
                  ":hover": {
                    backgroundColor: "#FF914D",
                  },
                  mt:'40px',
                  width: "100%"
                }}
                onClick={() => {
                  removeAllProductToFavorite();
                }}
              >
                Eliminar todo
              </Button>
            </Grid>
            ) : (
              <></>
            )}
          </Grid>
      </Box>
    </Container>
  );
}
 
export default Favorite;