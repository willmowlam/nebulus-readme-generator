// Import required modules (fs, inquirer, util)

// Promisify fs.writeFile() to use promises

// Function for prompting user for contents of README

  // Define questions

    // What is your project title

    // Provide a short Description explaining the project; eg what was the motivation, what problem does it solve?

    // What are the Installation instructions?

    // What are the Usage instructions?

    // What is the URL of the live application?

    // Provide a link to the screenshot image file (optional)

    // Is this a open source project?
      // If yes; Please provide Contribution guidelines.

    // Do you have any tests included with your application? 
      // If yes, enter the commands users need to run them.

    // For the questions section, enter your GitHub username.

    // For the questions section, enter your email address.

    // Would you like to add badges to the top of the README?   
      // If yes, select which type(s)? [GitHub, npm]


// Function to generate markdown

    // Badges (optional)
    // Title
    // Description
    // Table of Contents (auto generated)
    // Installation
    // Usage
    // Demo URL (optional)
    // Screenshot (optional)
    // Credits
    // Features (optional)
    // How to Contribute (optional)
    // Tests (optional)
    // Questions
    // License

// Call the prompt function to gather user input and create markdown README file using promissify to asynchronously write the file. Log any errors.
