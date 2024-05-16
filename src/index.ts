import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { PrismaClient } from "@prisma/client/edge";
import { getUser, userSignUp, userLogin, homeRoute } from "./routes/user";
import { deleteBlog, getBlogById, getBlogs, postBlog, replaceBlog, updateBlog } from "./routes/blog";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";
// import { createGroup, exitGroup, joinGroup } from "./routes/group";

const app = new OpenAPIHono();

app.openapi(homeRoute,
  (c) => {
    return c.json({message:"Welcome to home route of our blogging application Kindly move to /ui to check all endpoints"})
  }
)

app.openapi(
  getUser,
  (c: any) => {
    const { id } = c.req.valid("param");
    return c.json({
      id,
      age: 20,
      name: "Ultra-man",
    });
  },
  // Hook
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
);

app.openapi(
  userSignUp,
  async(c) => {
    const { name, email, password } = c.req.valid("form");
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
      const existing = await prisma.user.findUnique({where:{email:email}});
      if (existing) return c.json({ code: 402, message: "User already exists" }, 402);

      const create = await prisma.user.create({data:{name, email, password}});
      if (!create) return c.json({ code: 500, message: "Internal server error" }, 500);
      return c.json({
        name,email,ok:true,status:"success",
      })
    } catch (error) {
      return c.json({ code: 400, "message": error })
    } finally {
      prisma.$disconnect()
    }
  },
  (result, c) => {
    if (!result.success) {
      console.log("bad req received");
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
)

app.openapi(userLogin,
  async(c) => {
    const { name, email, password } = c.req.valid("form");
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {

      const user =await prisma.user.findUnique({where:{email:email}});
      if (!user) return c.json({ code: 400, message: "User not found" }, 400);
      if (user?.password !== password) return c.json({ code: 401, message: "Invalid credentials" }, 401);
      
      const payload = { email: user.email, id:user.id}
      //@ts-ignore
      const token = await sign(payload, c.env?.JWT_SECRETE);
      const now = new Date();
      now.setDate(now.getDate() + 7);
      setCookie(c,"token",token,{httpOnly:true, secure:true, expires:now})
      return c.json({
        email,ok:true,status:"success",
      })

    } catch (error) {
      return c.json({ code: 400, "message": error })
    }finally {
      prisma.$disconnect()
    }
  },
  (result, c) => {
    if (!result.success) {
      console.log("bad req received");
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
)

app.openapi(getBlogs,
  async (c) => {
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
      const posts =await prisma.post.findMany({where:{published:true}});
      if (!posts) return c.json({ code: 400, message: "Posts not found" }, 400);
      
      return c.json({
        posts,
        ok: true,
        status: "success",
        code:200,
      },200)

    } catch (error) {
      return c.json({ code: 400, "message": error })
    }finally {
      prisma.$disconnect()
    }
  },
  (result, c) => {
    if (!result.success) {
      console.log("bad req received");
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
)

app.openapi(getBlogById,
  async (c) => {
    const { id } = c.req.valid("param");
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
      const posts = await prisma.post.findFirst({ where: { id: id } });
      if (!posts) return c.json({ code: 400, message: "Posts not found" }, 400);
      
      return c.json({
        ...posts,
        ok: true,
        status: "success",
        code: 200,
      },200)

    } catch (error) {
      return c.json({ code: 400, "message": error })
    }finally {
      prisma.$disconnect()
    }
  },
  (result, c) => {
    if (!result.success) {
      console.log("bad req received");
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
)

app.openapi(postBlog,
  async (c) => {
    const token = getCookie(c, "token");
    if (!token) return c.json({
      code: 401,
      message: "Unauthenticated user"
    }, 401);
    const { title, content, publish } = await c.req.json();
    
    //@ts-ignore
    const { email, id } = await verify(token, c.env?.JWT_SECRETE);
    console.log(email, title, content, publish, id);
    if (!(email&&id)) return c.json({
      code: 401,
      message: "Unauthenticated user denied"
    }, 401);
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
      //@ts-ignore
      const post =await prisma.post.create({data:{title,content,published:publish,authorId:id}});
      if (!post) return c.json({ code: 400, message: "User not found" }, 400);
      return c.json({
        ...post,ok:true,status:"success",code:200,
      })

    } catch (error) {
      return c.json({ code: 400, "message": error })
    } finally{
      prisma.$disconnect()
    }
  },
  (result, c) => {
    if (!result.success) {
      console.log("bad req received");
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
)

app.openapi(updateBlog,
  async (c) => {
    const token = getCookie(c, "token");
    if (!token) return c.json({
      code: 401,
      message: "Unauthenticated user"
    }, 401);
    const { id } = c.req.valid("param")
    console.log(id)
    const { title, content, publish } = await c.req.valid("form");
    //@ts-ignore
    const { email } = await verify(token, c.env?.JWT_SECRETE);
    if (!(email)) return c.json({
      code: 401,
      message: "Unauthenticated user denied"
    }, 401);
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
      //@ts-ignore
      const post = await prisma.post.update({ where: {id:id},data:{title,content,published:publish}});
      if (!post) return c.json({ code: 400, message: "User not found" }, 400);
      return c.json({
        ...post,ok:true,status:"success",code:200,
      })

    } catch (error) {
      return c.json({ code: 400, "message": error })
    } finally{
      prisma.$disconnect()
    }
  },
  (result, c) => {
    if (!result.success) {
      console.log("bad req received");
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
)

app.openapi(replaceBlog,
  async (c) => {
    const token = getCookie(c, "token");
    if (!token) return c.json({
      code: 401,
      message: "Unauthenticated user"
    }, 401);
    const { id } = c.req.valid("param")
    const { title, content, publish } = await c.req.json();
    //@ts-ignore
    const { email } = await verify(token, c.env?.JWT_SECRETE);
    if (!(email)) return c.json({
      code: 401,
      message: "Unauthenticated user denied"
    }, 401);
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
      //@ts-ignore
      const post = await prisma.post.update({ where: {id:id},data:{title,content,published:publish}});
      if (!post) return c.json({ code: 400, message: "User not found" }, 400);
      return c.json({
        ...post,ok:true,status:"success",code:200,
      })

    } catch (error) {
      return c.json({ code: 400, "message": error })
    } finally{
      prisma.$disconnect()
    }
  },
  (result, c) => {
    if (!result.success) {
      console.log("bad req received");
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
)

app.openapi(deleteBlog,
  async (c) => {
    const token = getCookie(c, "token");
    if (!token) return c.json({
      code: 401,
      message: "Unauthenticated user"
    }, 401);
    const { id } = c.req.valid("param")
    //@ts-ignore
    const { email } = await verify(token, c.env?.JWT_SECRETE);
    if (!(email)) return c.json({
      code: 401,
      message: "Unauthenticated user denied"
    }, 401);
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
      //@ts-ignore
      const post = await prisma.post.delete({ where: {id:id}});
      if (!post) return c.json({ code: 400, message: "User not found" }, 400);
      return c.json({
        ok:true,status:"success",code:200,
      })

    } catch (error) {
      return c.json({ code: 400, "message": error })
    } finally{
      prisma.$disconnect()
    }
  },
  (result, c) => {
    if (!result.success) {
      console.log("bad req received");
      return c.json(
        {
          code: 400,
          message: "Validation Error",
        },
        400
      );
    }
  }
)

// app.openapi(createGroup,
//   async (c) => {
//     const token = getCookie(c, "token");
//     const { name } = c.req.valid("form");
//     if (!token) return c.json({
//       code: 401,
//       message: "Unauthenticated user"
//     }, 401);
//     //@ts-ignore
//     const { email, id } = await verify(token, c.env?.JWT_SECRETE);
//     if (!(email)) return c.json({
//       code: 401,
//       message: "Unauthenticated user denied"
//     }, 401);
//     const prisma = new PrismaClient({
//       //@ts-ignore
//       datasourceUrl: c.env?.DATABASE_URL,
//     }).$extends(withAccelerate());
//     try {
//       //@ts-ignore
//       const group = await prisma.group.create({ data:{name,adminId:id, members:{create:{userId:id}}}});
//       if (!group) return c.json({ code: 400, message: "User not found" }, 400);
//       return c.json({
//         ...group,ok:true,status:"success",code:200,
//       })

//     } catch (error) {
//       return c.json({ code: 400, "message": error })
//     } finally{
//       prisma.$disconnect()
//     }
//   },
//   (result, c) => {
//     if (!result.success) {
//       console.log("bad req received");
//       return c.json(
//         {
//           code: 400,
//           message: "Validation Error",
//         },
//         400
//       );
//     }
//   }
// )

// app.openapi(joinGroup,
//   async (c) => {
//     const token = getCookie(c, "token");
//     const { id } = c.req.valid("param")
//     if (!token) return c.json({
//       code: 401,
//       message: "Unauthenticated user"
//     }, 401);
//     //@ts-ignore
//     const user = await verify(token, c.env?.JWT_SECRETE);
//     if (!(user.email)) return c.json({
//       code: 401,
//       message: "Unauthenticated user denied"
//     }, 401);
//     const prisma = new PrismaClient({
//       //@ts-ignore
//       datasourceUrl: c.env?.DATABASE_URL,
//     }).$extends(withAccelerate());
//     try {

      
//       const dup = await prisma.membership.findFirst({ where: { userId: user.id, groupId: id } });
//       if(dup) return c.json({code:400, message:"You are already a member"})
//       //@ts-ignore
//       const group = await prisma.membership.create({ data:{userId: user.id, groupId: id}});
//       if (!group) return c.json({ code: 400, message: "User not found" }, 400);
//       return c.json({
//         ...group,ok:true,status:"success",code:200,
//       })

//     } catch (error) {
//       return c.json({ code: 400, "message": error })
//     } finally{
//       prisma.$disconnect()
//     }
//   },
//   (result, c) => {
//     if (!result.success) {
//       console.log("bad req received");
//       return c.json(
//         {
//           code: 400,
//           message: "Validation Error",
//         },
//         400
//       );
//     }
//   }
// )

// app.openapi(exitGroup,
//   async (c) => {
//     try {
//       const token = getCookie(c, "token");


//       if (!token) return c.json({
//         code: 401,
//         message: "Unauthenticated user"
//       }, 401);

//       //@ts-ignore
//       const user = await verify(token, c.env?.JWT_SECRETE);

//       if (!(user.email)) return c.json({
//         code: 401,
//         message: "Unautharized user denied"
//       }, 401);

//       const prisma = new PrismaClient({
//         //@ts-ignore
//         datasourceUrl: c.env?.DATABASE_URL,
//       }).$extends(withAccelerate());

//       try {
//         const { id } = c.req.valid("param");

//         const group = await prisma.group.findFirst({ where: { id } });

//         if (!group) return c.json({ code: 400, message: "Group not found" }, 400);

//         if (group.adminId === user.id) {
//           const members = await prisma.membership.findMany({ where: { groupId: id } });

//         if (members.length > 1) {
//           return c.json({ code: 400, message: "Admin cannot leave group before others" });
//         }
//           await prisma.membership.deleteMany({ where: { groupId: id } });
//           await prisma.group.delete({ where: { id } });
//           return c.json({ code: 200, message: "Group deleted successfully" });
//         }

//         await prisma.group.update({ where: { id:id },data:{members:{delete:{userId:user.id}}} });

//       } catch (error) {
//         console.error("Error:", error); // Debug: Log error
//         return c.json({ code: 500, message: "Internal Server Error" }, 500);
//       } finally {
//         await prisma.$disconnect();
//       }
//     } catch (error) {
//       console.error("Error:", error); // Debug: Log error
//       return c.json({ code: 500, message: "Internal Server Error" }, 500);
//     }
//   },
//   (result, c) => {
//     if (!result.success) {
//       console.log("Bad request received");
//       return c.json({ code: 400, message: "Validation Error" }, 400);
//     }
//   }
// );




// The OpenAPI documentation will be available at /doc
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

// Use the middleware to serve Swagger UI at /ui
app.get("/ui", swaggerUI({ url: "/doc" }));

export default app;
