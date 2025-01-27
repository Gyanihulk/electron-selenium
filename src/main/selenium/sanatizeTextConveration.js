const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/**
 * Extract messages from HTML and return as an array of objects
 * @param {string} html - The HTML string containing the messages
 * @returns {Array<{ name: string, message: string }>} - Array of message objects
 */
function extractMessages(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const messages = [];
    const messageItems = document.querySelectorAll(".msg-s-event-listitem");

    messageItems.forEach((item) => {
        const nameElement = item.querySelector(".msg-s-message-group__name");
        const messageElement = item.querySelector(".msg-s-event-listitem__body");

        if (nameElement && messageElement) {
            const name = nameElement.textContent.trim();
            const message = messageElement.textContent.trim();

            messages.push({ name, message });
        }
    });

    return messages;
}

// Sample HTML input (could be loaded from a file or test data)
const sampleHtml = `
<div class="msg-s-message-list">
  <div class="msg-s-event-listitem">
    <div class="msg-s-message-group__meta">
      <span class="msg-s-message-group__name t-14 t-black t-bold hoverable-link-text">John Doe</span>
    </div>
    <div class="msg-s-event-listitem__body t-14 t-black--light t-normal">
      Hello, how are you?
    </div>
  </div>
  <div class="msg-s-event-listitem">
    <div class="msg-s-message-group__meta">
      <span class="msg-s-message-group__name t-14 t-black t-bold hoverable-link-text">Jane Smith</span>
    </div>
    <div class="msg-s-event-listitem__body t-14 t-black--light t-normal">
      I'm doing great, thanks!
    </div>
  </div>
</div>
`;

// // Test the function
// const messages = extractMessages(sampleHtml);

// // Log the extracted messages
// console.log("Extracted Messages:", messages);

// Export the function for use in other files
module.exports = { extractMessages };
