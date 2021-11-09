'use strict';

const { exec } = require('child_process');

const recursiveSearch = (obj, searchKey, results = []) => {
  const r = results;
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value === searchKey) {
      r.push(value);
    }
    if (typeof value === 'object') {
      recursiveSearch(value, searchKey, r);
    }
  });
  return r;
};

exec('npm list --parseable', (erro, stdout, stderr) => {
  const npmList = stdout.split('\n');
  const currentPath = __dirname;
  const libs = [];
  for (let index = 0; index < npmList.length; index++) {
    libs.push(npmList[index].replace(`${currentPath}/node_modules/`, ''));
  }
  const found_coa = recursiveSearch(npmList, 'coa', []);
  const found_rc = recursiveSearch(npmList, 'rc', []);
  console.log('found_coa', found_coa);
  console.log('found_rc', found_rc);
});
