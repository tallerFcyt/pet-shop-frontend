import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const RenderDrawer = ({ user }) => {

  //State para manejar el menu responsive
  const [openDrawer,  setOpenDrawer] = useState(false)

  //Obtenemos la data del user mediante el contexto
  const { userData } = useAuthContext();

  //Usamos el useNavigate para redireccionar al usuario cuando hace click en algun tab.
  const navigate = useNavigate()
  
  return ( 
    <>
      <Drawer open={openDrawer}
      onClose={()=> setOpenDrawer(false)}
      >
        <List>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon>
              <HomeIcon/>
              <ListItemText>
                Productos
              </ListItemText>
            </ListItemIcon>

          </ListItemButton>
          { user && userData && !userData.isAdmin ?
          (<ListItemButton onClick={() => navigate("/buys")}>
            <ListItemIcon>
              <LocalMallIcon/>
              <ListItemText>Mis compras</ListItemText>
            </ListItemIcon>
          </ListItemButton>
          ) : (<></>) 
          }
          {user && userData && !userData.isAdmin ? 
          (<ListItemButton onClick={() => navigate("/favorites")}>
            <ListItemIcon>
            <FavoriteIcon/>
              <ListItemText>Favoritos</ListItemText>
            </ListItemIcon>
          </ListItemButton>)
          : (<></>)}
          {
          user && userData && !userData.isAdmin ? 
          (<ListItemButton onClick={() => navigate("/cart")}>
            <ListItemIcon>
              <ShoppingCartIcon/>
              <ListItemText>Carrito</ListItemText>
            </ListItemIcon>
          </ListItemButton>
          ):(<></>)
          }
          <ListItemButton onClick={() => navigate("/services")}>
            <ListItemIcon>
              <MedicalServicesIcon/>
              <ListItemText>Servicios</ListItemText>
            </ListItemIcon>
          </ListItemButton>
          {
            user && userData && userData.isAdmin ? 
            (<ListItemButton onClick={() => navigate("/sales")}>
              <ListItemIcon>
                <ShoppingBagIcon/>
                <ListItemText>Ventas</ListItemText>
              </ListItemIcon>
            </ListItemButton>
            ):(<></>)
            }
        </List>
      </Drawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon sx={{color:'#fff', display: { xs: "flex", md: "none" }, fontSize:35}}/>
      </IconButton>
    </>
   );
}
 
export default RenderDrawer;