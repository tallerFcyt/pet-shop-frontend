import { gql } from "@apollo/client";

const UPDATE_SERVICE = gql`
  mutation UpdateService(
    $updateServiceId: Int!
    $title: String
    $description: String
    $price: Float,
    $image_url: String
  ) {
    updateService(
      id: $updateServiceId
      title: $title
      description: $description
      price: $price
      image_url: $image_url
    )
  }
`;

export default UPDATE_SERVICE;
