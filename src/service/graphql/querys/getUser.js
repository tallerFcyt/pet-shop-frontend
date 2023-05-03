import { gql } from "@apollo/client";

const GET_USER = gql`
  query($getUserId: String!){
    getUser(id: $getUserId) {
      dni
      name
      lastName
      phone
      email
      isAdmin
    }
  }
`

export default GET_USER;
