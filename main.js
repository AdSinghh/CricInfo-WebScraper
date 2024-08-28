const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"; // URL of the IPL 2020-21 series page on ESPN Cricinfo

const request = require("request"); // Importing the 'request' module for making HTTP requests

const cheerio = require("cheerio"); // Importing the 'cheerio' module to parse and manipulate HTML

const allMatchObj = require('./AllMatch'); // Importing the custom 'AllMatch' module, which contains functions to handle match details

const path = require('path'); // Importing the 'path' module to work with file and directory paths

const fs = require('fs'); // Importing the 'fs' (File System) module to interact with the file system

let iplPath = path.join(__dirname, "IPL"); // Constructing a path for the 'IPL' directory in the current working directory

console.log(__dirname); // Logging the current directory path for debugging purposes

dirCreator(iplPath); // Calling the 'dirCreator' function to create the 'IPL' directory if it doesn't exist

request(url, cb); // Making an HTTP GET request to the specified URL, 'cb' is the callback function that handles the response

function cb(error, response, html) { // Callback function that handles the HTTP request response
  if (error) { // If an error occurred during the request
    console.log(error); // Log the error to the console
  } else { // If no error occurred
    extractLink(html); // Call the 'extractLink' function to process the HTML of the page
  }
}

function extractLink(html) { // Function to extract the link to all match results from the HTML
  let $ = cheerio.load(html); // Loading the HTML content into cheerio for parsing

  let anchorElem = $('a[data-hover="View All Results"]'); // Selecting the anchor element with the 'data-hover' attribute equal to "View All Results"

  let link = anchorElem.attr("href"); // Extracting the 'href' attribute from the selected anchor element

  let fullLink = "https://www.espncricinfo.com" + link; // Constructing the full URL for all match results by appending the extracted link to the base URL

  console.log(fullLink); // Logging the full URL to the console

  allMatchObj.getAllMatch(fullLink); // Calling the 'getAllMatch' function from the 'AllMatch' module to process the full URL
}

function dirCreator(filePath) { // Function to create a directory if it doesn't already exist
  if (fs.existsSync(filePath) == false) { // Checking if the directory already exists
    fs.mkdirSync(filePath); // If the directory doesn't exist, create it
  }
}
