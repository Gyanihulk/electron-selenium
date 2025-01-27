const { generateReply } = require("../axios/linkedin");
const { extractMessages } = require("./sanatizeTextConveration");

async function waitForHtmlAndHandleAlert(driver) {
  try {
    console.log("Waiting for button click and fetching HTML...");

    while (true) {
      await driver.sleep(2000); // Wait for 2 seconds

      // Fetch the captured HTML from the browser
      const htmlContent = await driver.executeScript(() => {
        const content = window.htmlContent || null;
        if (content) {
          window.htmlContent = null; // Reset the content after fetching
        }
        return content;
      });

      if (htmlContent) {
        // console.log("Fetched HTML content:\n", htmlContent);
        // Test the function
        const messages = extractMessages(htmlContent);

        // Log the extracted messages
        // console.log("Extracted Messages:", messages);
        const suggestedReply=await generateReply(messages)
        console.log(suggestedReply.suggestedReply)
      } else {
        console.log("No new HTML captured yet. Waiting...");
      }
    }
  } catch (error) {
    console.error("Error while fetching HTML:", error);
  }
}

// Inject button and set up click event
async function addFetchHtmlButton(driver) {
  try {
    console.log("Adding a button to the page...");

    const buttonScript = `
            if (!document.getElementById("fetch-html-btn")) {
                const btn = document.createElement("button");
                btn.innerText = "Fetch HTML";
                btn.id = "fetch-html-btn";
                btn.style.position = "fixed";
                btn.style.top = "10px";
                btn.style.right = "10px";
                btn.style.padding = "10px 20px";
                btn.style.zIndex = "10000";
                btn.style.backgroundColor = "#0073b1";
                btn.style.color = "white";
                btn.style.border = "none";
                btn.style.cursor = "pointer";
                btn.style.fontSize = "16px";
                btn.style.borderRadius = "5px";
                btn.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

                btn.addEventListener("click", () => {
                    const component = document.querySelector(".msg-s-message-list");
                    if (component) {
                        window.htmlContent = component.outerHTML; // Save the HTML globally
                        console.log("Fetched HTML logged to Node.js console.");
                    } else {
                        console.error("Component not found!");
                    }
                });

                document.body.appendChild(btn);
            }
        `;
    await driver.executeScript(buttonScript);
    console.log("Button added to the page.");
  } catch (error) {
    console.error("Error while adding button:", error);
  }
}

// Main function
async function messaging(driver) {
  try {
    console.log("Navigating to LinkedIn Messaging...");
    await driver.get("https://www.linkedin.com/messaging/");

    // Add the button to the page
    await addFetchHtmlButton(driver);

    console.log("Setup complete. Waiting for HTML to be fetched...");
    await waitForHtmlAndHandleAlert(driver);
  } catch (error) {
    console.error("Error during setup:", error);
  }
}

module.exports = { messaging };
