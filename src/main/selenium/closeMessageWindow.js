const { By, until, Builder } = require("selenium-webdriver");

const closeMessageWindow = async (driver) => {
    try {
        
    
    const conversationBubble = await driver.findElement(
        By.css("div.msg-overlay-conversation-bubble--is-active")
      );

      if (conversationBubble) {
          try {
        console.log("Found active conversation bubble.");

        // Now find the first close button inside the conversation
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
      }} catch (error) {
        console.warn(
            "No active chat window"
          );
      }
};

module.exports = { closeMessageWindow };
