import { Box, Container } from "@mui/system";
import { useParams } from "react-router-dom";
import Product from "../components/product/Product";


const ViewProduct = () => {
  const { id } = useParams()
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
        <Product id={id}/>
      </Box>
    </Container>
   );
}
 
export default ViewProduct;