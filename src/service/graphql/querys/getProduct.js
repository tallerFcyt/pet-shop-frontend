import { gql } from "@apollo/client";

const GET_PRODUCT = gql`
  query($getProductId: ID!) {
    getProduct(id: $getProductId) {
      id,
      title,
      description,
      price,
      stock,
      active,
      image_url
    }
  }
`

export default GET_PRODUCT;