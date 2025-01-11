const { randomDelay } = require("../../lib/randomDelay");
const { By, until } = require("selenium-webdriver");

async function catchUpWithFirst15People(driver) {
    try {
        await driver.sleep(15000);
        let nurtureCards = await driver.findElements(By.css("div[data-view-name='nurture-card']"));
        console.log(`Currently found ${nurtureCards.length} cohort cards.`);

        // Iterate over the first 15 nurture cards
        for (let i = 0; i < Math.min(15, nurtureCards.length); i++) {
            try {
                // Find the primary button within the current card
                let button = await nurtureCards[i].findElement(By.css("button[data-view-name='nurture-card-primary-button']"));
                await driver.wait(until.elementIsVisible(button), 10000);
                await button.click(); // Click the button

                await randomDelay(); // Wait for the dialog to appear

                // Find the dialog and send button
                const dialog = await driver.findElement(By.css("dialog[aria-label='Send Message']"));
                const sendButton = await dialog.findElement(By.css("button[data-view-name='messaging-modal-send-button']"));
                await randomDelay(); 
                await sendButton.click(); // Click the send button
                await randomDelay(); 

                console.log(`Message sent to person ${i + 1}`);
            } catch (error) {
                console.warn(`Error processing card ${i + 1}:`, error.message);
                // Continue to the next card without breaking the loop
            }
        }

        console.log("Finished processing cards.");
        await driver.quit();
    } catch (error) {
        console.error("Error while catching up with people:", error);
    }
}

module.exports = { catchUpWithFirst15People };
