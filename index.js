const Bitbucket = require("./bin/Bitbucket");
const Github = require("./bin/Github");
const dotenv = require("dotenv");

// load in our environment variables
dotenv.config();

(async () => {
  // get all the bitbucket repositories we're going to transfer
  const repositories = await Bitbucket.getRepositories();

  // create a new repository on Github for the repos
  const successfulCreates = await Github.createRepositories(repositories);

  // clone into a local folder
  const successfulClones = await Bitbucket.pullRepositories(successfulCreates);

  // push to Github
  const succesfulPushes = await Github.pushRepositories(successfulClones);

  console.log(
    "Migrated the following repos sucessfully:\r\n",
    succesfulPushes.map(repo => repo.slug).join("\r\n")
  );
})();
