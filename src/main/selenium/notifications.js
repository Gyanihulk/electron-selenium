const { By } = require("selenium-webdriver");

async function notifications(driver) {
  console.log("Navigating to the notifications page...");
  await driver.get("https://www.linkedin.com/notifications/?filter=all");

  // Wait for the page to load
  await driver.sleep(5000);

  const getTimeInSeconds = (timeString) => {
    if (timeString.endsWith("s")) return parseInt(timeString) || 0;
    if (timeString.endsWith("m")) return (parseInt(timeString) || 0) * 60;
    if (timeString.endsWith("h")) return (parseInt(timeString) || 0) * 3600;
    if (timeString.endsWith("d")) return (parseInt(timeString) || 0) * 86400;
    return Number.MAX_SAFE_INTEGER;
  };

  const notifications = [];
  let hasMoreNotifications = true;

  while (hasMoreNotifications) {
    // Find all notification cards
    const notificationCards = await driver.findElements(By.css("article.nt-card"));

    // Loop through each notification card
    for (const card of notificationCards) {
      try {
        // Find the notification text
        const textElement = await card.findElement(By.css(".nt-card__text--3-line"));
        const notificationText = await textElement.getAttribute("innerText");

        // Find the notification time
        const timeElement = await card.findElement(By.css(".nt-card__time-ago"));
        const notificationTimeText = await timeElement.getAttribute("innerText");

        // Find the notification link6
     
   // Find the notification link with the specific class name
        const linkElement = await card.findElement(By.css("a.nt-card__headline"));
        const notificationLink = await linkElement.getAttribute("href");
        // Convert time into seconds and check if it’s within the last 24 hours
        const notificationTimeInSeconds = getTimeInSeconds(notificationTimeText);
        if (notificationTimeInSeconds > 86400) {
          hasMoreNotifications = false;
          break;
        }

        // Store the notification
        notifications.push({
          text: notificationText,
          time: notificationTimeText,
          link: notificationLink,
        });
      } catch (error) {
        console.log("Error processing notification:", error.message);
      }
    }

    // Scroll to load older notifications if required
    if (hasMoreNotifications) {
      const lastCard = notificationCards[notificationCards.length - 1];
      await driver.actions().scroll(0, 0, 0, 0, lastCard).perform();
      await driver.sleep(2000); // Wait for older notifications to load
    }
  }

  console.log("Fetched Notifications:");
  console.log(notifications);

  // Open links in new tabs if the notification mentions or tags the user
  for (const notification of notifications) {
    if (/mentioned|tagged/i.test(notification.text)) {
      console.log(`Mentioned Notifications: `,notification);
      // await driver.executeScript("window.open(arguments[0], '_blank');", notification.link);
      await driver.sleep(2000); // Allow the new tab to load
    }
  }

  return notifications;
}

module.exports = { notifications };
