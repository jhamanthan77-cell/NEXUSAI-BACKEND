import express from "express";
import cors from "cors";
import chat from "./models/chat.js";
 const app= express();
 app.use(cors());
 app.use(express.json());
 //first api route / represents the root route of the application. When a GET request is made to this route, the server responds with a simple message "hello from nexusai backend". This is useful for testing if the server is running correctly and can handle requests.
 app.get("/", (req,res)=>{
    res.send("hello from nexusai backend")
 })


 //health check API
 app.get("/api/v1/health",(req,res)=>{
   res.status(200).json({
     success:true,
    message:"NexusAI backend is running fine",
    timestamp:new Date().toISOString(),
    status:"running"

    
   })
 })

 app.post("/api/v1/chat", async (req,res)=>{
    try{
      const{message}=req.body;
      if(typeof message !== "string" || !message.trim()){
        return res.status(400).json({
         success:false,
         message:"Message is required and cannot be empty"
        });
      }
      const newchat =await chat.create({
         userMessage:message,
         aiResponse:"AI integeration is coming soon"
      })
      res.status(201).json({
         success:true,
         message:"Chat message created successfully",
         data:newchat
      });
    }
    catch(error){
      console .error("Error is api/v1/chat route endpoint",error);
      res.status(500).json({
         success:false,
         message :"Failed to save chat"

      })
    }
 })


 app.get("/api/v1/chat",async(req,res)=>{
   try{
      const page= Math.max(1, parseInt(req.query.page) || 1);
      const limit= Math.min(100,Math.max(1, parseInt(req.query.limit) || 10));
      const totalchats=await chat.countDocuments();
      const totalPages=Math.ceil(totalchats/limit);
      if( totalPages>0&&page>totalPages){
         return res.status(400).json({
            success:false,
            message:"Page number exceeds total pages"
         })
      }
      const skip=(page-1)*limit;
      const chats=await chat.find().sort({createdAt:-1})
      .skip(skip)
      .limit(limit)
      res.status(200).json({
         success:true,
         data:chats,
         page:page,
         limit:limit,
         hasNextPage: page < totalPages,
         hasPreviousPage: page > 1,
         totalPages: totalPages,
          totalChats: totalchats

      });
   }
      catch(error){
         console.error("error in api/v1/chat route endpoint", error)
         res.status(500).json({
            success:false,
            message:"failed to fetch chat messages"
         })
      }
})
export default app;