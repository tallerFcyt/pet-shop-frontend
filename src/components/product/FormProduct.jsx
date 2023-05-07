import { useState, useEffect } from "react";
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { uploadFile } from "../../firebaseConfig";
import { useMutation } from "@apollo/client";
import CREATE_PRODUCT from "../../service/graphql/mutations/createProduct";
import UPDATE_PRODUCT from "../../service/graphql/mutations/updateProduct";
import Swal from "sweetalert2";
import { uploadFileStyle, inputFormStyles } from "./styles";

function FormProduct({ open, handleClose, update, product, setProducts, refetch }) {

  //State para guardar la imagen del producto.
  const [file, setFile] = useState(null);
  //State para guardar el titutlo del producto.
  const [title, setTitle] = useState("");
  //State para guardar la descripcion producto.
  const [description, setDescription] = useState("");
  //State para guardar el precio del producto.
  const [price, setPrice] = useState("");
  //State para guardar el stock del producto.
  const [stock, setStock] = useState("");
  //State para manejar la carga del envio del formulario.
  const [loading, setLoading] = useState(false);
  //Mutacion para crear producto.
  const [createProduct] = useMutation(CREATE_PRODUCT);
  //Mutacion para actualizar un producto.
  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  //UseEffect para cargar los datos del producto en el formulario si es que se va a actualizar
  useEffect(() => {
    if (update) {
      setTitle(product.title);
      setDescription(product.description);
      setPrice(product.price);
      setStock(product.stock);
    }
    // eslint-disable-next-line
  }, [product]);

  //Funcion para crear o actualizar un producto.
  async function handleSubmit(e) {
    e.preventDefault();

    let result = [];

    //Si hay un file, se hace la carga del producto a firebase.
    if (file !== null) {
      result = await uploadFile(file);
    }

    //Creamos el objeto del nuevo producto.
    const newProduct = {
      ...(file ? { image_url: result[1] } : ""),
      ...(update ? { updateProductId: product.product_id } : ""),
      title,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
    };

    if (update) {
      await updateProduct({
        variables: newProduct,
      });
      handleClose();
      setLoading(false);
    } else {
      const data = await createProduct({
        variables: newProduct,
      });
      handleClose();
      if (data) {
        Swal.fire({
          text: "Producto creado con éxito.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        });
      }
      setLoading(false);
    }

    setFile(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setStock("");
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {update ? "Editar producto" : "Agregar producto"}
      </DialogTitle>
      <DialogContent>
        <form
          action=""
          onSubmit={async (e) => {
            setLoading(true);
            await handleSubmit(e);
            const { data } = await refetch();
            setProducts(data.getAllProduct);
          }}
          style={{ width: "100%" }}
        >
          <TextField
            sx={uploadFileStyle}
            type="file"
            name="file"
            fullWidth
            required={update ? false : true}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <TextField
            sx={inputFormStyles}
            type="text"
            label="Titulo"
            name="title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            sx={inputFormStyles}
            type="text"
            id="outlined-required"
            label="Descripción"
            name="description"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            sx={inputFormStyles}
            type="number"
            label="Precio"
            name="price"
            value={price}
            required
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            sx={inputFormStyles}
            type="number"
            label="Stock"
            name="stock"
            value={stock}
            required
            onChange={(e) => setStock(e.target.value)}
          />
          <Button
            sx={{ width: "100%" }}
            variant="contained"
            type="submit"
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
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

export default FormProduct;
