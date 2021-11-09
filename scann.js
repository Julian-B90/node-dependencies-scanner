"use strict";

const { exec } = require("child_process");

const FgGreen = "\x1b[32m";
const FgRed = "\x1b[31m";

let args = {
  path: [],
  dependecies: [],
};
process.argv.slice(2).forEach((item) => {
  const newArg = item.split("=");
  args = {
    ...args,
    [newArg[0]]: newArg[1].split(","),
  };
});

const recursiveSearch = (obj, searchKey, results = []) => {
  const r = results;
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value === searchKey) {
      r.push(value);
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
    const libs = [];
    for (let listItem of npmList) {
      if (listItem && listItem.length > 0) {
        libs.push(listItem.replace(`${itemPath}/node_modules/`, ""));
      }
    }

    args.dependecies.forEach((dep) => {
      const found = recursiveSearch(libs, dep, []);
      if (found.length > 0) {
        console.error(FgRed, "found dependency", found);
      } else {
        console.log(FgGreen, "dependency not found");
      }
    });
  });
});
