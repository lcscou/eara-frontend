import { gql } from "@apollo/client";
export const MENU_QUERY = gql`
  query GET_MENU {
    menus {
      nodes {
        locations
        menuItems(where: { parentId: "0" }) {
          nodes {
            label
            uri
            parentDatabaseId
            childItems {
              nodes {
                label
                uri
              }
            }
          }
        }
      }
    }
  }
`;
