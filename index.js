// TODO
/*
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

// Test if the provided url appears to be a valid GitHub url
const isValidGitHubProjectUrl = (url) => {

  const gitHubDomainUrl = "https://github.com/";

  // Make sure url starts with https://github.com/
  if (url.search(/^https\:\/\/github\.com\//) === -1){return false;}

  // Remove the domain part 
  const path = url.replace(gitHubDomainUrl, "");

  // Split the path array
  const pathArray = path.split("/");

  // Check the username and repo parts exist
  if  ((!pathArray[0]) || (!pathArray[1])){return false;}

  // Valid url so return true
  return true;
};

// Function for repeat prompt
// Take object (eg answers.installation) and display a question to generate an array of answers (ie answers.installation[n])
// Usage: await arrayPrompt(answers.installation, "Enter the next installation step or enter to end")
const arrayPrompt = async function (obj, question){

  // Convert obj to an array if necessary
  if (!Array.isArray(obj)) {
    obj = [];
  }

  // Ask prompt
  const ask = async () => {
    const { answer } = await inquirer.prompt([
      {
        type: 'input',
        name: 'answer',
        message: question,
      }
    ]);

    // Save answer
    if (answer.trim() !== '' ){
      obj.push(answer);
      // Ask again
      await ask();
    }
  };

  // Ask again
  await ask();

  // Return array of obj
  return obj;
}


// Function for prompting user for contents of README
const promptUser = async () => {

  let answers = await inquirer.prompt([

    {
      type: 'input',
      name: 'githubURL',
      message: 'What is your project GitHub URL?',
      validate: function (value) {
        value = value.trim();
        if (!value) {
          return 'This is required in order to build the README.';
        }
        if (!isValidGitHubProjectUrl(value)) {
          return 'Please enter a valid GitHub repo URL (eg https://github.com/username/repo). Press CTRL+C to cancel.';
        }
        return true;
      }
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
      message: 'Provide a short Description explaining your project.',
      validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
    },

    {
      type: 'confirm',
      name: 'includeInstallationSteps',
      message: 'Would you like to include installation steps? Press CTRL+C to cancel.',
      default: false,
    }
  ]);

  // Ask if the user wants multistep installation instructions
  if (answers.includeInstallationSteps) {
    // Add installation steps
    const arraySteps = await arrayPrompt(answers.installation, "Enter the next installation step or enter to end");
    answers.installation = arraySteps;
  }else{
    // Add single installation text 
    answers = { ...answers, ...(await inquirer.prompt([
      {
        type: 'input',
        name: 'installation',
        message: 'What are the Installation instructions?',
        validate: value => value.trim() ? true : 'This is required in order to build the README. Press CTRL+C to cancel.',
      }
    ]))};
  }

  // Continue building answers to questions
  answers = { ...answers, ...(await inquirer.prompt([

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
    },

    {
      type: 'input',
      name: 'screenshotUrl',
      message: 'Provide the local path or URL to a Screenshot of the application (optional)',
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
      name: 'contributing',
      message: 'Please provide Contributing guidelines (optional).',
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
      validate: function(value) {
        if (!value.trim()){
          return 'This is required in order to build the README. Press CTRL+C to cancel.';
        }
        // Checking for valid email using regex
        // From https://emailregex.com/ 
        // General Email Regex (RFC 5322 Official Standard)
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(value)){
          return 'Please enter a valid email address.';
        }
        return true;
      }      
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

  ]))};

  return answers;
};


// Function to generate markdown
const generateMarkdown = (answers) => {

markdown =
`[![License](https://img.shields.io/github/license/${answers.githubSlug}?style=flat-square)](https://github.com/${answers.githubSlug}/blob/main/LICENSE) &nbsp;
[![Language](https://img.shields.io/github/languages/top/${answers.githubSlug}?style=flat-square)](https://github.com/${answers.githubSlug}) [![Languages](https://img.shields.io/github/languages/count/${answers.githubSlug}?style=flat-square)](https://github.com/${answers.githubSlug}) &nbsp;
[![Issues](https://img.shields.io/github/issues/${answers.githubSlug}.svg?style=flat-square)](https://github.com/${answers.githubSlug}/issues) [![Pull Requests](https://img.shields.io/github/issues-pr/${answers.githubSlug}.svg?style=flat-square)](https://github.com/${answers.githubSlug}/pulls) &nbsp;
[![Stars](https://img.shields.io/github/stars/${answers.githubSlug}.svg?style=social&label=Stars)](https://github.com/${answers.githubSlug}) [![Forks](https://img.shields.io/github/forks/${answers.githubSlug}.svg?style=social&label=Forks)](https://github.com/${answers.githubSlug})

# ${answers.title}

## Description

${answers.description}

## Table of Contents
`;

// Add markdown for Table of Contents

let i = 0;

if (answers.installation) {
  i++;
  markdown += `${i}. [Installation](#installation)\n`;
}

if (answers.usage){
  i++;
  markdown +=  `${i}. [Usage](#usage)\n`;
}

if (answers.liveUrl){
  i++
  markdown += `${i}. [Demo](#demo)\n`;
}

if (answers.screenshotUrl){
  i++
  markdown += `${i}. [Screenshot](#screenshot)\n`;
}

if (answers.credits){
  i++
  markdown += `${i}. [Credits](#credits)\n`;
}

if (answers.features){
  i++
  markdown += `${i}. [Features](#features)\n`;
}

if (answers.contributing){
  i++
  markdown += `${i}. [Contributing](#contributing)\n`;
}

if (answers.tests){
  i++
  markdown += `${i}. [Tests](#tests)\n`;
}

if (answers.questions){
  i++
  markdown += `${i}. [Questions](#questions)\n`;
}

if (answers.license){
  i++
  markdown += `${i}. [License](#license)\n`;
}

// Add markdown for Installation
if (answers.installation) {
  markdown += 
  `
  ## Installation

  `;

  // Check if this is a multi-step installation instruction
  if (!Array.isArray(answers.installation)){
    markdown += answers.installation + '\n';
  }else{
    markdown += `To install, run the following command(s) in your terminal:\n\n`;
    markdown += `\`\`\`\n`;
    for (let i = 0; i < answers.installation.length; i++) {
      const step = answers.installation[i];
      markdown += `${step}\n`;   
    }
    markdown += `\`\`\`\n`;
  }
}

// Add markdown for Usage
if (answers.usage) {
  markdown += 
`
## Usage

${answers.usage}
`}

// Add markdown for Demo
if (answers.liveUrl) {
  markdown += 
`
## Demo

Use the following link to view a live demo of this application: 

[Live Demo](${answers.liveUrl})
`}

// Add markdown for Screenshot
if (answers.screenshotUrl) {
  markdown += 
`
## Screenshot

![Screenshot of Application](${answers.screenshotUrl})
`}

// Add markdown for Credits
if (answers.credits) {
  markdown += 
`
## Credits

This project was developed by ${answers.credits}.
`}

// Add markdown for Features
if (answers.features) {
  markdown += 
`
## Features

${answers.features}
`}

// Add markdown for Contributing
if (answers.contributing) {
  markdown += 
`
## Contributing

${answers.contributing}
`}

// Add markdown for Tests
if (answers.tests) {
  markdown += 
`
## Tests

${answers.tests}
`}

// Add markdown for Questions
if (answers.questions) {
  markdown += 
`
## Questions

${answers.questions}
`}

// Add markdown for License
if (answers.license) {
  markdown += 
`
## License

Copyright (c) ${currentYear} ${answers.legalName}

${answers.title} is [${answers.license} licensed](./LICENSE).

`}

return markdown;

};

// Return the github username and project slug from a github url
const getGitHubSlug = (url) => {

  // Remove the domain part 
  const path = url.replace("https://github.com/", "");

  // Split the path array
  const pathArray = path.split("/");

  // Return the username and project slug
  return `${pathArray[0]}/${pathArray[1]}`;

};

// Return the GitHub username from a github url
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

    // Get gitHubSlug and Username from provided url
    answers.githubSlug = getGitHubSlug(answers.githubURL);
    answers.githubUsername = getGitHubUsername(answers.githubURL);

    if (answers.emailAddress){
      answers.questions = `If you have any questions, please email [${answers.emailAddress}](mailto:${answers.emailAddress}) or visit my GitHub profile at [https://github.com/${answers.githubUsername}](https://github.com/${answers.githubUsername})`;
    }

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