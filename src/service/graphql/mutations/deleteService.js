import { gql } from "@apollo/client";

const DELETE_SERVICE = gql`
  mutation DeleteService($deleteServiceId: Int!, $active: Boolean!) {
    deleteService(id: $deleteServiceId, active: $active)
  }
`;

export default DELETE_SERVICE;
