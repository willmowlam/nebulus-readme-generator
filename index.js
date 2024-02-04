// Import required modules (fs, inquirer, util)
const fs = require('fs');
const inquirer = require('inquirer');
const util = require('util');

// Promisify fs.writeFile() to use promises
const writeFileAsync = util.promisify(fs.writeFile);

// Promisify fs.readFile() to use promises
const readFileAsync = util.promisify(fs.readFile);

// The target readme filename
const targetReadmeFile = "./output/README.md";

// Function for prompting user for contents of README
const promptUser = () =>
  inquirer.prompt([

  // Define questions

    {
      type: 'input',
      name: 'title',
      message: 'What is your project Title?',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
      default: 'Project Title'
    },

    {
      type: 'input',
      name: 'description',
      message: 'Provide a short Description explaining the project; eg what was the motivation, what problem does it solve?',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
      default: 'This project is designed to...'
    },

    {
      type: 'input',
      name: 'installation',
      message: 'What are the Installation instructions?',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
      default: 'git clone ...'
    },

    {
      type: 'input',
      name: 'usage',
      message: 'What are the Usage instructions?',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
      default: 'open terminal, run node index.js'
    },

    {
      type: 'input',
      name: 'liveUrl',
      message: 'What is the URL of the live application (optional)?',
      default: 'https://www.example.com'
    },

    {
      type: 'input',
      name: 'screenshotUrl',
      message: 'Provide the local path or URL to a Screenshot of the application (optional)',
      // Validate the screenshot file exists?
      default: './assets/images/screenshot.jpg'
    },

    {
      type: 'input',
      name: 'credits',
      message: 'Enter any Credits (optional).',
      default: 'J Bloggs, A Nother'
    },
    
    {
      type: 'input',
      name: 'features',
      message: 'Enter the project Features (optional).',
      default: 'This app has features X and Y.'
    },
    

    {
      type: 'input',
      name: 'contribution',
      message: 'Please provide Contribution guidelines (optional).',
      default: 'Feel free to contribute to the project by submitting a pull request.'
    },

    {
      type: 'input',
      name: 'tests',
      message: 'Enter the commands users need to run the Tests (optional).',
      default: 'node test.js'
    },

    {
      type: 'input',
      name: 'githubUsername',
      message: 'For the Questions section, enter your GitHub username.',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
      default: 'myGitHubUsername'
    },

    {
      type: 'input',
      name: 'emailAddress',
      message: 'For the Questions section, enter your email address.',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
      default: 'me@example.com'
    },

    {
      type: 'input',
      name: 'badges',
      message: 'What badges would you like to the top of the README (optional)?',
      default: '![nutriSmartApp](https://img.shields.io/github/languages/top/willmowlam/nutriSmartApp)'
    },

    {
      type: 'list',
      name: 'license',
      message: 'Choose a License?',
      choices: [
        {
          name: '1) MIT License\nPermission for commercial/private use, distribution and modification. Must have License and Copyright notices. Limited liability and no warranty.',
          value: 'MIT',
        },
        {
          name: '2) Apache-2.0 License\nAs MIT, but allows patent use and requires documentation of changes. No trademark use without explicit permission.',
          value: 'Apache-2.0',
        },
        {
          name: '3) GNU General Public License v3.0\nAs MIT and Apache but derivative works must also be distributed under the same license and source code made available. No explicit trademark limitation.',
          value: 'GPL-3.0',
        },
      ],
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
      default: 'MIT'
    },

    {
      type: 'input',
      name: 'legalName',
      message: 'What is your Legal Name, to be shown on the License?',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
    //  default: 'Joe Bloggs'
    },

  ]);


// Function to generate markdown
const generateMarkdown = (answers) => 
`
${answers.badges}

# ${answers.title}

## Description

${answers.description}

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Demo URL](#demo)
4. [Screenshot](#screenshot)
5. [Credits](#credits)
6. [Features](#features)
7. [How to Contribute](#contribution)
8. [Tests](#tests)
9. [Questions](#questions)
10. [License](#license)

## Installation Instructions

To install necessary dependencies, run the following command in your terminal:
\`\`\`
${answers.installation}
\`\`\`

## Usage Information

${answers.usage}

## Demo

Use the following link to view a live demo of this application: 

[Live Demo](${answers.liveUrl})

## Screenshot

![Screenshot of Application](${answers.screenshotUrl})

## Credits

This project was developed by ${answers.credits}.

## Features

${answers.features}

## Contribution

${answers.contribution}

## Tests

${answers.tests}

## Questions

${answers.questions}

## License

![GitHub License](https://img.shields.io/github/license/:user/:repo)

${answers.licenseText}

`;

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


// Translate the tokens in the license template
const getLicenseText = (answers, template) => {

  // Retrieve license text based on the selected license
  let licenseText = template;

  // Throw error if unable to get license
  if (typeof licenseText !== 'string' || licenseText.length === 0) {
      throw new Error('Failed to retrieve license text');
  }

  // Change any <year> to current year
  const currentYear = new Date().getFullYear();

  switch (answers.license){
    case "MIT":
      // Update placeholder for current year   
      licenseText = licenseText.replace(/\[year\]/g, `${currentYear}`);

      // Update placeholder for the legal owner
      licenseText = licenseText.replace(/\[fullname\]/g, `${answers.legalName}`);

      break;
    case "Apache-2.0":
      // Update placeholder for current year  
      licenseText = licenseText.replace(/\[yyyy\]/g, `${currentYear}`);

      // Update placeholder for the legal owner
      licenseText = licenseText.replace(/\[name of copyright owner\]/g, `${answers.legalName}`);

      break;

    case 'GPL-3.0':
      // Update placeholder for current year   
      licenseText = licenseText.replace(/<year>/g, `${currentYear}`);

      // Update placeholder for current year   
      licenseText = licenseText.replace(/<program>/g, `${answers.title}`);
        
      // Update placeholder for the legal owner
      licenseText = licenseText.replace(/<name of author>/g, `${answers.legalName}`);

      // Change program name to project title
      licenseText = licenseText.replace(/<one line to give the program\'s name and a brief idea of what it does.>/g,  `${answers.description}`);
      
      break;
  }

  // Add the license text to the answers object
  answers.licenseText = licenseText;

  return answers;
}

// Call the prompt function to gather user input and create markdown README file using promisify to asynchronously write the file. Log any errors.
promptUser()

  // Get license template
  .then(async (answers) => {

    const licenseTemplate = await readFileAsync(`./assets/licenses/${answers.license}`, 'utf8');
    return {answers, licenseTemplate};

  })
  
  // Get the license
  .then(( {answers, licenseTemplate} ) => {   

    return getLicenseText(answers, licenseTemplate);

  })
  
  // Write markdown file from answers
  .then((answers) => writeFileAsync(targetReadmeFile, generateMarkdown(answers)))

  // Log success
  .then(() => console.log(`Successfully wrote to ${targetReadmeFile}`))

  // Catch errors and write to console
  .catch((err)=> console.error(err));