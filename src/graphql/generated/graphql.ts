// @ts-nocheck
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type GetPagesWithBlockQuery_RootQuery_pages_RootQueryToPageConnection_nodes_Page = {
  __typename?: 'Page'
  title?: string | null
  id: string
  uri?: string | null
  blocks?: any | null
}

export type GetPagesWithBlockQuery_RootQuery_pages_RootQueryToPageConnection = {
  __typename?: 'RootQueryToPageConnection'
  nodes: Array<GetPagesWithBlockQuery_RootQuery_pages_RootQueryToPageConnection_nodes_Page>
}

export type GetPagesWithBlockQuery_RootQuery = {
  __typename?: 'RootQuery'
  pages?: GetPagesWithBlockQuery_RootQuery_pages_RootQueryToPageConnection | null
}

export type GetPagesWithBlockQueryVariables = Exact<{ [key: string]: never }>

export type GetPagesWithBlockQuery = GetPagesWithBlockQuery_RootQuery

export type GetPostQuery_RootQuery_post_Post_author_NodeWithAuthorToUserConnectionEdge_node_User = {
  __typename?: 'User'
  lastName?: string | null
  firstName?: string | null
}

export type GetPostQuery_RootQuery_post_Post_author_NodeWithAuthorToUserConnectionEdge = {
  __typename?: 'NodeWithAuthorToUserConnectionEdge'
  node: GetPostQuery_RootQuery_post_Post_author_NodeWithAuthorToUserConnectionEdge_node_User
}

export type GetPostQuery_RootQuery_post_Post = {
  __typename?: 'Post'
  title?: string | null
  content?: string | null
  blocks?: any | null
  author?: GetPostQuery_RootQuery_post_Post_author_NodeWithAuthorToUserConnectionEdge | null
}

export type GetPostQuery_RootQuery = {
  __typename?: 'RootQuery'
  post?: GetPostQuery_RootQuery_post_Post | null
}

export type GetPostQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>
  idType?: InputMaybe<PostIdType>
}>

export type GetPostQuery = GetPostQuery_RootQuery

export type GetPageQuery_RootQuery_page_Page_author_NodeWithAuthorToUserConnectionEdge_node_User = {
  __typename?: 'User'
  name?: string | null
  firstName?: string | null
  lastName?: string | null
  nicename?: string | null
}

export type GetPageQuery_RootQuery_page_Page_author_NodeWithAuthorToUserConnectionEdge = {
  __typename?: 'NodeWithAuthorToUserConnectionEdge'
  node: GetPageQuery_RootQuery_page_Page_author_NodeWithAuthorToUserConnectionEdge_node_User
}

export type GetPageQuery_RootQuery_page_Page_seo_PostTypeSEO_breadcrumbs_SEOPostTypeBreadcrumbs = {
  __typename?: 'SEOPostTypeBreadcrumbs'
  text?: string | null
  url?: string | null
}

export type GetPageQuery_RootQuery_page_Page_seo_PostTypeSEO = {
  __typename?: 'PostTypeSEO'
  readingTime?: number | null
  opengraphDescription?: string | null
  breadcrumbs?: Array<GetPageQuery_RootQuery_page_Page_seo_PostTypeSEO_breadcrumbs_SEOPostTypeBreadcrumbs | null> | null
}

export type GetPageQuery_RootQuery_page_Page_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge_node_MediaItem =
  { __typename?: 'MediaItem'; guid?: string | null; altText?: string | null; title?: string | null }

export type GetPageQuery_RootQuery_page_Page_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge =
  {
    __typename?: 'NodeWithFeaturedImageToMediaItemConnectionEdge'
    node: GetPageQuery_RootQuery_page_Page_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge_node_MediaItem
  }

export type GetPageQuery_RootQuery_page_Page = {
  __typename?: 'Page'
  id: string
  title?: string | null
  blocks?: any | null
  date?: string | null
  slug?: string | null
  content?: string | null
  author?: GetPageQuery_RootQuery_page_Page_author_NodeWithAuthorToUserConnectionEdge | null
  seo?: GetPageQuery_RootQuery_page_Page_seo_PostTypeSEO | null
  featuredImage?: GetPageQuery_RootQuery_page_Page_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge | null
}

