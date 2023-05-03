import { gql } from "@apollo/client";

const UPDATE_SHIPMENT = gql`
mutation($updateShipmentId: Int!, $stateId: Int!){
  updateShipment(id: $updateShipmentId, state_id: $stateId)
}
`;

export default UPDATE_SHIPMENT;
