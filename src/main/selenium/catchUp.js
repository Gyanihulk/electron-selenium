const { randomDelay } = require("../../lib/randomDelay");
const { By, until } = require("selenium-webdriver");
// funtion to work with modal
// async function catchUpWithFirst15People(driver) {
//     try {
//         await driver.sleep(15000);

//         let totalNurtureCards = [];
//         let previousCardCount = 0;

//         while (totalNurtureCards.length < 30) {
//             // Find all nurture cards on the page
//            let nurtureCards = await driver.findElements(By.css("article.props-s-card[data-view-name='props-nurture-card']"));

//             // Update total nurture cards
//             totalNurtureCards = nurtureCards;

//             console.log(`Currently found ${nurtureCards.length} cohort cards.`);

//             if (totalNurtureCards.length === previousCardCount) {
//                 console.log("No new cards found, breaking the loop.");
//                 break; // Stop scrolling if no new cards are found
//             }

//             previousCardCount = totalNurtureCards.length;

//             // Scroll to the last card to load more
//             await driver.executeScript(
//                 "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
//                 totalNurtureCards[totalNurtureCards.length - 1]
//             );

//             await randomDelay(); // Add delay to allow loading of more cards
//         }

//         console.log(`Found ${totalNurtureCards.length} nurture cards. Proceeding with the first 15.`);

//         // Iterate over the first 15 nurture cards
//         for (let i = 0; i < Math.min(15, totalNurtureCards.length); i++) {
//             try {
//                 // Find the primary button within the current card
//                 let button = await totalNurtureCards[i].findElement(By.css("button[data-view-name='nurture-card-primary-button']"));
//                 await driver.wait(until.elementIsVisible(button), 10000);
//                 await button.click(); // Click the button

//                 await randomDelay(); // Wait for the dialog to appear

//                 // Find the dialog and send button
//                 const dialog = await driver.findElement(By.css("dialog[aria-label='Send Message']"));
//                 const sendButton = await dialog.findElement(By.css("button[data-view-name='messaging-modal-send-button']"));
//                 await randomDelay();
//                 await sendButton.click(); // Click the send button
//                 await randomDelay();

//                 console.log(`Message sent to person ${i + 1}`);
//             } catch (error) {
//                 console.warn(`Error processing card ${i + 1}:`, error.message);
//                 // Continue to the next card without breaking the loop
//             }
//         }

//         console.log("Finished processing cards.");
//         // await driver.quit();
//     } catch (error) {
//         console.error("Error while catching up with people:", error);
//     }
// }

async function catchUpWithFirst15People(driver) {
  try {
    await driver.sleep(15000);

    let totalNurtureCards = [];
    let previousCardCount = 0;

    while (totalNurtureCards.length < 50) {
      // Find all nurture cards based on the updated card structure
      let nurtureCards = await driver.findElements(
        By.css("article.props-s-card[data-view-name='props-nurture-card']")
      );

      // Update total nurture cards list
      totalNurtureCards = nurtureCards;

      console.log(`Currently found ${nurtureCards.length} nurture cards.`);

      if (totalNurtureCards.length === previousCardCount) {
        console.log("No new cards found, stopping further scrolling.");
        break; // Stop scrolling if no new cards are found
      }

      previousCardCount = totalNurtureCards.length;

      // Scroll to the last card to load more
      await driver.executeScript(
        "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
        totalNurtureCards[totalNurtureCards.length - 1]
      );

      await randomDelay(); // Add delay to allow new cards to load
    }

    console.log(
      `Found ${totalNurtureCards.length} nurture cards. Processing the first 15.`
    );

    // Iterate over the first 15 nurture cards
    for (let i = 0; i <  totalNurtureCards.length; i++) {
      try {
        const card = totalNurtureCards[i];

        // Find the  button inside the card
        let button = await card.findElement(
          By.xpath(".//button[contains(@class, 'props-s-cta')]")
        );

        if (button) {
          await driver.wait(until.elementIsVisible(button), 10000);
          await driver.executeScript("arguments[0].click();", button); // Click the button
          console.log(`Clicked  message button for person ${i + 1}`);
        } else {
          console.log(
            `No  message button found in card ${i + 1}. Skipping.`
          );
          continue;
        }
        await randomDelay();
        let sendButton = await driver.wait(
          until.elementLocated(By.css('.msg-form__send-button.artdeco-button.artdeco-button--1')),
          10000
        );
    
        if (sendButton) {
                  const buttonHtml = await driver.executeScript(
              "return arguments[0].outerHTML;",
              sendButton
            );
            // console.log(`Correct sendButton  HTML:\n${buttonHtml}`);
          await driver.wait(until.elementIsVisible(sendButton), 10000);
          await driver.executeScript("arguments[0].click();", sendButton); // Click the button
          console.log("Clicked the message send button.");
        } else {
          console.log("No message send button found.");
        }
    
       

        await randomDelay();
        try {
          // Wait for the active conversation bubble to appear
          await driver.wait(
            until.elementLocated(
              By.css("div.msg-overlay-conversation-bubble--is-active")
            ),
            10000
          );
          const conversationBubble = await driver.findElement(
            By.css("div.msg-overlay-conversation-bubble--is-active")
          );

          if (conversationBubble) {
            console.log("Found active conversation bubble.");

            // Now find the first close button inside the conversation
            try {
              const buttons = await conversationBubble.findElements(
                By.css("button.msg-overlay-bubble-header__control")
              );

              if (buttons.length > 1) {
                // Select the last button (usually the close button)
                const closeButton = buttons[buttons.length - 1];

                // Log the button HTML before clicking
                const buttonHtml = await driver.executeScript(
                  "return arguments[0].outerHTML;",
                  closeButton
                );
                // console.log(`Correct Close Button HTML:\n${buttonHtml}`);

                // Click the close button
                await driver.executeScript(
                  "arguments[0].click();",
                  closeButton
                );
                console.log("Closed the conversation popup successfully.");
              } else {
                console.warn(
                  "Could not find multiple buttons. Maybe UI changed?"
                );
              }
            } catch (error) {
              console.warn(
                "Close button not found inside the conversation bubble."
              );
            }
          }
        } catch (error) {
          console.warn("No active conversation found, skipping closure.");
        }

        await randomDelay();
      } catch (error) {
        console.warn(`Error processing card ${i + 1}:`, error.message);
        // Continue to the next card without breaking the loop
      }
    }

    console.log("Finished processing nurture cards.");
    // await driver.quit();
  } catch (error) {
    console.error("Error while catching up with people:", error);
  }
}

module.exports = { catchUpWithFirst15People };
