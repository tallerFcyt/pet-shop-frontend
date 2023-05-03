import { gql } from "@apollo/client";

const CREATE_SERVICE = gql`
  mutation CreateService(
    $title: String!
    $description: String!
    $price: Float!
    $image_url: String!
  ) {
    createService(title: $title, description: $description, price: $price, image_url:$image_url)
  }
`;

export default CREATE_SERVICE;
