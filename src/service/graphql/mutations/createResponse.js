import { gql } from "@apollo/client";

const CREATE_RESPONSE = gql`
  mutation($createResponseId: Int!, $response: String!){
  createResponse(id: $createResponseId, response: $response)
}
`;

export default CREATE_RESPONSE;