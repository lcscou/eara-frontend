import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetPagesWithBlockQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPagesWithBlockQuery = { __typename?: 'RootQuery', pages?: { __typename?: 'RootQueryToPageConnection', nodes: Array<{ __typename?: 'Page', title?: string | null, id: string, uri?: string | null, blocks?: any | null }> } | null };


export const GetPagesWithBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPagesWithBlock"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}}]}}]}}]}}]} as unknown as DocumentNode<GetPagesWithBlockQuery, GetPagesWithBlockQueryVariables>;