
const { performLogin } = require("./login");
const { loadCookies } = require("./cookies");

const fs = require("fs");
const { initializeDriver } = require("../driver");


/**
 * Perform task based on the given parameter.
 * @param {string} task - The task to perform. Options: "connect", "followUp", "catchUp".
 */
async function performLeetcodeTask(task) {
  const driver = await initializeDriver();

  try {
    // Common: Load cookies or perform login
    if (fs.existsSync("cookies-leetcode.json")) {
      await loadCookies(driver);
      await driver.get("https://leetcode.com/accounts/login/");
    } else {
      await performLogin(driver);
    }

    // Task-specific logic
    switch (task) {
      

      default:
        console.error(
          "Invalid task parameter. Please provide one of: 'connect', 'followUp', 'catchUp'."
        );
    }
  } catch (error) {
    console.error("Error during processing:", error);
  } finally {
    // Uncomment the line below when you're ready to quit the driver
    // await driver.quit();
  }
}

module.exports = { performLeetcodeTask };