export type GetPageQuery_RootQuery = {
  __typename?: 'RootQuery'
  page?: GetPageQuery_RootQuery_page_Page | null
}

export type GetPageQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>
}>

export type GetPageQuery = GetPageQuery_RootQuery

export type GetAnimalQuery_RootQuery_animal_Animal_author_NodeWithAuthorToUserConnectionEdge_node_User =
  {
    __typename?: 'User'
    name?: string | null
    firstName?: string | null
    lastName?: string | null
    nicename?: string | null
  }

export type GetAnimalQuery_RootQuery_animal_Animal_author_NodeWithAuthorToUserConnectionEdge = {
  __typename?: 'NodeWithAuthorToUserConnectionEdge'
  node: GetAnimalQuery_RootQuery_animal_Animal_author_NodeWithAuthorToUserConnectionEdge_node_User
}

export type GetAnimalQuery_RootQuery_animal_Animal_seo_PostTypeSEO_breadcrumbs_SEOPostTypeBreadcrumbs =
  { __typename?: 'SEOPostTypeBreadcrumbs'; text?: string | null; url?: string | null }

export type GetAnimalQuery_RootQuery_animal_Animal_seo_PostTypeSEO = {
  __typename?: 'PostTypeSEO'
  readingTime?: number | null
  opengraphDescription?: string | null
  breadcrumbs?: Array<GetAnimalQuery_RootQuery_animal_Animal_seo_PostTypeSEO_breadcrumbs_SEOPostTypeBreadcrumbs | null> | null
}

export type GetAnimalQuery_RootQuery_animal_Animal_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge_node_MediaItem =
  { __typename?: 'MediaItem'; guid?: string | null; altText?: string | null; title?: string | null }

export type GetAnimalQuery_RootQuery_animal_Animal_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge =
  {
    __typename?: 'NodeWithFeaturedImageToMediaItemConnectionEdge'
    node: GetAnimalQuery_RootQuery_animal_Animal_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge_node_MediaItem
  }

export type GetAnimalQuery_RootQuery_animal_Animal = {
  __typename?: 'Animal'
  id: string
  title?: string | null
  date?: string | null
  blocks?: any | null
  slug?: string | null
  content?: string | null
  author?: GetAnimalQuery_RootQuery_animal_Animal_author_NodeWithAuthorToUserConnectionEdge | null
  seo?: GetAnimalQuery_RootQuery_animal_Animal_seo_PostTypeSEO | null
  featuredImage?: GetAnimalQuery_RootQuery_animal_Animal_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge | null
}

export type GetAnimalQuery_RootQuery = {
  __typename?: 'RootQuery'
  animal?: GetAnimalQuery_RootQuery_animal_Animal | null
}

export type GetAnimalQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>
}>

export type GetAnimalQuery = GetAnimalQuery_RootQuery

export type MenuItemFieldsFragment_MenuItem_menuAcf_MenuAcf = {
  __typename?: 'MenuAcf'
  content?: string | null
  fieldGroupName?: string | null
  hidden?: boolean | null
  ismegamenu?: boolean | null
}

export type MenuItemFieldsFragment_MenuItem_menuGeral_MenuGeral = {
  __typename?: 'MenuGeral'
  menuTextColor?: string | null
}

export type MenuItemFieldsFragment = {
  __typename?: 'MenuItem'
  id: string
  label?: string | null
  uri?: string | null
  menuAcf?: MenuItemFieldsFragment_MenuItem_menuAcf_MenuAcf | null
  menuGeral?: MenuItemFieldsFragment_MenuItem_menuGeral_MenuGeral | null
}

export type GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuGeral_MenuGeral =
  { __typename?: 'MenuGeral'; menuTextColor?: string | null }

export type GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem =
  {
    __typename?: 'MenuItem'
    id: string
    label?: string | null
    uri?: string | null
    menuAcf?: MenuItemFieldsFragment_MenuItem_menuAcf_MenuAcf | null
    menuGeral?: MenuItemFieldsFragment_MenuItem_menuGeral_MenuGeral | null
  }

export type GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection =
  {
    __typename?: 'MenuItemToMenuItemConnection'
    nodes: Array<GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem>
  }

