const axios = require('axios');
const { API_CONFIG } = require('./apiConfig');

const generatePostComment = async (postContent, existingComments) => {
  const endpoint = 'http://localhost:8000/api/linkedin/generate-post-comment/';

  const requestBody = {
    postContent,
    existingComments,
  };

  try {
    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the data from the API response
  } catch (error) {
    if (error.response) {
      console.error('Error in generatePostComment:', error.response.data);
    } else {
      console.error('Error in generatePostComment:', error.message);
    }
    throw error; // Rethrow the error for further handling
  }
};

module.exports = {
  generatePostComment,
};



