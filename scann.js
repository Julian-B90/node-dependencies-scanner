"use strict";

const { exec } = require("child_process");
const path = require("path");

const FgGreen = "\x1b[32m";
const FgRed = "\x1b[31m";

let args = {
  path: [],
  dependencies: [],
};
process.argv.slice(2).forEach((item) => {
  const newArg = item.split("=");
  args = {
    ...args,
    [newArg[0]]: newArg[1].split(","),
  };
  if (args.p) {
    args.path = args.p;
  }
  if (args.d) {
    args.dependencies = args.d;
  }
});

const recursiveSearch = (obj, searchKey, results = []) => {
  const r = results;
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value.endsWith(searchKey)) {
      const pjson = require(`${value}${path.sep}package.json`);
      r.push(`${searchKey}: ${pjson.version}`);
    }
    if (typeof value === "object") {
      recursiveSearch(value, searchKey, r);
    }
  });
  return r;
};

args.path.forEach((itemPath) => {
  process.chdir(itemPath);
  console.info(`run in ${itemPath}`);

  exec(`npm list --parseable`, (erro, stdout, stderr) => {
    const npmList = stdout.split("\n");
    args.dependencies.forEach((dep) => {
      const found = recursiveSearch(npmList, dep, []);
      if (found.length > 0) {
        console.error(FgRed, "found dependency", found);
      } else {
        console.log(FgGreen, `${dep}: not found`);
      }
    });
  });
});
