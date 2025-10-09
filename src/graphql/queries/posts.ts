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

export const GET_POST = gql`
  query GetPost($id: ID = "", $idType: PostIdType = URI) {
    post(id: $id, idType: $idType) {
      title
      content
      blocks
      author {
        node {
          lastName
          firstName
        }
      }
    }
  }
`;

export const GET_PAGE = gql`
  query GetPage($id: ID = "", $idType: PageIdType = URI) {
    page(id: $id, idType: $idType) {
      title
      content
      blocks
      author {
        node {
          lastName
          firstName
        }
      }
    }
  }
`;
