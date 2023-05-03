import { gql } from "@apollo/client";

const CREATE_SHIPMENT = gql`
  mutation($stateId: Int!, $buyId: String!){
  createShipment(state_id: $stateId, buy_id: $buyId)
}
`;

export default CREATE_SHIPMENT;
