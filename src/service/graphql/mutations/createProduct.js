import { gql } from "@apollo/client";

const CREATE_PRODUCT = gql`
  mutation (
    $title: String!
    $description: String!
    $price: Float!
    $stock: Int!
    $image_url: String!
  ) {
    createProduct(
      title: $title
      description: $description
      price: $price
      stock: $stock
      image_url: $image_url
    )
  }
`;

export default CREATE_PRODUCT;
