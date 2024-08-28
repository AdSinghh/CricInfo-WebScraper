const cheerio = require("cheerio"); // Importing the 'cheerio' module to parse and manipulate HTML

const request = require('request'); // Importing the 'request' module for making HTTP requests

const scorecardObj = require('./scorecard'); // Importing a custom module named 'scorecard', expected to have functions related to processing individual scorecard pages


function getAllMatchLink(uri) { // Function to get all match links from the provided URI
  request(uri, function (error, response, html) { // Making an HTTP GET request to the specified URI
    if (error) { // If an error occurred during the request
      console.log(error); // Log the error to the console
    } else { // If no error occurred
      extractAllMatchLink(html); // Call the 'extractAllMatchLink' function to process the HTML of the page
    }
  });
}

     
    function extractAllMatchLink(html) { // Function to extract all scorecard links from the provided HTML
  let $ = cheerio.load(html); // Loading the HTML content into cheerio for parsing

  let scoreCardElemArr = $('a[data-hover="Scorecard"]'); // Selecting all anchor elements with the 'data-hover' attribute equal to "Scorecard"

  for (let i = 0; i < scoreCardElemArr.length; i++) { // Looping through all selected scorecard elements
    let ScoreCardlink = $(scoreCardElemArr[i]).attr("href"); // Extracting the 'href' attribute from each scorecard element

    let fullLink = "https://www.espncricinfo.com" + ScoreCardlink; // Constructing the full URL for each scorecard by appending the extracted link to the base URL

    // console.log(fullLink); // (Commented out) Logging the full URL to the console

    scorecardObj.ps(fullLink); // Calling the 'ps' function from the 'scorecard' module to process the full URL of each scorecard
  }
}


  module.exports = {
  getAllMatch: getAllMatchLink // Exporting the 'getAllMatchLink' function under the name 'getAllMatch'
};

