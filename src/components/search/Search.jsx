import { useLazyQuery } from "@apollo/client";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { Search, SearchIconWrapper, StyledInputBase } from "./styles";
import { useEffect } from "react";
import GET_ALL_PRODUCT_BY_FILTER from "../../service/graphql/querys/getAllProductByFilter";
// import { useContext } from "react";
// import AuthContext from "../context/AuthContext";

const SearchNav = ({setProducts, refetch, getAllProduct}) => {

  //State para manejar el valor del input
  const [input, setInput] = useState('');
  //Query para obtener los productos con un filtro
  const [getAllProductFilter] = useLazyQuery(GET_ALL_PRODUCT_BY_FILTER)

  //Funcion para traer los productos mediante un filtro
  const getAllProductByFilter = async (input) => {
    try {
      const {data} = await getAllProductFilter({variables:{filter:input[0].toUpperCase() + input.substring(1)}})
      if (data.getAllProductByFilter){
        await setProducts(data.getAllProductByFilter)
        await refetch()
      }
    } catch (error) {
      return error
    }
  }

  useEffect(() => {
    if (input){
      getAllProductByFilter(input)
    }
    else{
      getAllProduct()
    }
    // eslint-disable-next-line
  }, [input])

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon sx={{color:'#92999a'}}/>
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Buscar…"
        sx={{color:'#92999a'}}
        inputProps={{ "aria-label": "search" }}
        onChange={(e) => {setInput(e.target.value)}}
      />
    </Search>
  );
}

export default SearchNav;
