import { Card } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from "react";
import FormProduct from "./FormProduct";
import { cardAddProduct } from "./styles";

const AddProduct = ({refetch, setProducts, setUpdate, update}) => {

  //State para abrir o cerrar el modal de añadir producto.
  const [open, setOpen] = useState(false);

  //Funcion para abrir el modal de añadir producto.
  const handleClickOpen = () => {
    setOpen(true);
  };

  //Funcion para cerrar el modal de añadir producto.
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Card
        onClick={() => {setUpdate(false); handleClickOpen()}}
        sx={cardAddProduct}
        >
       <AddCircleIcon sx={{fontSize:100, color:'#fff'}}/>
      </Card>
      <FormProduct
        open={open}
        handleClose={handleClose}
        refetch={refetch}
        setProducts={setProducts}
        update={update}/>
    </>
   );
} 
 
export default AddProduct;