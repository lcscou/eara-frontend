import { MENU_QUERY } from "@/graphql/queries/menu";
import { createApolloClient } from "@/lib/apollo-client";

export default async function MenuItems() {
  const client = createApolloClient();
  const { data } = await client.query({ query: MENU_QUERY });

  console.log('from serve', data);

  const MAIN_MENU_LEFT = data?.menus?.nodes?.filter((menu) =>
    menu?.locations?.find((loc) => loc == "MAIN_MENU_LEFT")
  )[0];
  const MAIN_MENU_RIGHT = data?.menus?.nodes?.filter((menu) =>
    menu?.locations?.find((loc) => loc == "MAIN_MENU_RIGHT")
  )[0];

  return { MAIN_MENU_LEFT: MAIN_MENU_LEFT, MAIN_MENU_RIGHT: MAIN_MENU_RIGHT };
}
