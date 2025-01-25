// selenium/login.js
const { By, until } = require("selenium-webdriver");
const { saveCookies } = require("./cookies");
require("dotenv").config();

const email = process.env.LEETCODE_EMAIL;
const password = process.env.LEETCODE_PASSWORD;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function openLeetCode(driver) {
    await driver.get("https://leetcode.com/accounts/login/");
}

async function performLogin(driver) {
    try {
        // Open the LeetCode login page
        await openLeetCode(driver);

        // Wait for the email field to be present in the DOM
        const emailField = await driver.wait(until.elementLocated(By.css('input[name="login"]')), 15000);
        await emailField.sendKeys(email);

        // Wait for the password field to be present in the DOM
        const passwordField = await driver.wait(until.elementLocated(By.css('input[name="password"]')), 15000);
        await passwordField.sendKeys(password);

        // // Wait for the iframe to be present
        // const iframe = await driver.wait(until.elementLocated(By.tagName("iframe")), 15000);
        // console.log("Iframe found. Please manually click the checkbox...");

        // Introduce a manual delay to give you time to click the checkbox
        await delay(15000); // 15 seconds delay

        // // Switch back to the main content after the manual interaction
        // await driver.switchTo().defaultContent();
        // console.log("Resuming after manual checkbox click...");

        // Wait for the login button to become enabled
        const loginButton = await driver.wait(until.elementLocated(By.id("signin_btn")), 15000);
        await driver.wait(until.elementIsEnabled(loginButton), 15000);

        console.log("Clicking the login button...");
        await loginButton.click();

      
        console.log("Login successful!");

        // Save cookies after successful login
        await saveCookies(driver);
    } catch (error) {
        console.error("Error during login process:", error);
    }
}

module.exports = { performLogin };
