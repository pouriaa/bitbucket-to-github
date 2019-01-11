## Bitbucket to Github Migration
This repository transfers ALL of your Bitbucket repositories to Github while maintaining its privacy status.
### Getting Started
To migrate your Bitbucket repositories over to Github, get this repository, fill in the configuration variables, and run `index.js`.
##### Clone the repo
`git clone https://github.com/pouriaa/bitbucket-to-github.git`
##### Enter the repo
`cd bitbucket-to-github/`
##### Install dependencies
`npm i`
##### Make an environment variable file
`cp .env.sample .env`
##### Create an access token on github
Use `https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/` to create your token.
##### Enter your Github and Bitbucket credentials to `.env`
This repository uses the `dotenv` library to handle configuration variables.
##### Run the script
`node index.js`
