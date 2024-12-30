const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;

async function initializeDriver() {
    const service = new chrome.ServiceBuilder(path);
console.log(service,"service")
    let options = new chrome.Options();
    options.addArguments('--no-sandbox');

    // Set service and options in driver builder 
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(service) // Properly integrate service into the builder
        .build();

    return driver;
}

module.exports={initializeDriver}