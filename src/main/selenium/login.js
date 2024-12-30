// selenium/login.js
const { By, until } = require("selenium-webdriver");
const { saveCookies } = require("./cookies");
require("dotenv").config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

async function openLinkedIn(driver) {
    await driver.get("https://www.linkedin.com/login");
}

async function performLogin(driver) {
    try {
        await openLinkedIn(driver);

        const emailField = await driver.findElement(By.id("username"));
        const passwordField = await driver.findElement(By.id("password"));

        await emailField.sendKeys(email);
        await passwordField.sendKeys(password);

        const loginButton = await driver.findElement(By.xpath("//button[@type='submit']"));
        await loginButton.click();

        await driver.wait(until.urlContains("feed"), 100000);

        await saveCookies(driver);
    } catch (error) {
        console.error("Error during login process:", error);
    }
}

module.exports = { performLogin };
