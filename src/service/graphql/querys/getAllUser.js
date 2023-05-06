import { gql } from "@apollo/client";

const GET_ALL_USER = gql`
  query {
    getAllUsers {
      id
      name
      lastName
      isAdmin
    }
  }
`;

export default GET_ALL_USER;