export type GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem =
  {
    __typename?: 'MenuItem'
    id: string
    label?: string | null
    uri?: string | null
    childItems?: GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection | null
    menuAcf?: MenuItemFieldsFragment_MenuItem_menuAcf_MenuAcf | null
    menuGeral?: MenuItemFieldsFragment_MenuItem_menuGeral_MenuGeral | null
  }

export type GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection =
  {
    __typename?: 'MenuItemToMenuItemConnection'
    nodes: Array<GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem>
  }

export type GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem =
  {
    __typename?: 'MenuItem'
    id: string
    label?: string | null
    uri?: string | null
    childItems?: GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection | null
    menuAcf?: MenuItemFieldsFragment_MenuItem_menuAcf_MenuAcf | null
    menuGeral?: MenuItemFieldsFragment_MenuItem_menuGeral_MenuGeral | null
  }

export type GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection =
  {
    __typename?: 'MenuItemToMenuItemConnection'
    nodes: Array<GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection_nodes_MenuItem>
  }

export type GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem =
  {
    __typename?: 'MenuItem'
    id: string
    label?: string | null
    uri?: string | null
    childItems?: GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem_childItems_MenuItemToMenuItemConnection | null
    menuAcf?: MenuItemFieldsFragment_MenuItem_menuAcf_MenuAcf | null
    menuGeral?: MenuItemFieldsFragment_MenuItem_menuGeral_MenuGeral | null
  }

export type GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection =
  {
    __typename?: 'MenuToMenuItemConnection'
    nodes: Array<GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection_nodes_MenuItem>
  }

export type GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu = {
  __typename?: 'Menu'
  locations?: Array<MenuLocationEnum | null> | null
  menuGeral?: GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuGeral_MenuGeral | null
  menuItems?: GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu_menuItems_MenuToMenuItemConnection | null
}

export type GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection = {
  __typename?: 'RootQueryToMenuConnection'
  nodes: Array<GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection_nodes_Menu>
}

export type GetMenuQuery_RootQuery = {
  __typename?: 'RootQuery'
  menus?: GetMenuQuery_RootQuery_menus_RootQueryToMenuConnection | null
}

export type GetMenuQueryVariables = Exact<{ [key: string]: never }>

export type GetMenuQuery = GetMenuQuery_RootQuery

export type GetNewsQuery_RootQuery_news_News_author_NodeWithAuthorToUserConnectionEdge_node_User = {
  __typename?: 'User'
  name?: string | null
  firstName?: string | null
  lastName?: string | null
  nicename?: string | null
}

export type GetNewsQuery_RootQuery_news_News_author_NodeWithAuthorToUserConnectionEdge = {
  __typename?: 'NodeWithAuthorToUserConnectionEdge'
  node: GetNewsQuery_RootQuery_news_News_author_NodeWithAuthorToUserConnectionEdge_node_User
}

export type GetNewsQuery_RootQuery_news_News_seo_PostTypeSEO_breadcrumbs_SEOPostTypeBreadcrumbs = {
  __typename?: 'SEOPostTypeBreadcrumbs'
  text?: string | null
  url?: string | null
}

export type GetNewsQuery_RootQuery_news_News_seo_PostTypeSEO = {
  __typename?: 'PostTypeSEO'
  readingTime?: number | null
  opengraphDescription?: string | null
  breadcrumbs?: Array<GetNewsQuery_RootQuery_news_News_seo_PostTypeSEO_breadcrumbs_SEOPostTypeBreadcrumbs | null> | null
}

export type GetNewsQuery_RootQuery_news_News_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge_node_MediaItem =
  { __typename?: 'MediaItem'; guid?: string | null; altText?: string | null; title?: string | null }

export type GetNewsQuery_RootQuery_news_News_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge =
  {
    __typename?: 'NodeWithFeaturedImageToMediaItemConnectionEdge'
    node: GetNewsQuery_RootQuery_news_News_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge_node_MediaItem
  }

