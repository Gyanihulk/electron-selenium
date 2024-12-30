import React from 'react';


function App() {
  const startSeleniumTest = () => {
    window.electron.ipcRenderer.send('start-selenium-test');
  };

  return (
    <div>
      <h1>Electron + React App</h1>
      <button onClick={startSeleniumTest}>Run Selenium Test</button>
    </div>
  );
}

export default App;
