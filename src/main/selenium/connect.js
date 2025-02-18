// selenium/connect.js
const { By, until } = require("selenium-webdriver");

async function randomDelay() {
    const delay = Math.floor(Math.random() * 5000) + 1000;
    return new Promise((resolve) => setTimeout(resolve, delay));
}

async function closeToastIfPresent(driver) {
    try {
        const toast = await driver.findElement(By.css(".artdeco-toasts_toasts"));
        if (toast) {
            console.log("Toast message detected. Attempting to close...");
            const closeButton = await toast.findElement(By.css(".artdeco-toast-item__dismiss"));
            await driver.executeScript("arguments[0].click();", closeButton);
            console.log("Toast message closed successfully.");
        }
    } catch (error) {
        console.log("No toast message found or already dismissed.");
    }
}

async function connectWithFirst15People(driver) {
    try {
        let peopleConnected = 0;
        let cardsProcessed = 0;

        while (peopleConnected < 15) {
            let cohortCards = await driver.findElements(By.css("section.artdeco-card.discover-entity-type-card"));
            console.log(`Currently found ${cohortCards.length} cohort cards.`);

            for (let i = cardsProcessed; i < cohortCards.length && peopleConnected < 15; i++) {
                console.log(`Processing card ${i + 1}`);
                let attempts = 0;
                let connected = false;

                while (attempts < 3 && !connected) {
                    try {
                        const card = cohortCards[i];
                        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", card);
                        await driver.wait(until.elementLocated(By.css("button.artdeco-button--secondary")), 5000);

                        const connectButton = await card.findElement(By.css("button.artdeco-button--secondary"));

                        await driver.executeScript("arguments[0].click();", connectButton);
                        
                        // Wait for potential toast message and close it
                        await closeToastIfPresent(driver);

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
        await driver.quit();
    } catch (error) {
        console.error("Error while connecting with people:", error);
    }
}


module.exports = { connectWithFirst15People };
