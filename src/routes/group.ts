import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";

export const createGroup = createRoute({
  method: "post",
  path: "/group/create",
  request: {
    body: {
        content: {
          "multipart/form-data": {
            schema: z.object({
                name: z.string().min(5),
            }).openapi({example:{name:"group name"}})
          }
        }
      }
  },
  responses: {
    200: {
      content: {
        "application/json": {
              schema: z.object({
                  id: z.string().uuid(),
                  adminId:z.string(),
                  name: z.string(),
            status: z.string(),
            ok: z.boolean(),
            code: z.number(),
          }),
        },
      },
      description: "Group created Successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z
            .object({
              code: z.number(),
              message: z.string(),
            })
            .openapi({ example: { code: 400, message: "Internal Error" } }),
        },
      },
      description: "Error",
    },
  },
});


export const joinGroup = createRoute({
    method: "post",
    path: "/group/join/{id}",
    request: {
        params: z.object({id: z.string().uuid().openapi({example:"Group Id"})}),
    },
    responses: {
      200: {
        content: {
          "application/json": {
                schema: z.object({
              status: z.string(),
              ok: z.boolean(),
              code: z.number(),
            }),
          },
        },
        description: "You joined Successfully",
      },
      400: {
        content: {
          "application/json": {
            schema: z
              .object({
                code: z.number(),
                message: z.string(),
              })
              .openapi({ example: { code: 400, message: "Internal Error" } }),
          },
        },
        description: "Error",
      },
    },
  });

  
  export const exitGroup = createRoute({
    method: "delete",
    path: "/group/leave/{id}",
    request: {
        params: z.object({id: z.string().uuid().openapi({example:"Group Id"})}),
    },
    responses: {
      200: {
        content: {
          "application/json": {
                schema: z.object({
              status: z.string(),
              ok: z.boolean(),
              code: z.number(),
            }),
          },
        },
        description: "You leaved Successfully",
      },
      400: {
        content: {
          "application/json": {
            schema: z
              .object({
                code: z.number(),
                message: z.string(),
              })
              .openapi({ example: { code: 400, message: "Internal Error" } }),
          },
        },
        description: "Error",
      },
    },
  });

  
  export const deleteGroup = createRoute({
    method: "post",
    path: "/group/create",
    request: {
      body: {
          content: {
            "multipart/form-data": {
              schema: z.object({
                  name: z.string().min(5),
              }).openapi({example:{name:"group name"}})
            }
          }
        }
    },
    responses: {
      200: {
        content: {
          "application/json": {
                schema: z.object({
                    id: z.string().uuid(),
                    adminId:z.string(),
                    name: z.string(),
              status: z.string(),
              ok: z.boolean(),
              code: z.number(),
            }),
          },
        },
        description: "Blog Deleted Successfully",
      },
      400: {
        content: {
          "application/json": {
            schema: z
              .object({
                code: z.number(),
                message: z.string(),
              })
              .openapi({ example: { code: 400, message: "Internal Error" } }),
          },
        },
        description: "Error",
      },
    },
  });
  