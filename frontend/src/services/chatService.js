const API_BASE_URL='http://localhost:3001';

export const sendMessage = async(message) => {
  const response=await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({message})
  });
  return response.json();
};
