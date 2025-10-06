import { gql } from "@apollo/client";
export const GET_PAGES_WITH_BLOCK = gql`
  query GetPagesWithBlock {
    pages {
      nodes {
        title
        id
        uri
        blocks
      }
    }
  }
`;
