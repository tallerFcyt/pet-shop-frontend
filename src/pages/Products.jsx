import { useLazyQuery } from "@apollo/client";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import ProductCard from "../components/product/ProductCard";
import SearchNav from "../components/search/Search";
import { useAuthContext } from "../context/AuthContext";
import AddProduct from "../components/product/AddProduct";
import { useEffect, useState } from "react";
import ProductCardAdmin from "../components/product/ProductCardAdmin";
import GET_ALL_PRODUCT from "../service/graphql/querys/getAllProduct";

const Products = () => {
  const [allProduct, { refetch }] = useLazyQuery(GET_ALL_PRODUCT);
  const [loading, setLoading] = useState(true);
  const { userData, getUser } = useAuthContext();

  const [products, setProducts] = useState();

  const [update, setUpdate] = useState(false);

  //Traemos los datos y cada vez que se agrega o elimina un favorito se hace una nueva consulta para refrescar los datos
  const getAllProduct = async () => {
    try {
      const { data } = await allProduct();
      if (data) {
        setProducts(data.getAllProduct);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getUser()
    getAllProduct().finally(() => {
      setLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: "4rem", mb: "4rem" }}>
      <div
        style={{
          backgroundColor: "#1D222B",
          minHeight: "100vh",
          padding: "3rem",
          borderRadius: 2,
          marginRight: 0,
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
          Productos
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "98%",
            mb: "2rem",
          }}
        >
          <SearchNav 
            setProducts={setProducts}
            refetch={refetch}
            getAllProduct={getAllProduct}
          />
        </Box>
        <Grid container spacing={3}>
          {window.localStorage.getItem("user") &&
          userData &&
          userData.isAdmin ? (
            <Grid item xs={12} sm={6} md={4} lg={3} sx={{ height: "100%" }}>
              <AddProduct
                refetch={refetch}
                setProducts={setProducts}
                setUpdate={setUpdate}
                update={update}
              />
            </Grid>
          ) : (
            <></>
          )}
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
          ) : products ? (
            products.map((product) => {
              return (
                  userData && userData.isAdmin ? (
                    <ProductCardAdmin
                      key={product.id}
                      product_id={product.id}
                      title={product.title}
                      description={product.description}
                      price={product.price}
                      stock={product.stock}
                      image_url={product.image_url}
                      active={product.active}
                      setUpdate={setUpdate}
                      update={update}
                      refetch={refetch}
                      setProducts={setProducts}
                    />
                  ) : (
                    product.active && product.stock > 0 ? (
                      <ProductCard
                        key={product.id}
                        product_id={product.id}
                        title={product.title}
                        price={product.price}
                        stock={product.stock}
                        image_url={product.image_url}
                      />
                    ): (<></>)
                  )
              );
            })
          ) : (
            <CircularProgress size={100} sx={{ color: "#FF914D" }} />
          )}
        </Grid>
      </div>
    </Container>
  );
};

export default Products;