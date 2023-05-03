export const uploadFileStyle = { marginBottom: "24px", marginTop: "12px", width: "100%" }

export const inputFormStyles = { marginBottom: "24px", width: "100%" }

export const cardMediaStyles = { borderRadius: "4px", width: {sm: "100%", md: "90%", xs: "100%" }, maxHeight: { sm:"550px", md: "550px", xs: "300px" } }

export const paperStyles = { width: '100%', height:'40px', display: 'flex', justifyContent: 'center', alignItems:'center', marginBottom: '20px' }

export const loadingStyles = {
  width: "100%",
  height: "50vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const contentProductStyles = {
  width: "100%",
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between"
};

export const contentInfoProductStyles = {
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  alingItems: "center",
};

export const titleTypographyStyles = {
  fontWeight: "bold",
  minHeigth: "100%",
  wordBreak: "break-all",
  wordWrap: "break-word",
  color: "#fff",
};

export const contentPriceAndStockStyles = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  alignItems: "center",
};

export const quantityStyles = {
  marginBottom:4,
  width: '100%',
  "input": {
    color: "#999",
  },
  "& label":{color: "#999"},
  "& label.Mui-focused": { color: '#f57627', fontWeight:'bold' },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'green',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#999',
    },
    '&:hover fieldset': {
      borderColor: '#999',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#f57627',
    },
  },
}

export const buttonCartStyles = {
  backgroundColor: "#FF914D",
  width: '100%',
  ":hover": {
    backgroundColor: "#f57627",
  },
  "&.Mui-disabled": {backgroundColor: "#777", color:'#444' }
}

export const cardAddProduct = {
  transition: "transform .2s",
  height:'490px',
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  backgroundColor:'rgba(256,256,256,0.3)',
  ":hover": {
    boxShadow: 20, // theme.shadows[20]
    transform: "scale(1.02)",
  },
}

export const inputQuantity = { "& .MuiInputBase-input":{
  textAlign: "center"
},
  '& .MuiInputBase-root': {
    '&.Mui-focused': {
      backgroundColor: 'transparent',
    },
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent',
    },
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
},}