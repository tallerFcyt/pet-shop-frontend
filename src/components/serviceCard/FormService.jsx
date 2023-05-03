import * as React from "react";
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { uploadFile } from "../../firebaseConfig";
import CREATE_SERVICE from "../../service/graphql/mutations/createService";
import UPDATE_SERVICE from "../../service/graphql/mutations/updateService";

function FormService({ setServices, open, handleClose, update, refetch, service }) {
  //State para guardar la foto del servicio
  const [fileService, setFileService] = useState(null);
  //State para guardar el titulo del servicio
  const [titleService, setTitleService] = useState("");
  //State para guardar la descripcion del serivicio
  const [descriptionService, setDescriptionService] = useState("");
  //State para guardar el precio del servicio
  const [priceService, setPriceService] = useState("");
  //State para manejar el envio del formulario
  const [loading, setLoading] = useState(false);

  //Mutation para crear el servicio
  const [createService] = useMutation(CREATE_SERVICE);
  //Mutation para actualizar el servicio
  const [updateService] = useMutation(UPDATE_SERVICE);

  //Setea los datos del serivicio a actualizar si se va a actualizar, si no los setea en vacio.
  useEffect(() => {
    if (update) {
      setTitleService(service.title);
      setDescriptionService(service.description);
      setPriceService(service.price);
    } else {
      setTitleService("");
      setDescriptionService("");
      setPriceService("");
    }
  }, [update, service]);

  //Funcion para crear un servicio.
  async function handleSubmit(e) {
    e.preventDefault();
    let result = [];

    if (fileService !== null) {
      result = await uploadFile(fileService);
    }

    const newService = {
      ...(fileService ? { image_url: result[1] } : ""),
      ...(update ? { updateServiceId: service.service_id } : ""),
      title: titleService,
      description: descriptionService,
      price: parseFloat(priceService),
    };

    if (update) {
      await updateService({
        variables: newService,
      });
      setLoading(false);
      handleClose();
    } else {
      const data = await createService({
        variables: newService,
      });
      setLoading(false);
      handleClose();
      if (data) {
        Swal.fire({
          text: "Servicio creado con éxito.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        });
      }
      setLoading(false);
    }

    setFileService(null);
    setTitleService("");
    setDescriptionService("");
    setPriceService("");
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {update ? "Editar servicio" : "Agregar servicio"}
      </DialogTitle>
      <DialogContent>
        <form
          style={{ width: "100%" }}
          action=""
          onSubmit={async (e) => {
            setLoading(true);
            await handleSubmit(e);
            const { data } = await refetch();
            setServices(data.getAllService);
            handleClose();
          }}
        >
          <TextField
            sx={{ marginBottom: "24px", marginTop: "12px", width: "100%" }}
            type="file"
            name="file"
            fullWidth
            // required
            onChange={(e) => setFileService(e.target.files[0])}
          />
          <TextField
            sx={{ marginBottom: "24px", width: "100%" }}
            type="text"
            label="Titulo"
            name="title"
            value={titleService}
            // required
            onChange={(e) => setTitleService(e.target.value)}
          />
          <TextField
            sx={{ marginBottom: "24px", width: "100%" }}
            type="text"
            id="outlined-required"
            label="Descripción"
            name="description"
            // required
            value={descriptionService}
            onChange={(e) => setDescriptionService(e.target.value)}
          />
          <TextField
            sx={{ marginBottom: "24px", width: "100%" }}
            type="number"
            label="Precio"
            name="price"
            // required
            value={priceService}
            onChange={(e) => setPriceService(e.target.value)}
          />
          <Button sx={{ width: "100%" }} variant="contained" type="submit">
            {loading ? (
              <CircularProgress size={20} sx={{ color: "#FFF" }} />
            ) : update ? (
              "Actualizar"
            ) : (
              "Agregar"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FormService;
