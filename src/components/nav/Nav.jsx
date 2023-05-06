import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useLocalStorage } from "../../service/hooks/useLocalStorage";
import { AppBar, styled, Toolbar, Typography, Container, useMediaQuery, useTheme } from "@mui/material";
import { AppBarStyles, ToolbarStyles, ContentLogoStyles, PetIconStyles, PetShopTypographyStyles } from "./styles";
import PetsIcon from "@mui/icons-material/Pets";
import RenderAvatar from "./renders/RenderAvatar"
import RenderTabs from "./renders/RenderTabs";
import RenderSignIn from "./renders/RenderSignIn";
import RenderDrawer from "./renders/RenderDrawer";

//Para hacer uso de los breakpoints
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const Nav = () => {
  //Usamos el theme.
  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.down('md'))
  
  //State para manejar el valor del select del navbar. (color que se pinta al seleccionar una opcion del nav)
  const [value, setValue] = useLocalStorage("value", 0);
  
  //Obtenemos el usuario desde el contexto
  const { user, userData } = useAuthContext();
  
  //Manejamos el valor del item seleccionado en el nav
  const handleValue = (val) => {
    setValue(val)
  }
  
  //UseEffect para setear el valor de la seleccion del nav segun el pathname. 
  useEffect(() => {
    if (!isMd){
      if (window.location.pathname === '/'){
          setValue(0);
      }
      else if (window.location.pathname === '/buys'){
        setValue(1);
      }
      else if (window.location.pathname === '/favorites'){
        setValue(2);
      }
      else if (window.location.pathname === '/cart'){
        setValue(3);
      }
      else if (window.location.pathname === '/sales'){
        setValue(2)
      }
      else if (userData && userData.isAdmin && window.location.pathname === '/services'){
        setValue(1);
      }
      else if (userData && !userData.isAdmin && window.location.pathname === '/services'){
        setValue(4)
      }
    }
    },[ isMd, setValue, userData])


  return (
    <div>
      <AppBar position="fixed" sx={AppBarStyles}>
        <Container maxWidth="lg">
          <Toolbar sx={ToolbarStyles}>
            { !isMd ? (
              <div style={ContentLogoStyles}>
                <a href="/">
                  <PetsIcon sx={ PetIconStyles} />
                </a>
                <Typography variant="h1" sx={PetShopTypographyStyles}>
                  PetShop
                </Typography>
              </div>
            ) 
            : (
              undefined
            )}
            {user && window.location.pathname !== '/register' ? (
              <>
                <RenderDrawer user={user}/>
                <RenderTabs value={ value } handleValue={handleValue} user={user}/>
              </>
            ) : (
              <></>
            )}
            {user !== null ? (
              <RenderAvatar handleValue={handleValue} />
            ) : (
              <RenderSignIn />
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Offset />
    </div>
  );
};

export default Nav;