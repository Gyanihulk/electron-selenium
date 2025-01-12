const { initializeDriver } = require("./driver");
const { performLogin } = require("./login");
const { loadCookies } = require("./cookies");
const { navigateToMyNetwork, navigateToMyCatchUp } = require("./navigation");
const { connectWithFirst15People } = require("./connect");
const fs = require("fs");
const { followUpNewlyConnectedConnections } = require("./followUpConnections");
const { catchUpWithFirst15People } = require("./catchUp");
const { withdrawConnections } = require("./withdrawConnections");
const { scrapePosts } = require("./feed");

/**
 * Perform task based on the given parameter.
 * @param {string} task - The task to perform. Options: "connect", "followUp", "catchUp".
 */
async function performTask(task) {
    const driver = await initializeDriver();

    try {
        // Common: Load cookies or perform login
        if (fs.existsSync("cookies.json")) {
            await loadCookies(driver);
            await driver.get("https://www.linkedin.com/feed");
        } else {
            await performLogin(driver);
        }

        // Task-specific logic
        switch (task) {
            case "connect":
                await navigateToMyNetwork(driver);
                await connectWithFirst15People(driver);
                break;

            case "followUp":
                await followUpNewlyConnectedConnections(driver);
                break;

            case "catchUp":
                await navigateToMyCatchUp(driver);
                await catchUpWithFirst15People(driver);
                break;
            case "fetchPosts":
                await scrapePosts(driver)
                // await withdrawConnections(driver);
                break;
            case "withdraw":
               
                await withdrawConnections(driver);
                break;

            
            default:
                console.error("Invalid task parameter. Please provide one of: 'connect', 'followUp', 'catchUp'.");
        }
    } catch (error) {
        console.error("Error during processing:", error);
    } finally {
        // Uncomment the line below when you're ready to quit the driver
        // await driver.quit();
    }
}

module.exports = { performTask };
