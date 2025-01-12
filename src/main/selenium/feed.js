const { By, until, Builder } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const { generatePostComment } = require("../axios/linkedin");
const { randomDelay } = require("../../lib/randomDelay");

// Helper function to generate a unique filename with date and time
function getFilenameWithDate(baseName) {
  const now = new Date();
  const datePart = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
  return `${baseName}_${datePart}_${timePart}.json`;
}
/**
 * Sanitize emojis in a string by removing or replacing them with a placeholder.
 *
 * @param {string} text - The input text containing emojis.
 * @param {string} [placeholder=""] - The placeholder to replace emojis. Defaults to an empty string.
 * @returns {string} - The sanitized text.
 */
function sanitizeEmojis(text, placeholder = "") {
  // Regex to match emojis, including smilies and other Unicode symbols
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu;

  // Replace emojis with the placeholder
  return text.replace(emojiRegex, placeholder);
}
async function scrapePosts(driver) {
  console.log("Navigating to the page...");

  // Wait for the page to load completely
  await driver.sleep(5000); // Adjust based on actual page load time

  const postsData = []; // Array to store all posts
  const errors = []; // To track missing or failed information globally

  try {
    // Wait until posts are located
    await driver.wait(
      until.elementsLocated(By.css('div[data-id^="urn:li:activity:"]')),
      10000
    );

    // Find all post containers
    const posts = await driver.findElements(
      By.css('div[data-id^="urn:li:activity:"]')
    );
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
        const postUrlElement = await post.findElement(
          By.css(".update-components-actor__meta-link")
        );
        postDetails.url = await postUrlElement.getAttribute("href");
      } catch (error) {
        postErrors.push("Failed to fetch post URL.");
        postDetails.url = null;
      }

      try {
        // Extract name
        const nameElement = await post.findElement(
          By.css(".update-components-actor__title span[dir='ltr']")
        );
        postDetails.name = await nameElement.getText();
      } catch (error) {
        postErrors.push("Failed to fetch name.");
        postDetails.name = null;
      }

      try {
        // Extract post content
        const contentElement = await post.findElement(
          By.css(".update-components-update-v2__commentary span[dir='ltr']")
        );
        postDetails.content = sanitizeEmojis(await contentElement.getText());
      } catch (error) {
        postErrors.push("Failed to fetch content.");
        postDetails.content = null;
      }

      try {
        // Extract reactions (likes, comments, shares)
        const reactionsContainer = await post.findElement(
          By.css(".social-details-social-counts")
        );
        const reactions = await reactionsContainer.findElements(
          By.css(".social-details-social-counts__count-value")
        );

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
        const mediaElement = await post.findElement(
          By.css(".update-components-linkedin-video__container video")
        );
        postDetails.mediaUrl = await mediaElement.getAttribute("src");
      } catch (error) {
        postErrors.push("Failed to fetch media URL.");
        postDetails.mediaUrl = null;
      }

      try {
        const comments = await fetchComments(post);
        // console.log(comments);
        postDetails.comments = comments;
        if ((comments.length > 0, postDetails.content)) {
          const generatedcomment = await generatePostComment(
            postDetails.content,
            []
          );
          // Add the current post's details to the postsData array
          console.log("generatedcomment", generatedcomment);
          //   console.log(await post.getAttribute('innerHTML'));

          insertCommentAndSubmit(post, generatedcomment.generated_comment);
        }
      } catch (error) {
        console.error(error);
      }

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
      errors: [
        {
          message: "General error while scraping posts.",
          details: error.message,
        },
      ],
    };
    const outputFilePath = path.join(__dirname, getFilenameWithDate("posts"));
    fs.writeFileSync(outputFilePath, JSON.stringify(generalErrorData, null, 2));
    return generalErrorData;
  }
}

async function fetchComments(post) {
  try {
    // Click the "Comment" button
    const commentButton = await post.findElement(
      By.css('button[aria-label="Comment"]')
    );
    await commentButton.click();

    // Wait for the comments to load (4 seconds)
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // Extract comment container
    const commentsContainer = await post.findElement(
      By.css(".comments-comment-list__container")
    );

    // Find all comment items
    const commentElements = await commentsContainer.findElements(
      By.css(".comments-comment-entity")
    );

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
        console.error(
          `Failed to extract data for comment ${i + 1}:`,
          err.message
        );
      }
    }

    // console.log("Extracted Comments Data:", commentsData);
    return commentsData;
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    return [];
  }
}

/**
 * Function to insert a comment and click the "Comment" button.
 *
 * @param {Object} post - The Selenium WebElement representing the post.
 * @param {string} generatedComment - The generated comment text to add.
 */
async function insertCommentAndSubmit(post, generatedComment) {
  try {
    // Locate the comment box within the post
    const commentBox = await post.findElement(
      By.css(".comments-comment-box-comment__text-editor .ql-editor")
    );

    // Activate the comment box
    await commentBox.click();

    // Insert the generated comment
    await post
      .getDriver()
      .executeScript(
        "arguments[0].innerHTML = arguments[1];",
        commentBox,
        generatedComment
      );

    console.log("Comment inserted into the comment box.");
    const commentButton = await post
      .getDriver()
      .wait(
        until.elementLocated(
          By.css(".comments-comment-box__submit-button--cr")
        ),
        5000
      );

    // Ensure the button is clickable
    await post.getDriver().wait(until.elementIsVisible(commentButton), 5000);
    await post.getDriver().wait(until.elementIsEnabled(commentButton), 5000);

    // Scroll to the button
    await post
      .getDriver()
      .executeScript("arguments[0].scrollIntoView(true);", commentButton);

    // Log the button's HTML for debugging
    const buttonHTML = await commentButton.getAttribute("outerHTML");
    console.log("Comment Button HTML:", buttonHTML);

    // Click the "Comment" button
    await randomDelay()
    
    // Use Actions to perform the click
    const actions = post.getDriver().actions();
    await actions.move({ origin: commentButton }).click().perform();

    console.log("Comment submitted successfully.");
  } catch (error) {
    console.error("Error inserting and submitting comment:", error.message);
    // Optionally log the post HTML for debugging
    // const postHTML = await post.getAttribute("outerHTML");
    // console.log("Post HTML:", postHTML);
  }
}

module.exports = { scrapePosts };
