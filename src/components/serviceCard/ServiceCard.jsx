import {
  Card,
  Typography,
  Button,
  CardMedia,
  Grid,
  IconButton,
  Switch,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { ContentCardService, buttonStyles, cardMediaStyles, boxButtonStyles } from "./styles";
import DELETE_SERVICE from "../../service/graphql/mutations/deleteService";
import { useMutation } from "@apollo/client";
import FormService from "./FormService";
import PetForm from "../pet/PetForm";
import DialogPets from "../pet/DialogPets";

const ServiceCard = ({ setServices, setUpdate, update, refetch, service }) => {
  const { service_id, title, price, description, image_url, active } = service;

  const { userData } = useAuthContext();

  const [openServicePet, setOpenServicePet] = useState(false);
  
  const [open, setOpen] = useState(false);
  
  const [openPet, setOpenPet] = useState(false);

  const [checked, setChecked] = useState(active);

  const [deleteServ] = useMutation(DELETE_SERVICE);

  const handleClickOpenServicePet = () => {
    setOpenServicePet(true);
  };

  const handleCloseServicePet = () => {
    setOpenServicePet(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleClickOpenPet = () => {
    setOpenPet(true);
  };

  const handleClosePet = () => {
    setOpenPet(false);
  };


  const handleChange = (event) => {
    setChecked(event.target.checked);
  };


  const deleteService = async () => {
    try {
      await deleteServ({
        variables: { deleteServiceId: service_id, active: !checked },
      });
    } catch (error) {}
  };

  return (
    <Card sx={{ display: "flex" }}>
      <Grid container>
        <Grid item xs={12} sm={4} md={3}>
          <CardMedia
            component="img"
            sx={cardMediaStyles}
            image={image_url}
            alt={{ title }}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={8.5}>
          <Box sx={ContentCardService}>
            <Typography component="div" variant="h5">
              {title}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {description}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(price)}
            </Typography>
            <Box sx={{width: '100%'}}>
              {window.localStorage.getItem("user") &&
              userData &&
              userData.isAdmin ? (
                <>
                  <FormService
                    open={open}
                    handleClose={handleClose}
                    update={update}
                    refetch={refetch}
                    service={service}
                    setServices={setServices}
                  />
                  <Button
                    onClick={() => {
                      setUpdate(true);
                      handleClickOpen();
                    }}
                    type="submit"
                    variant="contained"
                    sx={buttonStyles}
                  >
                    Editar servicio
                  </Button>
                  <IconButton onClick={deleteService}>
                    <Switch
                      checked={checked}
                      onChange={handleChange}
                      color="primary"
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  </IconButton>
                </>
              ) : (
                <Box
                  sx={boxButtonStyles}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={buttonStyles}
                    onClick={() => {
                      handleClickOpenPet();
                    }}
                  >
                    Adquirir servicio
                  </Button>
                  <Button onClick={() => {handleClickOpenServicePet();}}>Ver mascotas adheridas</Button>
                  <DialogPets
                    open={openServicePet}
                    handleClose={handleCloseServicePet}
                    title={title}
                    service_id={service_id}
                  />
                </Box>
              )}
              <PetForm
                openPet={openPet}
                handleClosePet={handleClosePet}
                service_id={service_id}
                title={title}
                price={price}
                description={description}
                image_url={image_url}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ServiceCard;