export type GetNewsQuery_RootQuery_news_News = {
  __typename?: 'News'
  id: string
  title?: string | null
  blocks?: any | null
  date?: string | null
  slug?: string | null
  content?: string | null
  author?: GetNewsQuery_RootQuery_news_News_author_NodeWithAuthorToUserConnectionEdge | null
  seo?: GetNewsQuery_RootQuery_news_News_seo_PostTypeSEO | null
  featuredImage?: GetNewsQuery_RootQuery_news_News_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge | null
}

export type GetNewsQuery_RootQuery = {
  __typename?: 'RootQuery'
  news?: GetNewsQuery_RootQuery_news_News | null
}

export type GetNewsQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>
}>

export type GetNewsQuery = GetNewsQuery_RootQuery

export type GetEventsQuery_RootQuery_events_Events_author_NodeWithAuthorToUserConnectionEdge_node_User =
  {
    __typename?: 'User'
    name?: string | null
    firstName?: string | null
    lastName?: string | null
    nicename?: string | null
  }

export type GetEventsQuery_RootQuery_events_Events_author_NodeWithAuthorToUserConnectionEdge = {
  __typename?: 'NodeWithAuthorToUserConnectionEdge'
  node: GetEventsQuery_RootQuery_events_Events_author_NodeWithAuthorToUserConnectionEdge_node_User
}

export type GetEventsQuery_RootQuery_events_Events_seo_PostTypeSEO_breadcrumbs_SEOPostTypeBreadcrumbs =
  { __typename?: 'SEOPostTypeBreadcrumbs'; text?: string | null; url?: string | null }

export type GetEventsQuery_RootQuery_events_Events_seo_PostTypeSEO = {
  __typename?: 'PostTypeSEO'
  readingTime?: number | null
  opengraphDescription?: string | null
  breadcrumbs?: Array<GetEventsQuery_RootQuery_events_Events_seo_PostTypeSEO_breadcrumbs_SEOPostTypeBreadcrumbs | null> | null
}

export type GetEventsQuery_RootQuery_events_Events_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge_node_MediaItem =
  { __typename?: 'MediaItem'; guid?: string | null; altText?: string | null; title?: string | null }

export type GetEventsQuery_RootQuery_events_Events_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge =
  {
    __typename?: 'NodeWithFeaturedImageToMediaItemConnectionEdge'
    node: GetEventsQuery_RootQuery_events_Events_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge_node_MediaItem
  }

export type GetEventsQuery_RootQuery_events_Events = {
  __typename?: 'Events'
  id: string
  title?: string | null
  blocks?: any | null
  date?: string | null
  slug?: string | null
  content?: string | null
  author?: GetEventsQuery_RootQuery_events_Events_author_NodeWithAuthorToUserConnectionEdge | null
  seo?: GetEventsQuery_RootQuery_events_Events_seo_PostTypeSEO | null
  featuredImage?: GetEventsQuery_RootQuery_events_Events_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge | null
}

export type GetEventsQuery_RootQuery = {
  __typename?: 'RootQuery'
  events?: GetEventsQuery_RootQuery_events_Events | null
}

export type GetEventsQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>
}>

export type GetEventsQuery = GetEventsQuery_RootQuery

export type GetDiseasesQuery_RootQuery_diseases_Diseases_author_NodeWithAuthorToUserConnectionEdge_node_User =
  {
    __typename?: 'User'
    name?: string | null
    firstName?: string | null
    lastName?: string | null
    nicename?: string | null
  }

export type GetDiseasesQuery_RootQuery_diseases_Diseases_author_NodeWithAuthorToUserConnectionEdge =
  {
    __typename?: 'NodeWithAuthorToUserConnectionEdge'
    node: GetDiseasesQuery_RootQuery_diseases_Diseases_author_NodeWithAuthorToUserConnectionEdge_node_User
  }

export type GetDiseasesQuery_RootQuery_diseases_Diseases_seo_PostTypeSEO_breadcrumbs_SEOPostTypeBreadcrumbs =
  { __typename?: 'SEOPostTypeBreadcrumbs'; text?: string | null; url?: string | null }

export type GetDiseasesQuery_RootQuery_diseases_Diseases_seo_PostTypeSEO = {
  __typename?: 'PostTypeSEO'
  readingTime?: number | null
  opengraphDescription?: string | null
  breadcrumbs?: Array<GetDiseasesQuery_RootQuery_diseases_Diseases_seo_PostTypeSEO_breadcrumbs_SEOPostTypeBreadcrumbs | null> | null
}

