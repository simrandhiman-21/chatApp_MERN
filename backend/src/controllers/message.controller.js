import User from "../models/user.model.js"
export const getUserForSidebar=async(req,res)=>{
    try{
        const loggedInUserId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar: ",error.message);
        res.status(500).json({ message: "Error fetching users" });        
    }
}

export const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params; //other user 
        const myId=req.user._id;  //current user autherised

        const messages=await MessageChannel.find({
            $or: [
                { sender: myId, receiver: userToChatId },
                { sender: userToChatId, receiver: myId }
                ],
        })
        res.send(200).json(messages);        
    } catch (error) {
        console.log("Error in getMessages controller : ",error.message);
        res.status(500).json({ message: "Internal server error" });        
    }
}

export const sentMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=new MessageChannel({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })
        await newMessage.save();

        //todo: realtime functionality goes here -socket.io
        res.status(201).json({newMessage });

    } catch (error) {
        console.log("Error in sentMessage controller : ",error.message);
        res.status(500).json({ message: "Internal server error" });        
    }
}