import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Product = ({ product_id, title, price, stock, image_url }) => {
  const navigate = useNavigate()
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} key={product_id}>
      <Card
        onClick={() => navigate(`/product/${product_id}`)}
        sx={{
          backgroundColor:'#bdb9b0',
          height: '450px',
          display:'flex',
          flexDirection: 'column',
          transition: "transform .2s",
          ":hover": {
            boxShadow: 20, // theme.shadows[20]
            transform: "scale(1.02)",
          },
        }}
      >
        <CardActionArea sx={{heigth: '100%'}}>
          <CardMedia
            component="img"
            alt={{ title }}
            height="250"
            image={ image_url }
            title={{ title }}
          />
          <CardContent sx={{ backgroundColor:'#bdb9b0', height: '100%' }}>
            <Typography gutterBottom variant="h6" sx={{ fontWeight: "bold", }}>
              {title.slice(0, 15)}..
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p">
            {Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(price)}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p">
              Stock: {stock}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default Product;
