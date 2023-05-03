import { gql } from "@apollo/client";

const GET_ALL_PRODUCT = gql`
  query {
    getAllProduct{
      id,
      title,
      price,
      description,
      stock,
      image_url,
      active
    }
  }
`
export default GET_ALL_PRODUCT;