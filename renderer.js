document.getElementById('start-test').addEventListener('click', () => {
    console.log('Button clicked: Sending IPC message to start Selenium test');
    window.electronAPI.startSeleniumTest();
  });