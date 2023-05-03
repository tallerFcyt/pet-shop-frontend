import { gql } from "@apollo/client";

const DELETE_PRODUCT = gql`
mutation($deleteProductId: Int!, $active: Boolean!){
  deleteProduct(id: $deleteProductId, active: $active)
}`;

export default DELETE_PRODUCT;