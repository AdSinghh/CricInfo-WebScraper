# CricInfo-WebScraper
Built a web scraper that scrapes details like runs, balls faced, boundaries, etc. of Batsmen of each team that played in a particular IPL. Handles multiple requests parallelly and presents data in an organized manner. 

REQUEST package was used to make parallel requests to the server and

CHEERIO is used to extract data out of it

Node.js FS module is used to create directories of each team and

XLSX module is used to create excel files for each player

How it works 

Dependencies Import:
cheerio: Parses and manipulates HTML, similar to jQuery.
request: Makes HTTP requests to fetch web pages.
path and fs: Handle file and directory operations.
xlsx: Reads from and writes to Excel files.
Main Function - processScoreCard(url):

Initiates an HTTP request to the provided scorecard URL using request.
The cb callback function handles the response.
Callback Function - cb(err, response, html):

If there's an error during the HTTP request, it logs the error.
If successful, it passes the HTML content to extractMatchDetails.
HTML Extraction - extractMatchDetails(html):

Uses cheerio to parse the HTML content.
Extracts match details like venue, date, and result.
Logs the match details to the console for debugging purposes.
Iterates through innings elements to process each team’s scorecard.
Processing Innings Data:

For each innings, it extracts player statistics (e.g., runs, balls faced, fours, sixes, strike rate).
Logs player statistics for debugging.
Calls processPlayer to save the player’s data.
Player Data Management - processPlayer(...):

Creates a directory for the team if it doesn’t exist.
Constructs a file path for the player’s Excel file.
Reads existing data from the Excel file or initializes an empty array.
Appends new player data to the array and writes it back to the Excel file.
File Operations:

- dirCreator(filePath): Checks if the directory exists and creates it if necessary.
- excelWriter(filePath, jsonData, sheetName): Writes data to the Excel file.
- excelReader(filePath, sheetName): Reads data from the Excel file if it exists
