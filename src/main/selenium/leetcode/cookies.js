// selenium/cookies.js
const fs = require("fs");

async function saveCookies(driver) {
    const cookies = await driver.manage().getCookies();
    fs.writeFileSync("cookies-leetcode.json", JSON.stringify(cookies));
    console.log("Cookies saved.");
}

async function loadCookies(driver) {
    if (fs.existsSync("cookies-leetcode.json")) {
        console.log("Loading cookies...");
        const cookies = JSON.parse(fs.readFileSync("cookies-leetcode.json"));

       // Load LinkedIn to establish domain context
        for (let cookie of cookies) {
            await driver.manage().addCookie(cookie);
        }
        await driver.get("https://leetcode.com"); 
        console.log("Cookies loaded.");
    }
}

module.exports = { saveCookies, loadCookies };
