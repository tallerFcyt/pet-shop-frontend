import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthContext from "../../../context/AuthContext";

const RenderAvatar = ( {handleValue, user} ) => {
  
  //usamos useNavigate para redireccionar el usuario a home una vez cerrado sesión.
  const navigate = useNavigate();

  //Estado para menjar el menu.
  const [anchorElUser, setAnchorElUser] = useState(null);

  //Traemos la funcion handleLogout desde el contexto para cerrar sesión.
  const { handleLogout } = useContext(AuthContext);
  
  //Funcion para abrir el menu.
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  //Funcion para cerrar el menu.
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  return ( 
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title={user.displayName}>
        <IconButton onClick={handleOpenUserMenu} sx={{ px: '15px' }}>
          <img alt={user.displayName} src={user.photoURL} style={{borderRadius:"50%", width: 45}} referrerPolicy="no-referrer"></img>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleCloseUserMenu}>
          <Typography textAlign="center" onClick={() => {
                Swal.fire({
                  text: "¿Desea cerrar sesión?",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Aceptar',
                  cancelButtonText: 'Cancelar',
                  cancelButtonColor: '#aB0e0e',
                  confirmButtonColor: "#1b9e17",
                  background: "#eaeaea",
                  backdrop: "rgba(0, 0, 0, 0.8)",
                  reverseButtons: true
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleLogout()
                    navigate("/")
                    handleValue(0)
                  }
                })
              }}>
              Cerrar sesión
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
   );
}
 
export default RenderAvatar;