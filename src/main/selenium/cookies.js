// selenium/cookies.js
const fs = require("fs");

async function saveCookies(driver) {
    const cookies = await driver.manage().getCookies();
    fs.writeFileSync("cookies.json", JSON.stringify(cookies));
    console.log("Cookies saved.");
}

async function loadCookies(driver) {
    if (fs.existsSync("cookies.json")) {
        console.log("Loading cookies...");
        const cookies = JSON.parse(fs.readFileSync("cookies.json"));

        await driver.get("https://www.linkedin.com"); // Load LinkedIn to establish domain context
        for (let cookie of cookies) {
            await driver.manage().addCookie(cookie);
        }
        console.log("Cookies loaded.");
    }
}

module.exports = { saveCookies, loadCookies };
