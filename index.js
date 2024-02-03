// Import required modules (fs, inquirer, util)
const fs = require('fs');
const inquirer = require('inquirer');
const util = require('util');

// Promisify fs.writeFile() to use promises
const writeFileAsync = util.promisify(fs.writeFile);

// Function for prompting user for contents of README
const promptUser = () =>
  inquirer.prompt([

  // Define questions

    {
      type: 'input',
      name: 'title',
      message: 'What is your project Title?',
    },

    {
      type: 'input',
      name: 'description',
      message: 'Provide a short Description explaining the project; eg what was the motivation, what problem does it solve?',
    },

    {
      type: 'input',
      name: 'instructions',
      message: 'What are the Installation instructions?',
    },

    {
      type: 'input',
      name: 'usage',
      message: 'What are the Usage instructions?',
    },

    {
      type: 'input',
      name: 'liveUrl',
      message: 'What is the URL of the live application (optional)?',
    },

    {
      type: 'input',
      name: 'screenshotUrl',
      message: 'Provide a link to a Screenshot of the application (optional)',
    },

    {
      type: 'input',
      name: 'credits',
      message: 'Enter any Credits (optional).',
    },
    
    {
      type: 'input',
      name: 'features',
      message: 'Enter the project Features (optional).',
    },
    

    // Is this a open source project?
      // If yes; 
      {
        type: 'input',
        name: 'contribution',
        message: 'Please provide Contribution guidelines (optional).',
      },

    // Do you have any tests included with your application? 
      // If yes;
      {
        type: 'input',
        name: 'tests',
        message: 'Enter the commands users need to run the Tests (optional).',
      },

    {
      type: 'input',
      name: 'githubUsername',
      message: 'For the Questions section, enter your GitHub username.',
    },

    {
      type: 'input',
      name: 'emailAddress',
      message: 'For the Questions section, enter your email address.',
    },

    // Would you like to add badges to the top of the README?
      // If yes, select which type(s)? [GitHub, npm]
      {
        type: 'input',
        name: 'badges',
        message: 'What badges would you like to the top of the README (optional)?',
      },

      // MIT, GNU, Creative Commons, Apache 2.0, BSD-2-Clause
      {
        type: 'input',
        name: 'license',
        message: 'What is the project License?',
      },

/*    
      MIT License
      Permission for commercial/private use, distribution and modification. Must have License and Copyright notices. Limited liability and no warranty.

      Apache License 2.0
      As MIT, but allows patent use and requires documentation of changes. No trademark use without explicit permission.

      GNU GPLv3
      As MIT and Apache but derivative works must also be distributed under the same license and source code is available. No explicit trademark limitation.
*/

    ]);


// Function to generate markdown
const generateMarkdown = data => {
   return `
   
    ## ${data.title}
   
   `};

    // Badges (optional)
    // Title
    // Description
    // Table of Contents (auto generated)
    // Installation
    // Usage
    // Demo URL (optional)
    // Screenshot (optional)
    // Credits (optional)
    // Features (optional)
    // How to Contribute (optional)
    // Tests (optional)
    // Questions
    // License

// Call the prompt function to gather user input and create markdown README file using promisify to asynchronously write the file. Log any errors.
promptUser()
  
   // Write markdown file from answers
  .then((answers) => writeFileAsync('output/README.md', generateMarkdown(answers)))

  // Log success
  .then(() => console.log('Successfully wrote to output/README.md'))

  // Catch errors and write to console
  .catch((err)=> console.error(err));