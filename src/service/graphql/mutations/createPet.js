import { gql } from "@apollo/client";

const CREATE_PET = gql`
  mutation ($name: String!, $userId: String!, $petType: String!) {
    createPet(name: $name, user_id: $userId, type: $petType)
  }
`;

export default CREATE_PET;
