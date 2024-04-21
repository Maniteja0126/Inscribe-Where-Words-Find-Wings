import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign  } from 'hono/jwt';
import { signInInput, signupInput } from "@maniteja2601/medium-blog";

export const userRouter = new Hono<{
	Bindings: {
		DATA_URL: string,
    JWT_SECRET: string,
	}
}>();

userRouter.post('signup' ,async(c)=>{

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATA_URL,
    }).$extends(withAccelerate())
  
   const body = await c.req.json();
   const {success} = signupInput.safeParse(body)
   if(!success){
    c.status(411)
    return c.json({
      message : "Invalid credentials" 
    })
   }
   try {
      const user = await prisma.user.create({
        data:{
          email:body.email,
          password : body.password,
          name : body.name
        }
      })
      const token =await sign({id: user.id} , c.env.JWT_SECRET);
      return c.json(token)
   } catch (error) {
    console.log("error : " ,error);
    return  c.text('Bad Request');
   }
  
  })
  
 userRouter.post('signin',async(c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATA_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json();
    const {success} = signInInput.safeParse(body);

    if(!success){
      c.status(411)
      return c.json({
        message : 'Invalid credentials'
      })
    }
  
    const user = await prisma.user.findFirst({
      where:{email: body.email}
    })
    if(!user){
      c.status(403)
      return c.json({msg : 'User not found'})
    }
    const jwt  = await sign({id:user.id} , c.env.JWT_SECRET)
    return c.json(jwt)
  })