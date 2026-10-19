import express from "express";
import cors from "cors";
import chat from "./models/chat.js";
import mongoose from "mongoose";
import generateAIResponse from "./service/ai_service.js";
import authRouter from "../routes/auth.js";
 const app= express();
 app.use(cors());
 app.use(express.json());
 app.use ("/api/v1/auth", authRouter);
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
      //validate user message
      const{message}=req.body;
      if(typeof message !== "string" || !message.trim()){
        return res.status(400).json({
         success:false,
         message:"Message is required and cannot be empty"
        });
      }
      //generate AI response
      const aiResponse=await generateAIResponse(message);
//save chat message and AI response to database

      const newchat =await chat.create({
         userMessage:message,
         aiResponse:aiResponse
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
         message :"Failed to save chat and generate AI response"
         

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


//delete chat message by id
app.delete("/api/v1/chat/:id", async(req,res)=>{
   try{
      const UserID=req.params.id;
      // const {id}=req.params; is same as const UserID=req.params.id;
      //validate mongoose object id
      if(!mongoose.Types.ObjectId.isValid(UserID)){
         return res.status(400).json({
            success:false,
            message:"Invalid chat ID"
         });
      }  
               
const DeletedChat= await chat.findByIdAndDelete(UserID);
// if chat does not exist
if(!DeletedChat){
   return res.status(404).json({
      success:false,
      message:"chat not found"

         });
      
   }
   // if chat delete 
   return res.status(200).json ({
      success:true,
      message:"chat delete successfully",
      data:DeletedChat
   })
} catch(error){
   console.log("Error deleting chat:", error);
   return res.status(500).json ({
      success:false,
      message:"failed to delete chat"
   })
   
}
})



//
app.patch("/api/v1/chat/:id", async(req,res)=>{

   try {
      //to get user id:
      const UserId=req.params.id;
      // to get usermessage;
      const{userMessage}=req.body;
      // to validate id
      if(!mongoose.Types.ObjectId. isValid(UserId)){
         return res.status(400).json({
            success:false,
            message:"invalid chat Id"
         });
      }
        //message validdate 
         if(typeof userMessage!=="string"|| !userMessage.trim()){
         return res.status(400).json({
            success:false,
            message:"User message is required"
         });
         }
        const aiResponse = await generateAIResponse(userMessage.trim());
         //message updation
         const updatedChat = await chat.findByIdAndUpdate(
      UserId,
      { userMessage: userMessage.trim(), 
         aiResponse: aiResponse
      },
      {
         returnDocument:"after",
         runValidators:true
      }
    );
    //chat not found
    if(!updatedChat){
      return res.status(404).json({
         success:false,
         message:"chat not found"
      })
    }
    //success updation
return res.status(200).json({
   success:true,
   message:"chat updated successfully",
   data:updatedChat
})
      
      
   } catch (error) {
      console.log("Error in updating the chat",error)
      return res.status(500).json({
         success:false,
         message:"failed to update the chat"
      })
      
   }
})


// Search API with Pagination
app.get("/api/v1/chat/search", async (req, res) => {
    try {
        // 1. Get keyword
        const keyword = req.query.keyword;

        if (typeof keyword !== "string" || !keyword.trim()) {
            return res.status(400).json({
                success: false,
                message: "Keyword is required"
            });
        }

        // 2. Get pagination values
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit) || 10)
        );

        // 3. Create search query
        const searchQuery = {
            $or: [
                {
                    userMessage: {
                        $regex: keyword.trim(),
                        $options: "i"
                    }
                },
                {
                    aiResponse: {
                        $regex: keyword.trim(),
                        $options: "i"
                    }
                }
            ]
        };

        // 4. Count all matching chats
        const totalChats = await chat.countDocuments(searchQuery);

        // 5. Calculate total pages
        const totalPages = Math.ceil(totalChats / limit);

        // 6. Validate requested page
        if (totalPages > 0 && page > totalPages) {
            return res.status(400).json({
                success: false,
                message: "Page number exceeds total pages"
            });
        }

        // 7. Calculate skip
        const skip = (page - 1) * limit;

        // 8. Fetch matching chats for this page
        const chats = await chat.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // 9. Send response
        return res.status(200).json({
            success: true,
            data: chats,
            page: page,
            limit: limit,
            totalChats: totalChats,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        });

    } catch (error) {
        console.error("Error in searching data:", error);

        return res.status(500).json({
            success: false,
            message: "Error in searching data"
        });
    }
});


export default app;