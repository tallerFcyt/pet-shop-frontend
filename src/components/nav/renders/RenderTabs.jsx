import { Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";

const RenderTabs = ( { value, handleValue, user } ) => {

  //Usamos useNavigate para redireccionar al usuario cuando haga click en algun tab.
  const navigate = useNavigate();
  
  //Obtenemos la data del user desde el contexto.
  const { userData } = useAuthContext()

  const path = window.location.pathname === '/register';

  return (
    user && userData && userData.isAdmin ? (
      <Tabs 
        sx={{display: { xs: "none", md: "flex" } }} 
        textColor="inherit"
        TabIndicatorProps={{ style: { backgroundColor: "#FF914D"}}}
        onChange={(e, value) => { handleValue(value); }}
        value={value} 
      >
        <Tab disabled={ path ? true : false } sx={{"&.Mui-disabled":{color:'#999'}}} label="Productos" onClick={() => navigate("/")} />
        <Tab disabled={ path ? true : false } sx={{"&.Mui-disabled":{color:'#999'}}} label="Servicios" onClick={() => navigate("/services")} />
        <Tab disabled={ path ? true : false } sx={{"&.Mui-disabled":{color:'#999'}}} label="Ventas" onClick={() => navigate("/sales")} />
    </Tabs>
    ):(
      <Tabs
      sx={{display: { xs: "none", md: "flex" } }} 
      textColor="inherit"
      TabIndicatorProps={{ style: { backgroundColor: "#FF914D"}}}
      onChange={(e, value) => { handleValue(value); }}
      value={value} 
    >
      <Tab disabled={ path ? true : false } sx={{"&.Mui-disabled":{color:'#999'}}} label="Productos" onClick={() => navigate("/")} />
      <Tab disabled={ path ? true : false } sx={{"&.Mui-disabled":{color:'#999'}}} label="Mis compras" onClick={() => navigate("/buys")}/>
      <Tab disabled={ path ? true : false } sx={{"&.Mui-disabled":{color:'#999'}}} label="Favoritos" onClick={() => navigate("/favorites")} />
      <Tab disabled={ path ? true : false } sx={{"&.Mui-disabled":{color:'#999'}}} label="Carrito" onClick={() => navigate("/cart")} />
      <Tab disabled={ path ? true : false } sx={{"&.Mui-disabled":{color:'#999'}}} label="Servicios" onClick={() => navigate("/services")} />
    </Tabs>
      )
  );
};

export default RenderTabs;
