const { randomDelay } = require("../../lib/randomDelay");
const { By ,until} = require("selenium-webdriver");
async function catchUpWithFirst15People(driver) {
    try {
        let nurtureCards = await driver.findElements(By.css("div[data-view-name='nurture-card']"));
        console.log(`Currently found ${nurtureCards.length} cohort cards.`);

        // Iterate over the first 15 nurture cards
        for (let i = 0; i < Math.min(15, nurtureCards.length); i++) {
            let button;

            // Use WebDriverWait to ensure the button is clickable
            await driver.wait(until.elementLocated(By.css("button[data-view-name='nurture-card-primary-button']")), 10000).then(async () => {
                button = await nurtureCards[i].findElement(By.css("button[data-view-name='nurture-card-primary-button']"));
                
            });
            if (button) {
                await button.click(); // Click the button

                await randomDelay(); // Wait for the dialog to appear

                const dialog = await driver.findElement(By.css("dialog[aria-label='Send Message']"));
                const sendButton = await dialog.findElement(By.css("button[data-view-name='messaging-modal-send-button']"));
                await randomDelay(); 
                await sendButton.click(); // Click the send button

                console.log(`Message sent to person ${i + 1}`);
            }
        }
    } catch (error) {
        console.error("Error while catching up  with people:", error);
    }
}

module.exports={catchUpWithFirst15People}