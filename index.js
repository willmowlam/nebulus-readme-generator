// TODO
/*
  License Badge 
  Questions (email, GitHub username)
  Validation
  Remove table of contents for optional sections
  List prompts: Install, Features, Usage, Tests
  Video
*/

// Import required modules (fs, inquirer, util)
const fs = require('fs');
const inquirer = require('inquirer');
const util = require('util');

// Promisify fs.writeFile() to use promises
const writeFileAsync = util.promisify(fs.writeFile);

// Promisify fs.readFile() to use promises
const readFileAsync = util.promisify(fs.readFile);

// Target readme file
const targetReadmeFile = "./output/README.md";

// Target LICENSE file
const targetLicenseFile = "./output/LICENSE";

// Get the current year
const currentYear = new Date().getFullYear();

// Function for prompting user for contents of README
const promptUser = () =>
  inquirer.prompt([

    {
      type: 'input',
      name: 'githubURL',
      message: 'What is your project GitHub URL?',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
      // Validate this repo exists
    },

    {
      type: 'input',
      name: 'title',
      message: 'What is your project Title?',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
    },

    {
      type: 'input',
      name: 'description',
      message: 'Provide a short Description explaining the project; eg what was the motivation, what problem does it solve?',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
    },

    {
      type: 'input',
      name: 'installation',
      message: 'What are the Installation instructions?',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
    },

    {
      type: 'input',
      name: 'usage',
      message: 'What are the Usage instructions?',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
    },

    {
      type: 'input',
      name: 'liveUrl',
      message: 'What is the URL of the live application (optional)?',
      // Validate, if provided this does not 404
    },

    {
      type: 'input',
      name: 'screenshotUrl',
      message: 'Provide the local path or URL to a Screenshot of the application (optional)',
      // Validate, if provided the screenshot file exists?
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

    {
      type: 'input',
      name: 'contribution',
      message: 'Please provide Contribution guidelines (optional).',
    },

    {
      type: 'input',
      name: 'tests',
      message: 'Enter the commands users need to run the Tests (optional).',
    },

    {
      type: 'input',
      name: 'emailAddress',
      message: 'For the Questions section, enter your email address.',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
      // Validate is an email address
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
    },

    {
      type: 'input',
      name: 'legalName',
      message: 'What is your Legal Name, to be shown on the License?',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
    },

  ]);


// Function to generate markdown
const generateMarkdown = (answers) => 
`[![Language](https://img.shields.io/github/languages/top/${answers.githubSlug}?style=flat-square)](https://github.com/${answers.githubSlug}) [![Languages](https://img.shields.io/github/languages/count/${answers.githubSlug}?style=flat-square)](https://github.com/${answers.githubSlug}) &nbsp;
[![Issues](https://img.shields.io/github/issues/${answers.githubSlug}.svg?style=flat-square)](https://github.com/${answers.githubSlug}/issues) [![Pull Requests](https://img.shields.io/github/issues-pr/${answers.githubSlug}.svg?style=flat-square)](https://github.com/${answers.githubSlug}/pulls) &nbsp;
[![Stars](https://img.shields.io/github/stars/${answers.githubSlug}.svg?style=social&label=Stars)](https://github.com/${answers.githubSlug}) [![Forks](https://img.shields.io/github/forks/${answers.githubSlug}.svg?style=social&label=Forks)](https://github.com/${answers.githubSlug})

# ${answers.title}

## Description

${answers.description}

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Demo](#demo)
4. [Screenshot](#screenshot)
5. [Credits](#credits)
6. [Features](#features)
7. [How to Contribute](#contribution)
8. [Tests](#tests)
9. [Questions](#questions)
10. [License](#license)

## Installation

To install necessary dependencies, run the following command(s) in your terminal:
\`\`\`jsx
${answers.installation}
\`\`\`

## Usage

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

Copyright (c) ${currentYear} ${answers.legalName}

${answers.title} is [${answers.license} licensed](./LICENSE).

`;

const getGitHubSlug = (url) => {

  // Remove the domain part 
  const path = url.replace("https://github.com/", "");

  // Split the path array
  const pathArray = path.split("/");

  // Return the username and project slug
  return `${pathArray[0]}/${pathArray[1]}`;

};

const getGitHubUsername = (url) => {

  // Remove the domain part 
  const path = url.replace("https://github.com/", "");

  // Split the path array
  const pathArray = path.split("/");

  // Return the username
  return `${pathArray[0]}`;

};

// Translate the tokens in the license template
const getLicenseText = (answers, template) => {

  // Retrieve license text based on the selected license
  let licenseText = template;

  // Throw error if unable to get license
  if (typeof licenseText !== 'string' || licenseText.length === 0) {
      throw new Error('Failed to retrieve license text');
  }

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

// Call the prompt function to gather user input, format then asynchronously write the README and LICENSE files using promisify.
promptUser()
  
  // Format fields
  .then((answers) => {    

    // Get gitHubSlug from provided url
    answers.githubSlug = getGitHubSlug(answers.githubURL);
    return answers;
  })

  // Write README and LICENSE files
  .then(async (answers) => {

    // Get license template and customise the license text
    const licenseTemplate = await readFileAsync(`./assets/licenses/${answers.license}`, 'utf8');
    answers = getLicenseText(answers, licenseTemplate);

    // Write LICENSE file
    await writeFileAsync(targetLicenseFile, answers.licenseText);
    console.log(`Successfully wrote to ${targetLicenseFile}`);

    // Write README.md
    await writeFileAsync(targetReadmeFile, generateMarkdown(answers));
    console.log(`Successfully wrote to ${targetReadmeFile}`);
  })

  // Catch errors and write to console
  .catch((err)=> console.error(err));