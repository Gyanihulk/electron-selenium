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
  const withdrawConnections = () => {
    window.electron.ipcRenderer.send('withdraw-connections');
  };
  const scrapePosts = () => {
    window.electron.ipcRenderer.send('fetch-posts');
  };
  return (
    <div>
      <h1>Electron + React App</h1>
      <button onClick={sendNewConnectionRequests}>Send Connection Requests + Follow up New Connection Requests Catch Up Connections </button>
      <button onClick={followUpNewConnectionRequests}>Follow up New Connection Requests</button>
      <button onClick={catchUpNewConnections}>Catch Up Connections </button>
      <button onClick={scrapePosts}>Add comment and like posts </button>
      <button onClick={withdrawConnections}>withdraw connections</button>
    </div>
  );
}

export default App;
