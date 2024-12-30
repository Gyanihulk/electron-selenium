// selenium/navigation.js
const { By, until } = require("selenium-webdriver");

async function navigateToMyNetwork(driver) {
    try {
        await driver.get("https://www.linkedin.com/mynetwork/");
        await driver.wait(until.elementLocated(By.css("div[data-view-name='cohort-card']")), 10000);
    } catch (error) {
        console.error("Error navigating to My Network:", error);
    }
}
async function navigateToMyCatchUp(driver) {
    try {
        // Navigate to the My Network page
        await driver.get("https://www.linkedin.com/mynetwork/catch-up/all/");

        // Wait for a specific element in My Network to ensure the page is loaded
        await driver.wait(until.elementLocated(By.css("div[data-view-name='nurture-card']")), 10000);
    } catch (error) {
        console.error("Error navigating to My Network:", error);
    }
}
module.exports = { navigateToMyNetwork,navigateToMyCatchUp };
