import React from 'react';


function App() {
  const sendNewConnectionRequests = () => {
    window.electron.ipcRenderer.send('send-connection-request');
  };
  const followUpNewConnectionRequests = () => {
    window.electron.ipcRenderer.send('follow-up-new-connection');
  };
  const catchUpNewConnections = () => {
    window.electron.ipcRenderer.send('catch-up-connections');
  };
  return (
    <div>
      <h1>Electron + React App</h1>
      <button onClick={sendNewConnectionRequests}>Send Connection Requests</button>
      <button onClick={followUpNewConnectionRequests}>Follow up New Connection Requests</button>
      <button onClick={catchUpNewConnections}>Catch Up Connections </button>
    </div>
  );
}

export default App;
