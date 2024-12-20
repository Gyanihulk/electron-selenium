const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;

async function initializeDriver() {
    const service = new chrome.ServiceBuilder(path).build();

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

async function performTask() {
    try {
        let driver = await initializeDriver();
        await driver.get('https://www.google.com');
        console.log('Page Title:', await driver.getTitle());

        // Wait for demonstration
        await driver.sleep(3000);
    } catch (error) {
        console.error('Selenium error:', error);
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}

module.exports = { performTask };