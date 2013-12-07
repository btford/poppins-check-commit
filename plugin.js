module.exports = function (poppins) {
  var plugins = poppins.plugins;

  if (!plugins.prChecklist) {
    throw new Error('poppins-check-commit requires poppins-pr-checklist to be loaded first');
  }

  plugins.checkCommit = {
    message: "PR's commit messages follow the [commit message format]" +
        "(https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format)",

    condition: function (pr) {
      return poppins.
        getCommits(pr.number).
        then(function (commits) {
          return commits.reduce(function (state, commit) {
            return state && plugins.checkCommit.check(commit.message);
          }, true);
        });
    },

    check: function commit (commit) {
      var regex = plugins.checkCommit.regex;
      var match = commit.message.match(regex);
      return !match || !match[1] || !match[3];
    },

    regex: /^(.*)\((.*)\)\:\s(.*)/
  };

  plugins.prChecklist.checks.push(plugins.checkCommit);
};
