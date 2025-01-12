/**
 * Sanitize emojis in a string by removing or replacing them with a placeholder.
 *
 * @param {string} text - The input text containing emojis.
 * @param {string} [placeholder=""] - The placeholder to replace emojis. Defaults to an empty string.
 * @returns {string} - The sanitized text.
 */
function sanitizeEmojis(text, placeholder = "") {
    // Regex to match emojis, including smilies and other Unicode symbols
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu;
    
    // Replace emojis with the placeholder
    return text.replace(emojiRegex, placeholder);
}

exports.module={sanitizeEmojis}