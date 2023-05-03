import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, Button, CircularProgress, Divider, Grid, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import CREATE_COMMENT from "../../service/graphql/mutations/createComment";
import GET_ALL_COMMENTS from "../../service/graphql/querys/getAllComments";
import SubdirectoryArrowRightOutlinedIcon from "@mui/icons-material/SubdirectoryArrowRightOutlined";
import {
  contentInputStyles,
  contentResponseAndDateStyles,
  contentResponseStyles,
  dividerStyles,
  inputCommentStyles,
  loadingStyles,
  userNameStyles,
  commentTypography,
  titleCommentTypography
} from "./styles";
import DialogComment from "./DialogComment";

const Comment = ({ productId, user, userData }) => {
  //Creamos un estado para setear el comentario nuevo que se realiza.
  const [comment, setComment] = useState();

  //Creamos un estado para guardar los comentarios que tiene cada producto.
  const [allCommentByProduct, setAllCommentByProduct] = useState([]);

  //Creamos un estado para manejar la carga de comentarios
  const [loading, setLoading] = useState(true);

  //State para abrir o cerrar el modal del admin al responder un comentario.
  const [open, setOpen] = useState(false);
  
  //State para obtener el id del comentario
  const [commentId, setCommentId] = useState()

  //Funcion para setear el estado del open en true
  const handleClickOpen = () => {
    setOpen(true);
  };

  //Funcion para setear el estado del open en false
  const handleClose = () => {
    setOpen(false);
  };

  //Manejamos el input de los comentarios
  const handleInput = (e) => {
    setComment(e.target.value);
  };

  //Mutacion para crear un nuevo comentario
  const [newComment] = useMutation(CREATE_COMMENT);

  //Query para mostrar los comentarios de un producto
  const [allComments, { fetchMore: fetchMoreGetAllComment }] = useLazyQuery(GET_ALL_COMMENTS);

  //Funcion donde usamos la mutacion para el comentario
  const createComment = async () => {
    await newComment({
      variables: { comment: comment, userId: user.uid, productId: productId },
    });
    await fetchGetAllComment();
  };

  //Funcion donde usamos la query para los comentarios
  const getAllComment = async () => {
    const { data } = await allComments({ variables: { productId: productId } });
    if (data) {
      setAllCommentByProduct(data.getAllComment);
    }
  };

  //Funcion para refrescar los nuevos comentarios
  const fetchGetAllComment = async () => {
    const { data } = await fetchMoreGetAllComment({
      variables: { productId: productId },
    });
    if (data) {
      setAllCommentByProduct(data.getAllComment);
    }
  };

  //Llamamos a getAllComment cada vez que se actualize allCommentByProduct
  useEffect(() => {
    getAllComment().finally(() => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCommentByProduct]);

  return (
    <Box sx={{ mt: 5 }}>
      <Box>
        <Typography sx={titleCommentTypography}>
          Consultas
        </Typography>
        {user && userData && !userData.isAdmin ? (
          <Box sx={contentInputStyles}>
            <TextField
              sx={inputCommentStyles}
              placeholder="Escribí tu pregunta..."
              name="comment"
              size="small"
              onChange={handleInput}
              value={comment}
            />
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              onClick={async () => {
                createComment();
                setComment("");
              }}
            >
              Preguntar
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </Box>
      {allCommentByProduct.length ? (
        <Box sx={{ mt: 3, padding: "30px 0px" }}>
          {loading ? (
            <div style={loadingStyles}>
              <CircularProgress size={30} sx={{ color: "#FF914D" }} />
            </div>
          ) : (
            allCommentByProduct.map((com) => {
              return (
                <div key={com.id}>
                  <Grid container wrap="nowrap" spacing={2}>
                    <Grid justifyContent="left" item xs zeroMinWidth>
                      <Typography variant="h7" sx={userNameStyles}>
                        {com.user.name} {com.user.lastName}
                      </Typography>
                      <Typography
                        sx={commentTypography}
                      >
                        {com.comment}
                      </Typography>
                      {window.localStorage.getItem("user") &&
                      userData &&
                      userData.isAdmin ? (
                        <>
                          <Button
                            onClick={() => {setCommentId(com.id); handleClickOpen()}}
                          >
                            Responder
                          </Button>
                          <DialogComment
                            open={open}
                            handleClose={handleClose}
                            comment_id={commentId}
                            fetchGetAllComment={fetchGetAllComment}
                          />
                        </>
                      ) : (
                        <></>
                      )}
                      {com.response ? (
                        <Box sx={contentResponseStyles}>
                          <SubdirectoryArrowRightOutlinedIcon
                            sx={{ color: "gray" }}
                          />
                          <Box sx={contentResponseAndDateStyles}>
                            <Typography
                              component={"span"}
                              variant={"body2"}
                              sx={{ color: "gray" }}
                            >
                              {com.response}{" "}
                              <Typography>{com.response_date}</Typography>
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <></>
                      )}
                    </Grid>
                  </Grid>
                  <Divider variant="fullWidth" style={dividerStyles} />
                </div>
              );
            })
          )}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Comment;
