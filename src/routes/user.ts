import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";

const userIdSchema = z.object({
  id: z
    .string()
    .min(1)
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1212121",
    }),
});

const ReqUserSchema = z
  .object({
    email: z.string().email(),
    name: z.string().optional(),
    password: z.string().min(4).max(14),
    posts: z.string().openapi({ type: "array", items: { type: "string" } }),
    groups: z.string().openapi({ type: "array", items: { type: "string" } }),
  })
  .openapi({ required: ["email", "password"] });

const ResUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  posts: z.array(z.any()).optional(),
  groups: z.array(z.any()).optional(),
});

const ErrorSchema = z.object({
  code: z.number().openapi({
    example: 400,
  }),
  message: z.string().openapi({
    example: "Bad Request",
  }),
});

export const homeRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ message: z.string().openapi({ example: "Home page" }) }),
        },
      },
      description: "Home URL",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Error",
    },
  },
});

export const getUser = createRoute({
  method: "get",
  path: "/users/{id}",
  request: {
    params: userIdSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResUserSchema,
        },
      },
      description: "Retrieve the user",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Error",
    },
  },
});


export const userLogin = createRoute({
  method: "post",
  path: "/user/login",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            email: z.string().email(),
            password: z.string().min(6).max(14),
            name: z.string().optional()
          }).openapi({example:{email:"example@example.com",password:"password",name:"name"}})
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            ok: z.boolean(),
            email: z.string().email(),
            name: z.string().optional(),
            status: z.string()
          })
        }
      },
      description:"Login successfull"
    },
    401: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.number(),
            message: z.string()
          })
        }
      },
      description:"Invalid Credentials"
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.number(),
            message: z.string()
          })
        }
      },
      description:"Internal Server Error"
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Bad Request",
    },

  }
})

export const userSignUp = createRoute({
  method: "post",
  path: "/user/signup",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            email: z.string().email(),
            password: z.string().min(6).max(14),
            name: z.string()
          }).openapi({example:{email:"example@example.com",password:"password",name:"name"}})
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            ok: z.boolean(),
            email: z.string().email(),
            name: z.string(),
            status: z.string()
          })
        }
      },
      description:"Signup successfull"
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.number(),
            message: z.string()
          })
        }
      },
      description:"Internal Server Error"
    },
    402: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.number(),
            message: z.string()
          })
        }
      },
      description:"Duplicate User"
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Bad Request",
    },

  }
})