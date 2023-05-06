import {
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Typography,
  CircularProgress
} from "@mui/material";
import { useEffect, useState } from "react";
import GET_ALL_USER from "../../service/graphql/querys/getAllUser";
import { useLazyQuery } from "@apollo/client";

const FilterDrawer = ({ openFilters, handleDrawerClose, AllProductBuy, setBuys }) => {
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [dateMin, setDateMin] = useState('');
  const [dateMax, setDateMax] = useState('');
  const [userId, setUserId] = useState('');
  const [stateId, setStateId] = useState(0);
  const [loadingFilter, setLoadingFilter] = useState(false)

  const [users, setUsers] = useState()

  const [getUser, {loading}] = useLazyQuery(GET_ALL_USER)

  const getAllUser = async() => {
    const {data} = await getUser()
    
    if (data && data.getAllUsers){
      setUsers(data.getAllUsers)
    }
  }

  const sendFilters = async () => {
    const variables = {}
    if(stateId !== 0) variables.stateId = stateId 
    if(userId !== '') variables.userId = userId
    if(dateMin !== '') variables.startDate = dateMin
    if(dateMax !== '') variables.endDate = dateMax
    if(priceMin < priceMax) variables.minTotalPrice = parseFloat(priceMin)
    if(priceMax !== 0) variables.maxTotalPrice = parseFloat(priceMax)

    const {data} = await AllProductBuy( { variables: variables })
    
    if (data && data.getAllProductBuy){
      setBuys(data.getAllProductBuy)
    }
    setLoadingFilter(false)

  }

  const deleteFilters = () => {
    setStateId(0)
    setUserId('')
    setDateMin('')
    setDateMax('')
    setPriceMin(0)
    setPriceMax(0)
  }
  
  useEffect(() => {
    getAllUser()
    // eslint-disable-next-line
  },[])

  return (
    <Drawer open={openFilters} anchor="right" onClose={handleDrawerClose}>
      <FormControl
        sx={{
          width:{xs: '200px', md: '400px'},
          padding:'20px'
        }}
      >
        <Grid container spacing={1}>
          <Grid item align='center' xs={12} marginBottom={2}>
            <Typography variant='h7' fontWeight='bold'>FILTROS</Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ width:'100%'}}>
            <InputLabel>Estado de envio</InputLabel>
            <Select
              sx={{ height: "40px", width:'100%'}}
              margin="normal"
              variant="standard"
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
            >
              <MenuItem key={1} value={1}>
                Estamos preparando su pedido
              </MenuItem>
              <MenuItem key={2} value={2}>
                Su pedido está en camino
              </MenuItem>
              <MenuItem key={3} value={3}>
                Su pedido fue entregado
              </MenuItem>
            </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ width:'100%'}}>
              <InputLabel>Usuarios</InputLabel>
              <Select
                variant="standard"
                sx={{ height: "40px", width:'100%'}}
                margin="normal"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                {loading ? (<CircularProgress size={20} align='center' color='primary'/>) : (
                  users ? (users.map((user) => {
                    return (
                      <MenuItem key={user.id} value={user.id}>
                        {user.lastName} {user.name}
                      </MenuItem>
                    ) 
                  })) : (<></>)
                  ) }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              fullWidth
              variant="standard"
              label="Precio min."
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              fullWidth
              variant="standard"
              label="Precio max."
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }} 
              variant="standard"
              label="Fecha min."
              type="date"
              value={dateMin}
              onChange={(e) => setDateMin(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }} 
              variant="standard"
              label="Fecha max."
              type="date"
              value={dateMax}
              onChange={(e) => setDateMax(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          sx={{mt: '30px'}}
          variant='outlined'
          onClick={() => {    
            setLoadingFilter(true)
            sendFilters()
          }}
        >
          {loadingFilter ? (
            <CircularProgress size={20} color='primary'/>
          ) : (
            'Aplicar Filtros'
          )}
        </Button>
        <Button
          sx={{mt: '30px'}}
          variant='outlined'
          onClick={deleteFilters}
        >
          Eliminar Filtros
        </Button>
      </FormControl>
    </Drawer>
  );
};

export default FilterDrawer;
