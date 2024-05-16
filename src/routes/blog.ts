import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";

export const getBlogs = createRoute({
  method: "get",
  path: "/blogs",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            posts: z.array(z.any()).optional(),
            status: z.string(),
            ok: z.boolean(),
            code: z.number(),
          })
        },
      },
      description: "All Blogs",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.number(),
            message:z.string()
          }).openapi({example:{code:400, message:"Internal Error"}}),
        },
      },
      description: "Error",
    },
  },
})

export const getBlogById = createRoute({
  method: "get",
  path: "/blogs/{id}",
  request: {
    params: z.object({
      id: z
        .string()
        .uuid(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            id: z.string().uuid(),
            title: z.string(),
            content: z.string(),
            published: z.boolean(),
            authorId: z.string(),
            status: z.string(),
            ok: z.boolean(),
            code: z.number(),
            
          }),
        },
      },
      description: "Blog Found",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.number(),
            message:z.string()
          }).openapi({example:{code:400, message:"Internal Error"}}),
        },
      },
      description: "Error",
    },
  },
});

export const postBlog = createRoute({
  method: "post",
  path: "/blogs/create",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            title: z.string(),
            content: z.string(),
            publish: z.boolean(),
          })
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
            title: z.string(),
            content: z.string(),
            published: z.boolean(),
            authorId: z.string(),
            status: z.string(),
            ok: z.boolean(),
            code: z.number(),
          }),
        },
      },
      description: "Blog Created Successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.number(),
            message:z.string()
          }).openapi({example:{code:400, message:"Internal Error"}}),
        },
      },
      description: "Error",
    },
  },
});

export const updateBlog = createRoute({
  method: "patch",
  path: "/blogs/update/{id}",
  request: {
    params: z.object({id: z.string().uuid()}),
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            title: z.string().nullable(),
            content: z.string().nullable(),
            publish: z.boolean().nullable(),
          })
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
            title: z.string(),
            content: z.string(),
            published: z.boolean(),
            authorId: z.string(),
            status: z.string(),
            ok: z.boolean(),
            code: z.number(),
          }),
        },
      },
      description: "Blog Updated Successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.number(),
            message:z.string()
          }).openapi({example:{code:400, message:"Internal Error"}}),
        },
      },
      description: "Error",
    },
  },
});

export const replaceBlog = createRoute({
  method: "put",
  path: "/blogs/replace/{id}",
  request: {
    params: z.object({id: z.string().uuid()}),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            title: z.string(),
            content: z.string(),
            publish: z.boolean(),
          })
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
            title: z.string(),
            content: z.string(),
            published: z.boolean(),
            authorId: z.string(),
            status: z.string(),
            ok: z.boolean(),
            code: z.number(),
          }),
        },
      },
      description: "Blog Replaced Successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.number(),
            message:z.string()
          }).openapi({example:{code:400, message:"Internal Error"}}),
        },
      },
      description: "Error",
    },
  },
});

export const deleteBlog = createRoute({
  method: "delete",
  path: "/blogs/delete/{id}",
  request: {
    params: z.object({id: z.string().uuid()}),
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
      description: "Blog Deleted Successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.number(),
            message:z.string()
          }).openapi({example:{code:400, message:"Internal Error"}}),
        },
      },
      description: "Error",
    },
  },
});