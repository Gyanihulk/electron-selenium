const { By, until ,Builder} = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

// Helper function to generate a unique filename with date and time
function getFilenameWithDate(baseName) {
  const now = new Date();
  const datePart = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
  return `${baseName}_${datePart}_${timePart}.json`;
}

async function scrapePosts(driver) {
  console.log("Navigating to the page...");

  // Wait for the page to load completely
  await driver.sleep(30000); // Adjust based on actual page load time

  const postsData = []; // Array to store all posts
  const errors = []; // To track missing or failed information globally

  try {
    // Wait until posts are located
    await driver.wait(
      until.elementsLocated(By.css('div[data-id^="urn:li:activity:"]')),
      10000
    );

    // Find all post containers
    const posts = await driver.findElements(By.css('div[data-id^="urn:li:activity:"]'));
    console.log(`Found ${posts.length} posts on the page.`);

    // Iterate over each post
    for (const post of posts) {
      const postDetails = {};
      let postErrors = []; // To track errors for this specific post

      try {
        // Extract activity ID (post ID)
        postDetails.postId = await post.getAttribute("data-id");
      } catch (error) {
        postErrors.push("Failed to fetch post ID.");
        postDetails.postId = null;
      }

      try {
        // Extract URL of the post
        const postUrlElement = await post.findElement(By.css(".update-components-actor__meta-link"));
        postDetails.url = await postUrlElement.getAttribute("href");
      } catch (error) {
        postErrors.push("Failed to fetch post URL.");
        postDetails.url = null;
      }

      try {
        // Extract name
        const nameElement = await post.findElement(By.css(".update-components-actor__title span[dir='ltr']"));
        postDetails.name = await nameElement.getText();
      } catch (error) {
        postErrors.push("Failed to fetch name.");
        postDetails.name = null;
      }

      try {
        // Extract post content
        const contentElement = await post.findElement(By.css(".update-components-update-v2__commentary span[dir='ltr']"));
        postDetails.content = sanitizeEmojis(await contentElement.getText());
      } catch (error) {
        postErrors.push("Failed to fetch content.");
        postDetails.content = null;
      }

      try {
        // Extract reactions (likes, comments, shares)
        const reactionsContainer = await post.findElement(By.css(".social-details-social-counts"));
        const reactions = await reactionsContainer.findElements(By.css(".social-details-social-counts__count-value"));

        postDetails.reactions = {
          likes: reactions.length >= 1 ? await reactions[0].getText() : "0",
          comments: reactions.length >= 2 ? await reactions[1].getText() : "0",
          shares: reactions.length >= 3 ? await reactions[2].getText() : "0",
        };
      } catch (error) {
        postErrors.push("Failed to fetch reactions.");
        postDetails.reactions = { likes: "0", comments: "0", shares: "0" };
      }

      try {
        // Extract media URL (if available)
        const mediaElement = await post.findElement(By.css(".update-components-linkedin-video__container video"));
        postDetails.mediaUrl = await mediaElement.getAttribute("src");
      } catch (error) {
        postErrors.push("Failed to fetch media URL.");
        postDetails.mediaUrl = null;
      }

    try {
        const comments = await fetchComments(post);
    console.log(comments);
        postDetails.comments = comments;
    } catch (error) {
        
    }
      // Add the current post's details to the postsData array
      postsData.push(postDetails);

      // Add errors (if any) for this post
      if (postErrors.length > 0) {
        errors.push({
          postId: postDetails.postId || "unknown",
          url: postDetails.url || "unknown",
          errors: postErrors,
        });
      }
    }
    
    
    // Generate a unique filename with the current date and time
    const outputFilePath = path.join(__dirname, getFilenameWithDate("posts"));
    const dataToSave = { posts: postsData, errors };

    try {
      fs.writeFileSync(outputFilePath, JSON.stringify(dataToSave, null, 2));
      console.log(`Posts and errors saved to ${outputFilePath}`);
    } catch (fileError) {
      console.error("Failed to save data to file:", fileError);
    }

    return { posts: postsData, errors };
  } catch (error) {
    console.error("Error while scraping posts:", error);
    const generalErrorData = {
      posts: [],
      errors: [{ message: "General error while scraping posts.", details: error.message }],
    };
    const outputFilePath = path.join(__dirname, getFilenameWithDate("posts"));
    fs.writeFileSync(outputFilePath, JSON.stringify(generalErrorData, null, 2));
    return generalErrorData;
  }
}


async function fetchComments(post) {
  try {
    // Click the "Comment" button
    const commentButton = await post.findElement(By.css('button[aria-label="Comment"]'));
    await commentButton.click();

    // Wait for the comments to load (4 seconds)
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // Extract comment container
    const commentsContainer = await post.findElement(By.css(".comments-comment-list__container"));

    // Find all comment items
    const commentElements = await commentsContainer.findElements(By.css(".comments-comment-entity"));

    // Extract the first 5 comments or fewer
    const commentsData = [];
    for (let i = 0; i < Math.min(commentElements.length, 5); i++) {
      try {
        const commentElement = commentElements[i];

        // Extract comment text
        const commentTextElement = await commentElement.findElement(
          By.css(".comments-comment-item__main-content span[dir='ltr']")
        );
        const commentText = await commentTextElement.getText();

        // Extract user profile URL
        const userProfileLink = await commentElement.findElement(
          By.css(".comments-comment-meta__actor a")
        );
        const userProfileURL = await userProfileLink.getAttribute("href");

        // Extract user name
        const userNameElement = await commentElement.findElement(
          By.css(".comments-comment-meta__description-title")
        );
        const userName = await userNameElement.getText();

        // Extract user ID from data attributes (if available)
        const dataId = await commentElement.getAttribute("data-id");

        // Store extracted data
        commentsData.push({
            commentText: sanitizeEmojis(commentText),
          userName,
          userProfileURL,
          dataId,
        });
      } catch (err) {
        console.error(`Failed to extract data for comment ${i + 1}:`, err.message);
      }
    }

    console.log("Extracted Comments Data:", commentsData);
    return commentsData;
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    return [];
  }
}

// // Example usage
// (async () => {
//   const driver = await new Builder().forBrowser("chrome").build();
//   try {
//     await driver.get("https://www.linkedin.com/");
//     // Assuming `post` is already located
//     const post = await driver.findElement(By.css(".some-post-selector"));
//     const comments = await fetchComments(post);
//     console.log(comments);
//   } finally {
//     await driver.quit();
//   }
// })();

module.exports = { scrapePosts };
