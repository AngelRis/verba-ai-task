const express=require('express');
const cors=require('cors');
const app=express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

const mockResponses={
    hello:"Hello! How can I assist you today?",
    date:`Today: ${new Date().toLocaleDateString()}`,
    bye:"Bye! Have a great day!",
    default:"How can I help?"
};

function getResponse(message){
    const words=message
    .toLowerCase()
    .replace(/[^\w\s]/g,"")
    .split(" ");

    for(const word of words) {
        if(mockResponses[word]){
            return mockResponses[word];
        } 
    }
    return mockResponses.default;
}
app.post('/api/chat',(req,res)=>{
    try{
    const message=req.body.message;
    if(!message){
        return res.status(400).json({
            error:'Message is required!'
        })
    }
    const response=getResponse(req.body.message);
    setTimeout(()=>{
       res.json({
        answer:response,
        timestamp:new Date().toISOString()
       }); 
    },2000);
    }
    catch(err){
        res.status(500).json({
            error:err
        })
    }

})
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));