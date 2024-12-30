// selenium/connect.js
const { By } = require("selenium-webdriver");

async function randomDelay() {
    const delay = Math.floor(Math.random() * 5000) + 1000;
    return new Promise((resolve) => setTimeout(resolve, delay));
}

async function connectWithFirst15People(driver) {
    try {
        let peopleConnected = 0;
        let cardsProcessed = 0;

        while (peopleConnected < 15) {
            let cohortCards = await driver.findElements(By.css("div[data-view-name='cohort-card']"));
            console.log(`Currently found ${cohortCards.length} cohort cards.`);

            for (let i = cardsProcessed; i < cohortCards.length && peopleConnected < 15; i++) {
                console.log(`Processing card ${i + 1}`);
                let attempts = 0;
                let connected = false;

                while (attempts < 3 && !connected) {
                    try {
                        const card = cohortCards[i];
                        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", card);

                        const connectSpan = await card.findElement(By.xpath(".//span[contains(text(), 'Connect')]"));
                        const connectButton = await connectSpan.findElement(By.xpath("ancestor::button"));

                        await driver.executeScript("arguments[0].click();", connectButton);

                        connected = true;
                        peopleConnected++;
                        console.log(`Successfully connected with card ${i + 1} (${peopleConnected}/15)`);
                        await driver.sleep(2000);
                    } catch (error) {
                        console.warn(`Retrying card ${i + 1}:`, error);
                        attempts++;
                    }
                    await driver.sleep(1000);
                }
                await driver.sleep(3000);
            }

            cardsProcessed = cohortCards.length;

            if (peopleConnected < 15) {
                console.log("Scrolling to bottom...");
                await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
                await randomDelay();
            }
        }
    } catch (error) {
        console.error("Error while connecting with people:", error);
    }
}

module.exports = { connectWithFirst15People };
