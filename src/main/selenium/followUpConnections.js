
const { By,until } = require("selenium-webdriver");
const fs = require('fs');
const { randomDelay } = require("../../lib/randomDelay");
async function extractConnections(driver) {
    console.log("Navigating to connections page...");
    await driver.get('https://www.linkedin.com/mynetwork/invite-connect/connections/');

    console.log("Waiting for connection cards to load...");
    await driver.wait(until.elementsLocated(By.className('mn-connection-card')), 10000);

    console.log("Fetching connection cards...");
    const connectionCards = await driver.findElements(By.className('mn-connection-card'));

    console.log(`Found ${connectionCards.length} connection cards`);
    // Read existing connections from the JSON file
    let savedConnections = [];
    if (fs.existsSync('connections.json')) {
        savedConnections = JSON.parse(fs.readFileSync('connections.json', 'utf-8'));
    }

    for (let card of connectionCards) {
        try {
            const nameElement = await card.findElement(By.className('mn-connection-card__name'));
            const name = await nameElement.getText();
            const connectionTime = await card.findElement(By.tagName('time')).getText();
            
            if (isConnectedWithin24Hours(connectionTime) && !hasMessageBeenSent(name, savedConnections)) {
                const messageSent = await sendMessage(driver, card);
                const connection = {
                    name: name.trim(),
                    connectedTime: connectionTime.trim(),
                    messageSent: messageSent
                };
                
                // Update local array and save to JSON after each card is processed
                savedConnections.push(connection);
                fs.writeFileSync('connections.json', JSON.stringify(savedConnections, null, 2));
                console.log(`Connection processed and saved: ${name}. Message sent: ${messageSent}`);
            } else {
                console.log(`Connection skipped: ${name}, ${connectionTime}`);
            }
        } catch (error) {
            console.error("Error extracting connection:", error);
        }
    }
}

async function sendMessage(driver, card) {
    try {
        const messageButton = await card.findElement(By.xpath(".//button[.//span[text()='Message']]"));
        await messageButton.click();

        // Wait for the message input box to be available
        await driver.wait(until.elementLocated(By.css("div.msg-form__contenteditable[contenteditable='true']")), 5000);
        const messageBox = await driver.findElement(By.css("div.msg-form__contenteditable[contenteditable='true']"));

        // Get the name of the person from the card
        const nameElement = await card.findElement(By.className('mn-connection-card__name'));
        const name = await nameElement.getText();

        // Send a customized message
        const customMessage = `
Hey ${name.trim()}, great to connect with you!

I'm Adamya Kumar, and I'm excited to share more about what I do. I run a software development agency focused on delivering scalable, high-performance backend solutions and top-notch UI/UX for mobile apps and websites. Our goal is to support innovative entrepreneurs by providing cost-effective solutions without compromising on quality.

Beyond development, I'm also a mentor helping entrepreneurs bring their products to market successfully. You can check out my portfolio here: [My Portfolio](https://lms-platform-xi-ebon.vercel.app/).

Feel free to take a look at my profile to learn more about my journey and expertise. Looking forward to exploring potential collaborations!

Best,
Adamya Kumar
`;
        await messageBox.sendKeys(customMessage);

        await randomDelay();

        // // Find the send button and click it
        const sendButton = await driver.findElement(By.css("button.msg-form__send-button"));
        await sendButton.click();

        await randomDelay();

        // Try locating the close button in multiple ways
        // Find the close button using a CSS selector and click it
        const closeButtons = await driver.findElements(By.css("button.msg-overlay-bubble-header__control"));
        for (let button of closeButtons) {
            const innerText = await button.getText();
            if (innerText.includes("Close your")) {
                await button.click();

                // Wait briefly for the modal to possibly appear
                await driver.sleep(1000);

                // Check for the modal and click "Leave" if it appears
                try {
                    await driver.wait(until.elementLocated(By.css("button.artdeco-modal__confirm-dialog-btn")), 5000);
                    const leaveButton = await driver.findElement(By.xpath("//button/span[text()='Leave']/parent::button"));
                    await leaveButton.click();
                } catch (modalNotFoundError) {
                    // Modal not found, continue without error
                }
                
                break;
            }
        }

        return true;

    } catch (error) {
        console.error("Error sending message:", error);
        return false;
    }
}
function isConnectedWithin24Hours(connectionTime) { 
    const timeRegex = /(\d+)\s(minutes?|hours?)\sago/; 
    const match = connectionTime.match(timeRegex); 
    if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        if ((unit.startsWith('hour') && value <= 24) || unit.startsWith('minute') || unit.startsWith('day')) {
            return true;
        }
    }
    return false; 
}
function hasMessageBeenSent(name, savedConnections) {
    const existingConnection = savedConnections.find(conn => conn.name === name);
    return existingConnection ? existingConnection.messageSent : false;
}

module.exports={extractConnections}