import { gql } from "@apollo/client";

const GET_ALL_PET = gql`
  query($userId: String!){
  getAllPets(user_id: $userId) {
    name,
    type,
    id
  }
}
`;

export default GET_ALL_PET;
