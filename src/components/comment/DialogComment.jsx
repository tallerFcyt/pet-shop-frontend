import { useMutation } from "@apollo/client";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import CREATE_RESPONSE from "../../service/graphql/mutations/createResponse";
import { responseComment } from "./styles"

const DialogComment = ({ open, handleClose, comment_id, fetchGetAllComment }) => {
  
  //State para controlar el envio de la respuesta del admin.
  const [loading, setLoading] = useState(false)

  //State para guardar la respuesta del admin.
  const [response, setResponse] = useState("")
  
  //Mutacion para crear la respuesta.
  const [createResponse] = useMutation(CREATE_RESPONSE)

  //Funcion donde enviamos los datos al backend para crear la respuesta del comentario.
  const handleSubmit = async () =>{
    //Usamos la mutacion para crear la respuesta.
    const data = await createResponse({variables:{createResponseId: comment_id, response: response}})
    //Si se guardo la respuesta, enviamos una alerta informando que la respuesta se creo correctamente.
    if (data){
      Swal.fire({
        text: 'Respuesta creada con éxito.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
      })
      //Cerramos el modal.
      handleClose()
      //Seteamos el estado "loading" en false para indicar que ya termino de crear la respuesta.
      setLoading(false)
    }
    //Inicializamos la respuesta en vacio.
    setResponse('')
  }

  return ( 
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Responder pregunta</DialogTitle>
        <DialogContent>
        <TextField
            sx={responseComment}
            type="text"
            label="Respuesta"
            name="response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={
              async () => {
              setLoading(true)
              await handleSubmit()
              await fetchGetAllComment()
            }
            }>
              {loading ? (<CircularProgress size={20} sx={{ color: "#FF914D", textAlign: 'center'}} />) :('Responder')}
            </Button>
        </DialogActions>
      </Dialog>
   );
}

export default DialogComment;