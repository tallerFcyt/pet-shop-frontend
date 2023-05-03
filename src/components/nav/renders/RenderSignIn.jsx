import { Button } from "@mui/material";
import { useAuthContext } from "../../../context/AuthContext";

const RenderSignIn = () => {

  //Trameos la funcion handleGoogleSignIn para iniciar sesion con google.
  const { handleGoogleSignIn } = useAuthContext();

  return (
    <Button
      sx={{
        color: "white",
        borderColor: "#FF914D",
        ":hover": {
          borderColor: "#FF914D",
          color: "#FF914D",
        },
      }}
      variant="outlined"
      onClick={async () => {
        handleGoogleSignIn()
      }}
    >
      Iniciar sesión
    </Button>
  );
};

export default RenderSignIn;
