import { gql } from "@apollo/client";

const UPDATE_PRODUCT = gql`
  mutation (
    $updateProductId: Int!
    $title: String
    $description: String
    $price: Float
    $stock: Int
    $image_url: String
  ) {
    updateProduct(
      id: $updateProductId
      title: $title
      description: $description
      price: $price
      stock: $stock
      image_url: $image_url
    )
  }
`;
export default UPDATE_PRODUCT;