export type GetDiseasesQuery_RootQuery_diseases_Diseases_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge_node_MediaItem =
  { __typename?: 'MediaItem'; guid?: string | null; altText?: string | null; title?: string | null }

export type GetDiseasesQuery_RootQuery_diseases_Diseases_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge =
  {
    __typename?: 'NodeWithFeaturedImageToMediaItemConnectionEdge'
    node: GetDiseasesQuery_RootQuery_diseases_Diseases_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge_node_MediaItem
  }

export type GetDiseasesQuery_RootQuery_diseases_Diseases = {
  __typename?: 'Diseases'
  id: string
  title?: string | null
  blocks?: any | null
  date?: string | null
  slug?: string | null
  content?: string | null
  author?: GetDiseasesQuery_RootQuery_diseases_Diseases_author_NodeWithAuthorToUserConnectionEdge | null
  seo?: GetDiseasesQuery_RootQuery_diseases_Diseases_seo_PostTypeSEO | null
  featuredImage?: GetDiseasesQuery_RootQuery_diseases_Diseases_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge | null
}

export type GetDiseasesQuery_RootQuery = {
  __typename?: 'RootQuery'
  diseases?: GetDiseasesQuery_RootQuery_diseases_Diseases | null
}

export type GetDiseasesQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>
}>

export type GetDiseasesQuery = GetDiseasesQuery_RootQuery

export type GetMembersQuery_RootQuery_member_Member_author_NodeWithAuthorToUserConnectionEdge_node_User =
  {
    __typename?: 'User'
    name?: string | null
    firstName?: string | null
    lastName?: string | null
    nicename?: string | null
  }

export type GetMembersQuery_RootQuery_member_Member_author_NodeWithAuthorToUserConnectionEdge = {
  __typename?: 'NodeWithAuthorToUserConnectionEdge'
  node: GetMembersQuery_RootQuery_member_Member_author_NodeWithAuthorToUserConnectionEdge_node_User
}

export type GetMembersQuery_RootQuery_member_Member_seo_PostTypeSEO_breadcrumbs_SEOPostTypeBreadcrumbs =
  { __typename?: 'SEOPostTypeBreadcrumbs'; text?: string | null; url?: string | null }

export type GetMembersQuery_RootQuery_member_Member_seo_PostTypeSEO = {
  __typename?: 'PostTypeSEO'
  readingTime?: number | null
  opengraphDescription?: string | null
  breadcrumbs?: Array<GetMembersQuery_RootQuery_member_Member_seo_PostTypeSEO_breadcrumbs_SEOPostTypeBreadcrumbs | null> | null
}

export type GetMembersQuery_RootQuery_member_Member_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge_node_MediaItem =
  { __typename?: 'MediaItem'; guid?: string | null; altText?: string | null; title?: string | null }

export type GetMembersQuery_RootQuery_member_Member_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge =
  {
    __typename?: 'NodeWithFeaturedImageToMediaItemConnectionEdge'
    node: GetMembersQuery_RootQuery_member_Member_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge_node_MediaItem
  }

export type GetMembersQuery_RootQuery_member_Member = {
  __typename?: 'Member'
  id: string
  title?: string | null
  blocks?: any | null
  date?: string | null
  slug?: string | null
  content?: string | null
  author?: GetMembersQuery_RootQuery_member_Member_author_NodeWithAuthorToUserConnectionEdge | null
  seo?: GetMembersQuery_RootQuery_member_Member_seo_PostTypeSEO | null
  featuredImage?: GetMembersQuery_RootQuery_member_Member_featuredImage_NodeWithFeaturedImageToMediaItemConnectionEdge | null
}

export type GetMembersQuery_RootQuery = {
  __typename?: 'RootQuery'
  member?: GetMembersQuery_RootQuery_member_Member | null
}

export type GetMembersQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>
}>

export type GetMembersQuery = GetMembersQuery_RootQuery

