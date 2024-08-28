// Importing necessary modules
const cheerio = require("cheerio"); // Cheerio is used for parsing and manipulating HTML, similar to jQuery.
const request = require("request"); // Request is used to make HTTP requests, particularly for fetching web pages.

const path = require("path"); // Path module provides utilities for working with file and directory paths.
const fs = require("fs"); // File System module allows interacting with the file system (e.g., reading/writing files).
const xlsx = require('xlsx'); // XLSX is used to handle Excel files (reading and writing).

// Function to process a scorecard URL
function processScoreCard(url) {
  request(url, cb); // Makes an HTTP request to the provided URL and calls the callback function 'cb' with the response.
}

// Callback function to handle the HTTP response
function cb(err, response, html) {
  if (err) { // If an error occurred during the request
    console.log(err); // Log the error to the console.
  } else {
    extractMatchDetails(html); // If no error, proceed to extract match details from the HTML.
  }
}

// Function to extract match details from HTML
function extractMatchDetails(html) {
  let $ = cheerio.load(html); // Load the HTML into Cheerio for parsing.

  let descElem = $(".header-info .description"); // Select the element containing the match description (e.g., teams, venue, date).
  let result = $(".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text span").text(); // Select and extract the match result text.

  let descArr = descElem.text().split(","); // Split the description text into an array, separated by commas.

  let venue = descArr[1].trim(); // Extract and trim the venue information.
  let date = descArr[2].trim(); // Extract and trim the date information.

  console.log(venue); // Log the venue to the console.
  console.log(date); // Log the date to the console.
  console.log(result); // Log the match result to the console.

  console.log("`````````````````````````````````````");

  let innings = $(".card.content-block.match-scorecard-table>.Collapsible"); // Select all elements representing innings in the scorecard.

  let htmlString = ""; // Initialize a string to store HTML content of innings.

  for (let i = 0; i < innings.length; i++) { // Loop through each innings element.
    htmlString += $(innings[i]).html(); // Append HTML content of the current innings to 'htmlString'.

    let teamName = $(innings[i]).find("h5").text(); // Find the team name in the current innings element.
    teamName = teamName.split("INNINGS")[0].trim(); // Extract and trim the actual team name (before the word "INNINGS").

    let opponentIndex = i == 0 ? 1 : 0; // Determine the index of the opponent team (opposite index of the current team).

    let opponentName = $(innings[opponentIndex]).find("h5").text(); // Find the opponent team name.
    opponentName = opponentName.split("INNINGS")[0].trim(); // Extract and trim the opponent team name.

    let cInning = $(innings[i]); // Store the current innings element in 'cInning'.

    let allRows = cInning.find(".table.batsman tbody tr"); // Select all rows of the batsman table in the current innings.

    for (let j = 0; j < allRows.length; j++) { // Loop through each row of the batsman table.
      let allCols = $(allRows[j]).find("td"); // Select all columns (cells) in the current row.
      let isWorthy = $(allCols[0]).hasClass("batsman-cell"); // Check if the row represents a batsman's data (contains the "batsman-cell" class).

      if (isWorthy == true) { // If the row contains batsman data
        // Extract batsman statistics
        let playerName = $(allCols[0]).text().trim(); // Extract and trim the player's name.
        let runs = $(allCols[2]).text().trim(); // Extract and trim the runs scored by the player.
        let balls = $(allCols[3]).text().trim(); // Extract and trim the balls faced by the player.
        let fours = $(allCols[5]).text().trim(); // Extract and trim the number of fours hit by the player.
        let sixes = $(allCols[6]).text().trim(); // Extract and trim the number of sixes hit by the player.
        let STR = $(allCols[7]).text().trim(); // Extract and trim the strike rate of the player.

        console.log(
          `${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${STR}`
        ); // Log the player's statistics to the console.

        // Process player data and save it
        processPlayer(
          teamName,
          playerName,
          runs,
          balls,
          fours,
          sixes,
          STR,
          opponentName,
          venue,
          result,
          date
        );
      }
    }

    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  }
}

// Function to process and save player data to an Excel file
function processPlayer(
  teamName,
  playerName,
  runs,
  balls,
  fours,
  sixes,
  STR,
  opponentName,
  venue,
  result,
  date
) {
  let teamPath = path.join(__dirname, "IPL", teamName); // Construct the file path for the team directory.
  dirCreator(teamPath); // Create the team directory if it doesn't exist.

  let filePath = path.join(teamPath, playerName + ".xlsx"); // Construct the file path for the player's Excel file.
  let content = excelReader(filePath, playerName); // Read existing data from the player's Excel file (if any).

  let playerObj = { // Create an object to store the player's statistics.
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    STR,
    opponentName,
    venue,
    result,
    date
  };

  content.push(playerObj); // Add the new player's data to the existing content array.
  excelWriter(filePath, content, playerName); // Write the updated content array to the player's Excel file.
}

// Function to create a directory if it doesn't exist
function dirCreator(filePath) {
  if (fs.existsSync(filePath) == false) { // Check if the directory already exists.
    fs.mkdirSync(filePath); // Create the directory if it does not exist.
  }
}

// Function to write data to an Excel file
function excelWriter(filePath, jsonData, sheetName) {
  let newWB = xlsx.utils.book_new(); // Create a new workbook.
  let newWS = xlsx.utils.json_to_sheet(jsonData); // Convert JSON data to a worksheet.
  xlsx.utils.book_append_sheet(newWB, newWS, sheetName); // Append the worksheet to the workbook with the given sheet name.
  xlsx.writeFile(newWB, filePath); // Write the workbook to the specified file path.
}

// Function to read data from an Excel file
function excelReader(filePath, sheetName) {
  if (fs.existsSync(filePath) == false) { // Check if the file exists.
    return []; // Return an empty array if the file does not exist.
  }

  let wb = xlsx.readFile(filePath); // Read the Excel file.
  let excelData = wb.Sheets[sheetName]; // Get the sheet data by sheet name.
  let ans = xlsx.utils.sheet_to_json(excelData); // Convert the sheet data to JSON.
  return ans; // Return the JSON data.
}

// Exporting the 'processScoreCard' function as 'ps'
module.exports = {
  ps: processScoreCard,
};
