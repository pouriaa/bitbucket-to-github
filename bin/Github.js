const request = require("request-promise");
const path = require("path");
const exec = require("util").promisify(require("child_process").exec);

class Github {
  /**
   * Create repositories on Github an array
   * of Bitbucket repositories
   *
   * @param {Array} repositories
   * @returns {Array} of successfully created `repositories`
   */
  static async createRepositories(repositories) {
    // keep track of which repos have failed to be created on Github
    const successfulRepos = [];

    for (let i = 0; i < repositories.length; i++) {
      // create the repository
      let success = await Github.createRepository(repositories[i]);

      // we don't want to try to clone to existing repos later
      if (success) {
        console.log("created repository for", repositories[i].slug);
        successfulRepos.push(repositories[i]);
      }
    }

    return successfulRepos;
  }

  /**
   * Create a new repository on Github.
   *
   * @param {Object} repository single Bitbucket repo resource
   * @returns {Bolean} success status
   */
  static async createRepository(repository) {
    const isOrg = process.env.GITHUB_USERNAME !== process.env.GITHUB_WORKSPACE
    const url = isOrg
      ? `https://api.github.com/orgs/${process.env.GITHUB_WORKSPACE}/repos`
      : "https://api.github.com/user/repos"

    try {
      // make the request for a new repo
      await request.post({
        url,
        body: {
          name: repository.slug,
          description: repository.description,
          private: repository.is_private,
          has_issues: repository.has_issues,
          has_wiki: repository.has_wiki
        },
        headers: {
          "User-Agent": "UA is required",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        },
        json: true
      });
    } catch (e) {
      // something went wrong, log the message
      // but don't kill the script
      const errors = e.error.errors;

      for (let i = 0; i < errors.length; i++) {
        console.log(
          "Failed creating repository",
          repository.slug + ",",
          errors[i].message + "."
        );
      }
      return false;
    }

    return true;
  }

  static async pushRepositories(repositories) {
    // keep track of which repos have failed to be pushed to Github
    const successfulRepos = [];

    for (let i = 0; i < repositories.length; i++) {
      // create the repository
      let success = await Github.pushRepository(repositories[i]);

      // keep track of which repos were pushed for reporting
      if (success) {
        console.log("pushed repository for", repositories[i].slug);
        successfulRepos.push(repositories[i]);
      }
    }
    return successfulRepos;
  }

  /**
   * Push to the repository a new repository on Github.
   *
   * @param {Object} repository single Bitbucket repo resource
   * @returns {Bolean} success status
   */
  static async pushRepository(repository) {
    // set upstream
    // push

    // path to the local repository
    const pathToRepo = path.resolve(
      __dirname,
      "../repositories/",
      repository.slug
    );

    // initialize a folder and git repo on this machine
    // add Bitbucket as a remote and pull
    let commands = ` cd ${pathToRepo} \
                && git init \
                && git remote set-url origin https://${
                  process.env.GITHUB_USERNAME
                }:${process.env.GITHUB_TOKEN}@github.com/${
      process.env.GITHUB_WORKSPACE
    }/${repository.slug}.git \
                && git push origin master`;
    try {
      // initialize repo
      await exec(commands);

      return true;
    } catch (e) {
      console.log(e);
      console.log("couldn't push repository", repository.slug);
    }

    return false;
  }
}

module.exports = Github;
