import { useEffect, useState } from 'react'
import { getOwner } from './api/owner'
import './App.css'

function App() {
  const [owner, setOwner] = useState<any>(null);

  useEffect(() => {
    getOwner()
      .then(data => { console.log("OWNER DATA:", data); setOwner(data); }) .catch(err => { console.error("FETCH ERROR:", err); }); }, []);

  return (
      <div style={{ padding: 20}}>
        <h1>Owner data</h1>

        {!owner && <p>Loading...</p>}
        
        {owner && (
        <pre>{JSON.stringify(owner, null, 2)}</pre>
        )}
      </div>
  );
}

export default App
