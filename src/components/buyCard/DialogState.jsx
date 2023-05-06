import { useMutation } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";
import UPDATE_SHIPMENT from "../../service/graphql/mutations/updateShipment";

const DialogState = ({ open, handleClose, shipment, refetch, setBuys }) => {

  //Estado para guardar el estado del envio.
  const [state, setState] = useState(shipment.state_id);

  //Mutation para actualizar el estado del envio
  const [updateShipment, {loading}] = useMutation(UPDATE_SHIPMENT)
  
  //Funcion que actualiza el estado de un envio
  const updateState = async (e) => {
    e.preventDefault();
    try {
      const data = await updateShipment({
        variables: { updateShipmentId: shipment.id, stateId: state },
      });
      if (data) {
        const b = await refetch();
        setBuys(b.data.getAllProductBuy)
        handleClose();
      }
    } catch (error) {

    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      
    >
      <DialogTitle>Estados de envios</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => updateState(e)}>
          <FormControl sx={{ width: "100%" }}>
            <Select
              sx={{ height: "40px" }}
              value={state}
              defaultValue = {shipment.state_id}
              fullWidth
              required
              onChange={(e) => setState(e.target.value)}
            >
              <MenuItem key={1} value={1} disabled={ 1 < shipment.state_id ? true : false }>
                Estamos preparando su pedido
              </MenuItem>
              <MenuItem key={2} value={2} disabled={ 2 < shipment.state_id ? true : false } >
                Su pedido está en camino
              </MenuItem>
              <MenuItem key={3} value={3} disabled={( 3 < shipment.state_id || shipment.state_id === 1) ? true : false }>
                Su pedido fue entregado
              </MenuItem>
            </Select>
          </FormControl>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button variant="outlined" type="submit">
              {loading ? (<CircularProgress size={20} color='primary' />) : ('Confirmar')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogState;
