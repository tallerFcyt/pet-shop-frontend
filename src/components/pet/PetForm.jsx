import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import GET_ALL_PET from "../../service/graphql/querys/getAllPets";
import GET_ALL_SERVICE_PET from "../../service/graphql/querys/getAllServicePet";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import CREATE_PET from "../../service/graphql/mutations/createPet";
import { ContentButtonStyle } from "./styles";

const PetForm = ({ openPet, handleClosePet, service_id, title, price, description, image_url }) => {
  //Obtenemos el user del authContext
  const { user } = useAuthContext();
  //State para setear las mascotas del usuario
  const [pets, setPets] = useState([]);
  //State para guardar el nombre de la mascota a la cual se va a comprar el servicio.
  const [name, setName] = useState("");
  //State para guardar el tipo de la mascota a la cual se va a comprar el servicio.
  const [type, setType] = useState("");
  //State para guardar el ID de la mascta a la cual se le va a comprar el servicio
  const [petId, setPetId] = useState("");
  //State para manejar la carga de las mascotas
  const [loadingPet, setLoadingPet] = useState(false);
  //Estado para guardar las mascotas de un usuario que estan adheridas a un servicio
  const [petsUser, setPetsUser] = useState([]);
  //Query para obtener todos las mascotas de un usuario
  const [allPets, { loading, refetch }] = useLazyQuery(GET_ALL_PET);
  //Mutation para crear una mascota a un usuario
  const [Pet] = useMutation(CREATE_PET);
  //Query para obtener todos los servicios que tienen las mascotas
  const [getAllServicePet] = useLazyQuery(GET_ALL_SERVICE_PET);
  //State para manejar la carga de la compra.
  const [loadingService, setLoadingService] = useState(false)
  
  //Funcion para obtener todos los servicios que tienen las mascotas.
  const getAllServicePetByUser = async () => {
    try {
      const { data } = await getAllServicePet({
        variables: { serviceId: service_id, userId: user.uid },
      });
      if (data && data.getServiceByUser) {
        let pets_id = [] 
        data.getServiceByUser.map((p)=>{
          return pets_id.push(p.pet_id)
        })
        setPetsUser(pets_id);
      }
    } catch (error) {}
  };

  //Funcion para obtener las mascotas de un usuario
  const getAllPets = async () => {
    try {
      const { data } = await allPets({ variables: { userId: user.uid } });
      if (data.getAllPets) {
        setPets(data.getAllPets);
      }
    } catch (error) {}
  };

  //Funcion para crear una mascota
  const createPet = async (e) => {
    e.preventDefault();
    setLoadingPet(true);
    try {
      const data = await Pet({
        variables: { name, userId: user.uid, petType: type },
      });
      if (data) {
        const p = await refetch();
        setPets(p.data.getAllPets);
        setLoadingPet(false);
        setName("");
        setType("");
      }
    } catch (error) {
      setLoadingPet(false);
    }
  };

  //Realizar la compra del service
  const buyService = async (e) => {
    e.preventDefault();
    try {
      const items = [
        {
          id: service_id,
          title: title,
          description: description,
          quantity: 1,
          category_id: petId.toString(),
          picture_url: image_url,
          currency_id: "ARS",
          unit_price: price,
        },
      ];

      const data = {
        user_id: user.uid,
        name: user.displayName,
        email: user.email,
        items,
      };

      const result = await fetch("http://localhost:4000/payment/service", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const payment = await result.json();
      window.open(payment.init_point, "_self");
      setLoadingService(false)
    } catch (error) {}
    // window.open(resolve.url)
  };

  //UseEffect para obtener los servicios de una mascota y las mascotas de un uusario.
  useEffect(() => {
    if (openPet){
      getAllServicePetByUser();
      getAllPets();
    }
    // eslint-disable-next-line
  }, [openPet]);

  return (
    <Dialog
      sx={{ minWidth: "100%", minHeight: "100%" }}
      open={openPet}
      onClose={handleClosePet}
    >
      <DialogTitle>Cree una mascota</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => createPet(e)}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nombre de mascota"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="type"
            label="Tipo de mascota"
            type="text"
            fullWidth
            value={type}
            required
            onChange={(e) => {
              setType(e.target.value);
            }}
            variant="standard"
          />
          <Box
            sx={ContentButtonStyle}
          >
            <Button sx={{}} variant="outlined" type="submit">
              {loadingPet ? (
                <CircularProgress size={15} color="primary" />
              ) : (
                "Crear"
              )}
            </Button>
          </Box>
        </form>
        <Typography variant="h6" sx={{ mt: "10px" }}>
          O seleccione mascota
        </Typography>
        <form onSubmit={(e) => {setLoadingService(true); buyService(e)}}>
          <FormControl sx={{ width: "100%", marginTop: "10px" }}>
            <InputLabel>Mascota</InputLabel>
            <Select
              placeholder="Mascota"
              label="Mascota"
              name="pet"
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              fullWidth
              required
              // MenuProps={MenuProps}
            >
              {loading ? (
                <CircularProgress size={15} sx={{ color: "#000" }} />
              ) : pets.length !== 0 ? (
                pets.map((pet) => {
                  return (
                    <MenuItem
                      key={pet.id}
                      value={pet.id}
                      disabled = {petsUser.includes(pet.id)}
                      // onClick={setPetId(pet.id)}
                      sx={{ padding: "5px" }}
                    >
                      {pet.name} ({pet.type}){petsUser.includes(pet.id) ? ' - ADQUIRIDO' : '' }
                    </MenuItem>
                  );
                })
              ) : (
                <Typography sx={{ padding: "5px" }}>
                  No tiene mascotas disponibles
                </Typography>
              )}
            </Select>
          </FormControl>
          <DialogActions>
            <Button onClick={handleClosePet}>Cancelar</Button>
            <Button variant="outlined" type="submit">
              {!loadingService ? ('Confirmar') : (<CircularProgress size={20} color='primary'/>)}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PetForm;
