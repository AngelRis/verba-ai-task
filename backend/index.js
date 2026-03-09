const express=require('express');
const cors=require('cors');
const app=express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
require('dotenv').config();


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

async function getGeminiResponse(message) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: message }
            ]
          }
        ]
      })
    }
  );

  const data= await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
}


app.post('/api/chat',async (req,res)=>{
    try{
    const message=req.body.message;
    if(!message){
        return res.status(400).json({
            error:'Message is required!'
        })
    }
    const response=await getGeminiResponse(message);
    res.json({
        answer:response,
        timestamp:new Date().toISOString()
    }); 
    }
    catch(err){
        res.status(500).json({
            error:err
        })
    }

})
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));