import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import GET_ALL_SERVICE_PET from "../../service/graphql/querys/getAllServicePet";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { ContentDialogPet, ContentServiceData, InfoPet } from "./styles";

const DialogPets = ({ open, handleClose, title, service_id }) => {

  //Traemos el user del contexto
  const { user } = useAuthContext();

  //State para setear las mascotas
  const [pets, setPets] = useState([]);
  
  //Query para obtener todos los servicios con las mascotas asociadas al mismo
  const [getAllServicePet, {loading}] = useLazyQuery(GET_ALL_SERVICE_PET)

  //Funcion para obtener todos los servicios con las mascotas asociadas al mismo.
  const getAllServicePetByUser = async () =>{
    try {
      const {data} = await getAllServicePet({variables:{serviceId: service_id, userId: user.uid }})
      if (data && data.getServiceByUser){
        setPets(data.getServiceByUser)
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getAllServicePetByUser()
    // eslint-disable-next-line
  },[])
  
  return ( 
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" fontWeight={'bold'}>
          Servicio: "{title}"
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress size={20} sx={{color: '#FF914D'}}/>
          ) : (
          <>
            {pets.length > 0 ? (
              pets.map((pet) => {
                const start_date = new Date(pet.start_date);
                const ending_date = new Date(pet.ending_date);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const startDateString = start_date.toLocaleDateString('es-ES', options); 
                const endingDateString = ending_date.toLocaleDateString('es-ES', options); 
                return(
                  <Box sx={ContentDialogPet}>
                    <Box sx={ContentServiceData}>
                      <Typography sx={InfoPet}>Mascota: </Typography>
                      <Typography>{pet.pet.name}</Typography>
                    </Box>
                    <Box sx={ContentServiceData}>
                      <Typography sx={{fontWeight:'bold' ,color:'#444', mr:'6px'}}>Precio: </Typography>
                      <Typography>{Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(pet.price)}</Typography>
                    </Box>  
                    <Box sx={ContentServiceData}>
                      <Typography sx={{fontWeight:'bold' ,color:'#444', mr:'6px'}}>Fecha de subscripción: </Typography>
                      <Typography>{startDateString}</Typography>
                    </Box>
                    <Box sx={ContentServiceData}>
                      <Typography sx={{fontWeight:'bold' ,color:'#444', mr:'6px'}}>Fecha de fin: </Typography>
                      <Typography>{endingDateString}</Typography>
                    </Box>
                    <Divider sx={{m: '10px 0px'}}></Divider>
                  </Box>
                )
              })
            ) : (
              <>No tiene mascotas adheridas a este servicio</>
            )}
          </>)
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
   );
}

export default DialogPets;