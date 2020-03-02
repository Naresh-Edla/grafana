'use strict';
const {
  promises: { readFile },
} = require('fs');
const { resolve } = require('path');

module.exports = async baseConfig => {
  // From CLI
  const {
    env: { CWD },
  } = baseConfig;

  if (CWD) {
    const projectConfig = await readFile(`${CWD}/cypress.json`, 'utf8')
      .then(JSON.parse)
      .then(config => {
        const pathKeys = [
          'fileServerFolder',
          'fixturesFolder',
          'ignoreTestFiles',
          'integrationFolder',
          'pluginsFile',
          'screenshotsFolder',
          'supportFile',
          'testFiles',
          'videosFolder',
        ];

        return Object.fromEntries(
          Object.entries(config).map(([key, value]) => {
            if (pathKeys.includes(key)) {
              return [key, resolve(CWD, value)];
            } else {
              return [key, value];
            }
          })
        );
      });

    return { ...baseConfig, ...projectConfig };
  } else {
    // Temporary legacy support for Grafana core (using `yarn start`)
    return baseConfig;
  }
};