export const MenuItemFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MenuItemFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'MenuItem' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'label' } },
          { kind: 'Field', name: { kind: 'Name', value: 'uri' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'menuAcf' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'content' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fieldGroupName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'hidden' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ismegamenu' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'menuGeral' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'menuTextColor' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MenuItemFieldsFragment, unknown>
export const GetPagesWithBlockDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPagesWithBlock' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pages' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'uri' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'blocks' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPagesWithBlockQuery, GetPagesWithBlockQueryVariables>
export const GetPostDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPost' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          defaultValue: { kind: 'StringValue', value: '', block: false },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'idType' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PostIdType' } },
          defaultValue: { kind: 'EnumValue', value: 'URI' },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'post' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'idType' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'idType' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'content' } },
                { kind: 'Field', name: { kind: 'Name', value: 'blocks' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPostQuery, GetPostQueryVariables>
export const GetPageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          defaultValue: { kind: 'StringValue', value: '', block: false },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'page' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'idType' },
                value: { kind: 'EnumValue', value: 'URI' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'blocks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'nicename' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'seo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'readingTime' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'opengraphDescription' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'breadcrumbs' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'content' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'featuredImage' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'altText' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPageQuery, GetPageQueryVariables>
export const GetAnimalDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetAnimal' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          defaultValue: { kind: 'StringValue', value: '', block: false },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'animal' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'idType' },
                value: { kind: 'EnumValue', value: 'URI' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'nicename' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'blocks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'seo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'readingTime' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'opengraphDescription' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'breadcrumbs' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'content' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'featuredImage' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'altText' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAnimalQuery, GetAnimalQueryVariables>
export const GetMenuDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetMenu' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'menus' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'menuGeral' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'menuTextColor' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'locations' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'menuItems' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'where' },
                            value: {
                              kind: 'ObjectValue',
                              fields: [
                                {
                                  kind: 'ObjectField',
                                  name: { kind: 'Name', value: 'parentId' },
                                  value: { kind: 'StringValue', value: '0', block: false },
                                },
                              ],
                            },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'nodes' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'MenuItemFields' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'childItems' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'nodes' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'FragmentSpread',
                                                name: { kind: 'Name', value: 'MenuItemFields' },
                                              },
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'childItems' },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'nodes' },
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'FragmentSpread',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'MenuItemFields',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'childItems',
                                                            },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'nodes',
                                                                  },
                                                                  selectionSet: {
                                                                    kind: 'SelectionSet',
                                                                    selections: [
                                                                      {
                                                                        kind: 'FragmentSpread',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'MenuItemFields',
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MenuItemFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'MenuItem' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'label' } },
          { kind: 'Field', name: { kind: 'Name', value: 'uri' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'menuAcf' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'content' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fieldGroupName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'hidden' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ismegamenu' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'menuGeral' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'menuTextColor' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMenuQuery, GetMenuQueryVariables>
export const GetNewsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetNews' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          defaultValue: { kind: 'StringValue', value: '', block: false },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'news' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'idType' },
                value: { kind: 'EnumValue', value: 'URI' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'blocks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'nicename' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'seo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'readingTime' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'opengraphDescription' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'breadcrumbs' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'content' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'featuredImage' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'altText' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetNewsQuery, GetNewsQueryVariables>
export const GetEventsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetEvents' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          defaultValue: { kind: 'StringValue', value: '', block: false },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'events' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'idType' },
                value: { kind: 'EnumValue', value: 'URI' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'blocks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'nicename' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'seo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'readingTime' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'opengraphDescription' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'breadcrumbs' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'content' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'featuredImage' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'altText' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetEventsQuery, GetEventsQueryVariables>
export const GetDiseasesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetDiseases' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          defaultValue: { kind: 'StringValue', value: '', block: false },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'diseases' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'idType' },
                value: { kind: 'EnumValue', value: 'URI' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'blocks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'nicename' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'seo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'readingTime' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'opengraphDescription' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'breadcrumbs' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'content' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'featuredImage' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'altText' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetDiseasesQuery, GetDiseasesQueryVariables>
export const GetMembersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetMembers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          defaultValue: { kind: 'StringValue', value: '', block: false },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'idType' },
                value: { kind: 'EnumValue', value: 'URI' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'blocks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'nicename' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'seo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'readingTime' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'opengraphDescription' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'breadcrumbs' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'content' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'featuredImage' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'altText' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMembersQuery, GetMembersQueryVariables>
