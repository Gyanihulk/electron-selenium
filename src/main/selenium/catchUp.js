const { randomDelay } = require("../../lib/randomDelay");
const { By, until } = require("selenium-webdriver");

async function catchUpWithFirst15People(driver) {
    try {
        await driver.sleep(15000);

        let totalNurtureCards = [];
        let previousCardCount = 0;

        while (totalNurtureCards.length < 30) {
            // Find all nurture cards on the page
            let nurtureCards = await driver.findElements(By.css("div[data-view-name='nurture-card']"));

            // Update total nurture cards
            totalNurtureCards = nurtureCards;

            console.log(`Currently found ${nurtureCards.length} cohort cards.`);

            if (totalNurtureCards.length === previousCardCount) {
                console.log("No new cards found, breaking the loop.");
                break; // Stop scrolling if no new cards are found
            }

            previousCardCount = totalNurtureCards.length;

            // Scroll to the last card to load more
            await driver.executeScript(
                "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
                totalNurtureCards[totalNurtureCards.length - 1]
            );

            await randomDelay(); // Add delay to allow loading of more cards
        }

        console.log(`Found ${totalNurtureCards.length} nurture cards. Proceeding with the first 15.`);

        // Iterate over the first 15 nurture cards
        for (let i = 0; i < Math.min(15, totalNurtureCards.length); i++) {
            try {
                // Find the primary button within the current card
                let button = await totalNurtureCards[i].findElement(By.css("button[data-view-name='nurture-card-primary-button']"));
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
