import { useState, useEffect, useRef } from 'react';
import { sendMessage } from './services/chatService';
import send from './assets/send.png';
import wait from './assets/wait.png';
import ai from './assets/ai.png';
import './App.css';

function App() {
  const [messages, setMessages]=useState([]);
  const [input, setInput]=useState('');
  const [loading, setLoading]=useState(false);
  const messagesEndRef=useRef(null);
  const [isInitialized, setIsInitialized]=useState(false);

  useEffect(() =>{
    if(isInitialized) return;
    
    try{
      const saved=localStorage.getItem('chatMessages');
      if(saved) {
        setMessages(JSON.parse(saved));
      }else{
        const welcomeMessage={
        role: 'ai', 
        content: 'Hello! How can I help you?', 
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      }
    } catch (e){
      console.log('No saved messages');
    } finally{
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() =>{
    if(!isInitialized) return;
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages, isInitialized]);


  useEffect(() =>{
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  
  const handleSend=async() =>{
    if(!input.trim() || loading) return;

    const userMessage={role: 'user', content: input, timestamp: new Date().toISOString()};
    setMessages(prev=> [...prev, userMessage]);
    const oldInput=input;
    setInput('');
    setLoading(true);

    try {
      const data=await sendMessage(oldInput);
      
      if(data.error) {
        setMessages(prev=> [...prev, {role: 'ai', content: data.error, timestamp: new Date().toISOString()}]);
      } else {
        setMessages(prev=> [...prev, {role: 'ai', content: data.answer, timestamp: data.timestamp}]);
      }
    } catch (err) {
      setMessages(prev=> [...prev, {role: 'ai', content: 'Server error. Try again!', timestamp: new Date().toISOString()}]);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header"><img src={ai}></img><p>Verba AI</p></div>
        <div className="messages">
          {messages.map((msg, i)=> (
            <div key={i} className={`message ${msg.role}`}>
              <div className="content">{msg.content}</div>
              <div className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString('mk-MK')}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message ai">
              <div className="content">
                Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-container">
          <input
            value={input}
            onChange={(e)=> setInput(e.target.value)}
            onKeyPress={(e)=> e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? <img className='icon' src={wait}></img> : <img className='icon' src={send}></img> }
          </button>
        </div>
      </div>
    </div>
  
  );
}

export default App;
