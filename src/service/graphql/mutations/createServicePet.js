import { gql } from "@apollo/client";

const CREATE_SERVICE_PET = gql`
  mutation (
    $createServicePetId: String!
    $price: Float!
    $serviceId: Int!
    $petId: Int!
  ) {
    createServicePet(
      id: $createServicePetId
      price: $price
      service_id: $serviceId
      pet_id: $petId
    )
  }
`;

export default CREATE_SERVICE_PET;
