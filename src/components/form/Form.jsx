import {
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useAuthContext } from "../../context/AuthContext";
import {
  btnSubmitStyles,
  contentFormStyles,
  ingreseDatosStyles,
} from "./styles";
import CREATE_USER from "../../service/graphql/mutations/createUser";
import GET_ALL_PROVINCES from "../../service/graphql/querys/getAllProvinces";
import GET_ALL_LOCATIONS from "../../service/graphql/querys/getAllLocations";

const Form = () => {
  //Obtenemos el user desde el contexto.
  const { user } = useAuthContext();

  
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
  };

  //State para guardar las provincias 
  const [ dataProvinces, setDataProvinces ] = useState()

  //State para guardar las localidades 
  const [ dataLocations, setDataLocations ] = useState()

  //State para guardar los datos de registro del usuario.
  const [dataUser, setDataUser] = useState({
    name: "",
    lastName: "",
    phone: "",
    dni: "",
    province: "",
    location: "",
    address: "",
    number: "",
  });

  //State para manejar la carga del envio del formulario.
  const [loading, setLoading] = useState(false);

  //Query para traer las provincias
  const [allProvinces] = useLazyQuery(GET_ALL_PROVINCES)

  //Query para traer las localidades
  const [allLocations] = useLazyQuery(GET_ALL_LOCATIONS)

  //Mutacion para crear el usuario en la base de datos.
  const [createUser] = useMutation(CREATE_USER);

  //Funcion para setear los datos del formulario en el state userData.
  const handleInput = (event) => {
    setDataUser({
      ...dataUser,
      [event.target.name]: event.target.value,
    });
  };

  //Obtenemos todas las provincias para luego seleccionar una
  const getAllProvinces = async () => {
    try {
      const { data } = await allProvinces();
      if (data.getAllProvince){
        setDataProvinces(data.getAllProvince)
      }
    } catch (error) {
      
    }
  }
  
  //Segun la provincia seleccionada, obtenemos las localidades asociadas
  const getAllLocations = async (id) => {
    try {
      const { data } = await allLocations({variables: {provinceId: id}});
      if (data.getAllLocation){
        setDataLocations(data.getAllLocation)
      }
    } catch (error) {
    }
  }


  useEffect(() => {
    getAllProvinces()
    // eslint-disable-next-line
  },[])


  //Cada vez que se actualice el campo province, hacemos la petición a
  //getAllLocations para obtener las localidades con el nuevo id
  useEffect(() => {
    if(dataProvinces){
      getAllLocations(dataUser.province)
    }
    // eslint-disable-next-line
  }, [dataUser.province])
  
  //Funcion para enviar la data y crear el usuario.
  const sendData = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await createUser({
        variables: {
          createUserId: user.uid,
          dni: dataUser.dni,
          name: dataUser.name,
          lastName: dataUser.lastName,
          phone: dataUser.phone,
          email: user.email,
          location: dataUser.location,
          address: dataUser.address,
          number: parseInt(dataUser.number),
        },
      });
      window.location.href = "/";
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h6" sx={ingreseDatosStyles}>
        Ingrese sus datos
      </Typography>
      <Grid>
        <Card sx={contentFormStyles}>
          <CardContent>
            <form onSubmit={sendData}>
              <Grid container spacing={1}>
                <Grid xs={12} sm={6} item>
                  <TextField
                    placeholder="Nombre"
                    label="Nombre"
                    variant="outlined"
                    onChange={handleInput}
                    name="name"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField
                    placeholder="Apellido"
                    label="Apellido"
                    variant="outlined"
                    onChange={handleInput}
                    name="lastName"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    placeholder="DNI"
                    label="DNI"
                    variant="outlined"
                    onChange={handleInput}
                    name="dni"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    placeholder="Telefono"
                    label="Telefono"
                    variant="outlined"
                    onChange={handleInput}
                    name="phone"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel>Provincia</InputLabel>
                    <Select
                      placeholder="Provincia"
                      label="Provincia"
                      name="province"
                      value={dataUser.province}
                      onChange={handleInput}
                      fullWidth
                      required
                      MenuProps={MenuProps}
                    >
                        {dataProvinces ? (dataProvinces.map((province) => {
                          return(
                            <MenuItem key={province.id} value={province.id}>
                              {province.name}
                            </MenuItem>
                          )
                        })):(<CircularProgress size={15} sx={{ color: "#000" }} />)}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel>Cuidad</InputLabel>
                    <Select
                      placeholder="Ciudad"
                      label="Ciudad"
                      name="location"
                      value={dataUser.location}
                      onChange={handleInput}
                      fullWidth
                      required
                    >
                      {dataLocations ? (dataLocations.map((location) => {
                          return(
                            <MenuItem key={location.id} value={location.id}>
                              {location.name}
                            </MenuItem>
                          )
                        })):(<CircularProgress size={20} sx={{ color: "#fff" }} />)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField
                    placeholder="Calle"
                    label="Calle"
                    variant="outlined"
                    onChange={handleInput}
                    name="address"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField
                    type="number"
                    placeholder="Numero"
                    label="Numero"
                    variant="outlined"
                    onChange={handleInput}
                    name="number"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={btnSubmitStyles}
                    // onClick={sendData}
                  >
                    {loading ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      "Enviar"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
};

export default Form;
