module.exports = function (poppins) {
  var plugins = poppins.plugins;

  if (!plugins.prChecklist) {
    throw new Error('poppins-check-commit requires poppins-pr-checklist to be loaded first');
  }

  pluggins.checkCommit = {
    message: "PR's commit messages follow the [commit message format](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#)",
    condition: function (data) {
      return poppins.
        getCommits(data.number).
        then(function (commits) {
          return commits.reduce(function (state, commit) {
            return state && pluggins.checkCommit.check(commit.message);
          }, true);
        });
    },

    check: function commit (commit) {
      var regex = pluggins.checkCommit.regex;
      var match = commit.message.match(regex);
      return !match || !match[1] || !match[3];
    },

    regex: /^(.*)\((.*)\)\:\s(.*)/
  };

  plugins.prChecklist.checks.push(pluggins.checkCommit);
};
