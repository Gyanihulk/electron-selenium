// selenium/index.js
const { initializeDriver } = require("./driver");
const { performLogin } = require("./login");
const { loadCookies } = require("./cookies");
const { navigateToMyNetwork, navigateToMyCatchUp } = require("./navigation");
const { connectWithFirst15People } = require("./connect");
const fs = require("fs");
const { extractConnections } = require("./followUpConnections");
const { catchUpWithFirst15People } = require("./catchUp");

async function performTask() {
    const driver = await initializeDriver();

    try {
        if (fs.existsSync("cookies.json")) {
            await loadCookies(driver);
            await driver.get("https://www.linkedin.com/feed");
        } else {
            await performLogin(driver);
        }

        // await navigateToMyNetwork(driver);
        // await connectWithFirst15People(driver);


        // await extractConnections(driver);

        await navigateToMyCatchUp(driver)
        await catchUpWithFirst15People(driver);
    } catch (error) {
        console.error("Error during processing:", error);
    } finally {
        // Uncomment the line below when you're ready to quit the driver
        // await driver.quit();
    }
}

module.exports = { performTask };
