import { NextApiHandler } from "next";
import { Fetcher, SWRResponse } from "swr";
import ___pages_api_discussions_categories from "../pages/api/discussions/categories";
import ___pages_api_discussions_index from "../pages/api/discussions/index";
import ___pages_api_file_byTitle__title_ from "../pages/api/file/byTitle/[title]";
import ___pages_api_file_byId__id_ from "../pages/api/file/byId/[id]";
import ___pages_api_file_byCite__cite_ from "../pages/api/file/byCite/[cite]";
import ___pages_api_file_byName__name_ from "../pages/api/file/byName/[name]";
import ___pages_api_file_bySlug__slug_ from "../pages/api/file/bySlug/[slug]";
import ___pages_api_testql from "../pages/api/testql";
import ___pages_api_auth_jwt from "../pages/api/auth/jwt";
import ___pages_api_auth_gha from "../pages/api/auth/gha";
import ___pages_api_auth_____nextauth_ from "../pages/api/auth/[...nextauth]";
import ___pages_api_auth_goodemail from "../pages/api/auth/goodemail";
import ___pages_api_meta_byTitle__title_ from "../pages/api/meta/byTitle/[title]";
import ___pages_api_meta_byId__id_ from "../pages/api/meta/byId/[id]";
import ___pages_api_meta_byCite__cite_ from "../pages/api/meta/byCite/[cite]";
import ___pages_api_diff_____slug_ from "../pages/api/diff/[...slug]";
import ___pages_api_compare_____slug_ from "../pages/api/compare/[...slug]";
import ___pages_api_getModifiedFiles_____slug_ from "../pages/api/getModifiedFiles/[...slug]";


type InferNextApiHandlerResponseType<T extends NextApiHandler> =
  T extends NextApiHandler<infer U> ? U : never;

declare module "swr" {
  export interface SWRHook {

    <Error = any>(
      key: "/api/discussions/categories",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_discussions_categories>,
        "/api/discussions/categories"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_discussions_categories>,
      Error
    >;

    <Error = any>(
      key: "/api/discussions/index",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_discussions_index>,
        "/api/discussions/index"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_discussions_index>,
      Error
    >;

    <Error = any>(
      key: "/api/file/byTitle/[title]",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_file_byTitle__title_>,
        "/api/file/byTitle/[title]"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_file_byTitle__title_>,
      Error
    >;

    <Error = any>(
      key: "/api/file/byId/[id]",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_file_byId__id_>,
        "/api/file/byId/[id]"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_file_byId__id_>,
      Error
    >;

    <Error = any>(
      key: "/api/file/byCite/[cite]",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_file_byCite__cite_>,
        "/api/file/byCite/[cite]"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_file_byCite__cite_>,
      Error
    >;

    <Error = any>(
      key: "/api/file/byName/[name]",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_file_byName__name_>,
        "/api/file/byName/[name]"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_file_byName__name_>,
      Error
    >;

    <Error = any>(
      key: "/api/file/bySlug/[slug]",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_file_bySlug__slug_>,
        "/api/file/bySlug/[slug]"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_file_bySlug__slug_>,
      Error
    >;

    <Error = any>(
      key: "/api/testql",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_testql>,
        "/api/testql"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_testql>,
      Error
    >;

    <Error = any>(
      key: "/api/auth/jwt",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_auth_jwt>,
        "/api/auth/jwt"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_auth_jwt>,
      Error
    >;

    <Error = any>(
      key: "/api/auth/gha",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_auth_gha>,
        "/api/auth/gha"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_auth_gha>,
      Error
    >;

    <Error = any>(
      key: "/api/auth/[...nextauth]",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_auth_____nextauth_>,
        "/api/auth/[...nextauth]"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_auth_____nextauth_>,
      Error
    >;

    <Error = any>(
      key: "/api/auth/goodemail",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_auth_goodemail>,
        "/api/auth/goodemail"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_auth_goodemail>,
      Error
    >;

    <Error = any>(
      key: "/api/meta/byTitle/[title]",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_meta_byTitle__title_>,
        "/api/meta/byTitle/[title]"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_meta_byTitle__title_>,
      Error
    >;

    <Error = any>(
      key: "/api/meta/byId/[id]",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_meta_byId__id_>,
        "/api/meta/byId/[id]"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_meta_byId__id_>,
      Error
    >;

    <Error = any>(
      key: "/api/meta/byCite/[cite]",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_meta_byCite__cite_>,
        "/api/meta/byCite/[cite]"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_meta_byCite__cite_>,
      Error
    >;

    <Error = any>(
      key: "/api/diff/[...slug]",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_diff_____slug_>,
        "/api/diff/[...slug]"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_diff_____slug_>,
      Error
    >;

    <Error = any>(
      key: "/api/compare/[...slug]",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_compare_____slug_>,
        "/api/compare/[...slug]"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_compare_____slug_>,
      Error
    >;

    <Error = any>(
      key: "/api/getModifiedFiles/[...slug]",
      fetcher?: Fetcher<
        InferNextApiHandlerResponseType<typeof ___pages_api_getModifiedFiles_____slug_>,
        "/api/getModifiedFiles/[...slug]"
      >
    ): SWRResponse<
      InferNextApiHandlerResponseType<typeof ___pages_api_getModifiedFiles_____slug_>,
      Error
    >;
  }
}
