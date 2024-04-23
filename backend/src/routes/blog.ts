import { Hono } from 'hono'
import {  decode, verify } from 'hono/jwt';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createBlogInput,updateBlogInput } from '@maniteja2601/medium-blog';


export const blogRouter = new Hono<{
	Bindings: {
		DATA_URL: string,
        JWT_SECRET: string,
	},
    Variables :{
        userId : string
    }
}>();



blogRouter.use('/*', async (c, next) => {
    
    const token = c.req.header("Authorization") || "";
    const user = await verify(token, c.env.JWT_SECRET);
    if (user) {
        c.set("userId", user.id);
        await next();
    }
    else {
        c.status(404)
        return c.json({ "message": "user not found" })
    }

})


blogRouter.post('/',async(c)=>{

    const body = await c.req.json();
    const authorId = c.get("userId");
    const {success} = createBlogInput.safeParse(body);

    if(!success){
        c.status(411)
        return c.json({
            message : "Invalid credentials"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATA_URL,
      }).$extends(withAccelerate())

    const blog = await prisma.post.create({
         data:{
            title : body.title,
            content : body.content,
            authorId : authorId
        }
    })
    return c.json({
        id:blog.id
    })
  })
  

blogRouter.put('/',async(c)=>{
    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);

    if(!success){
        c.status(411)
        return c.json({
            message : 'Invalid credentials'
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATA_URL,
      }).$extends(withAccelerate())

    const blog = await prisma.post.update({
        where : {id : body.id},
        data:{
            title : body.title,
            content : body.content
        }
    })
    return c.json({
        id:blog.id
    })
})


blogRouter.get('/bulk/myblogs', async (c) => {


    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATA_URL,
    }).$extends(withAccelerate())

    const authorId = c.get("userId");
    try {
        const posts = await prisma.post.findMany({
            where: {
                id: authorId
            },
            select: {
                // Date: true,
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return c.json({ posts })
    } catch (error) {
        c.status(404);
        return c.json({ "msg": "error while fetching posts" })
    }
})


blogRouter.get('/bulk',async(c)=>{

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATA_URL,
    }).$extends(withAccelerate())

    const pageSize = 10;
    const page  = 1;

    const skip = (page - 1) * pageSize;

    const blogs = await prisma.post.findMany({
        select:{
            id:true,
            content : true,
            title:true,
            author:{
                select:{
                    name : true
                }
            }
        },
        skip,
        take:pageSize
    });

    return c.json({blogs})

})

blogRouter.get('/:id' ,async(c)=>{
    const id = c.req.param("id");

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATA_URL,
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.post.findFirst({
            where :{id: id},
            select:{
                id:true,
                title:true,
                content : true,
                author : {
                    select : {
                        name:true
                    }
                }
            }
        })
        return c.json({
            blog
        })
    } catch (error) {
        c.status(411)
        return c.json({
            message : 'Error while fetching blog post'
        })
    }
})

blogRouter.delete('/:id' , async(c)=>{
    const id = c.req.param("id");

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATA_URL,
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.post.delete({
            where :{id: id},
        })
        return c.json({
            id:blog
        })
    } catch (error) {
        c.status(411)
        return c.json({
            message : 'Error while deleting'
        })
    }
})




