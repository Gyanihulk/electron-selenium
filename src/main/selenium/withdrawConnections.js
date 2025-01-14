const { By, until } = require("selenium-webdriver");
const fs = require("fs");
const { randomDelay } = require("../../lib/randomDelay");

async function withdrawConnections(driver) {
  console.log("Navigating to withdrawing page...");
  await driver.get(
    "https://www.linkedin.com/mynetwork/invitation-manager/sent/?page=3"
  );
await driver.sleep(15000);
  // Wait until the invitation cards are loaded
  await driver.wait(until.elementsLocated(By.className("invitation-card")), 10000);

  // Find all invitation cards
  const invitationCards = await driver.findElements(By.className("invitation-card"));
  console.log(`Found ${invitationCards.length} invitations.`);

  for (let i = 0; i < invitationCards.length; i++) {
    try {
      // Find the withdraw button within each invitation card
      const withdrawButton = await invitationCards[i].findElement(
        By.xpath('.//button[contains(@aria-label, "Withdraw invitation")]')
      );

      // Click the withdraw button
      await withdrawButton.click();
      console.log(`Clicked withdraw button for card ${i + 1}.`);
      await randomDelay();
      // Wait for the modal to appear
      await driver.wait(
        until.elementLocated(By.className("artdeco-modal")),
        5000
      );
      await randomDelay();
      // Find the confirm "Withdraw" button in the modal
      const modalWithdrawButton = await driver.findElement(
        By.xpath('//div[contains(@class, "artdeco-modal__actionbar")]//button[contains(@class, "artdeco-button--primary") and span[text()="Withdraw"]]')
      );
      
      // const buttonInnerHTML = await modalWithdrawButton.getAttribute('innerHTML');
      // console.log('Button Inner HTML:', buttonInnerHTML);
      
      // Click the confirm "Withdraw" button
      await modalWithdrawButton.click();
      console.log(`Confirmed withdrawal for modaly ${i + 1}.`);

      // Optionally wait between actions
      await randomDelay();
    } catch (error) {
      console.error(`Error processing card ${i + 1}:`, error.message);
    }
  }

  console.log("Completed withdrawing all invitations.");
}

module.exports = { withdrawConnections };
