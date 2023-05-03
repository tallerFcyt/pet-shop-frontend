import { gql } from "@apollo/client";

const CREATE_USER = gql`
mutation($createUserId: String!, $dni: String!, $name: String!, $lastName: String!, $phone: String!, $email: String!, $location: Int!, $address: String!, $number: Int!){
  createUser(id: $createUserId, dni: $dni, name: $name, lastName: $lastName, phone: $phone, email: $email, location: $location, address: $address, number: $number)
}
`
export default CREATE_USER;