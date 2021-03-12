const { createDecipher } = require("crypto");
let fse = require("fs-extra");
let fs = require("fs");
let cmd = process.argv.slice(2);
let options = [];
let folder = [];
for (let x in cmd) {
  if (cmd[x].startsWith("-") && cmd[x].length == 2) {
    options.push(cmd[x]);
  } else {
    folder.push(cmd[x]);
  }
}

console.log(options);
console.log(folder);

if (options.includes("-m") && options.includes("-o")) {
  let dirNames = folder[0];
  let outputdir = folder[1];
  organiseFile(dirNames);
  moveFile(dirNames, outputdir);
} else if (options.includes("-o")) {
  let dirNames = folder[0];
  organiseFile(dirNames);
} else if (options.includes("-d")) {
  let delDir = folder[0];
  deleteFile(folder[0], folder[1]);
} else if (options.includes("-m")) {
  let dirNames = folder[0];
  moveFile(dirNames, folder[1]);
} else {
  helpView();
}

function helpView() {
  console.log("-o [FolderName]              :- organize [FolderName]");
  console.log(
    "-m [SrcFolder] [DestFolder]  :- move [SrcFolder] to [DestFolder]"
  );
  console.log("-d [FolderName] [InnerFolder]:- delete inner [FileName]");
  console.log("-help                        :- show help");
}

function deleteFile(dirName, delDir) {
  if (!fs.existsSync(dirName)) {
    console.log("Folder " + delDir + " doesn't exist");
    helpView();
  } else {
    deleteDir("./" + dirName + "/" + delDir);
  }
}

function moveFile(dirNames, outputdir) {
  if (!fs.existsSync(dirNames)) {
    console.log("Folder " + dirNames + " doesn't exist");
    helpView();
    process.exit(1);
  }
  if (!fs.existsSync(outputdir)) {
    createDir(outputdir);
  }
  let folders = [];
  let dir = fs.readdirSync(dirNames);
  dir.forEach((item) => {
    folders.push(item);
  });
  fse.copySync("./" + dirNames , "./" + outputdir);
}

function organiseFile(outputdir) {
  for (let x in folder) {
    if (!fs.existsSync(folder[x])) {
      console.log("Folder " + folder[x] + " doesn't exist");
      helpView();
      process.exit(1);
    }
  }

  let folders = [];
  let files = [];

  let dir = fs.readdirSync(outputdir);
  dir.forEach((item) => {
    if (item.includes(".")) {
      files.push(item);
    } else {
      folders.push(item);
    }
  });

  for (let x in files) {
    if (files[x].split(".")[1] == "txt") {
      if (!folders.includes("Documents")) {
        createDir("./" + outputdir + "/Documents");
        folders.push("Documents");
        folder.push("Documents");
      }
      fs.copyFileSync(
        "./" + outputdir + "/" + files[x],
        "./" + outputdir + "/Documents/" + files[x]
      );
      deletefile("./" + outputdir + "/" + files[x]);
    }

    if (files[x].split(".")[1] == "png") {
      if (!folders.includes("Images")) {
        createDir("./" + outputdir + "/Images");
        folders.push("Images");
        folder.push("Images");
      }
      fs.copyFileSync(
        "./" + outputdir + "/" + files[x],
        "./" + outputdir + "/Images/" + files[x]
      );
      deletefile("./" + outputdir + "/" + files[x]);
    }
  }
}

function createDir(path) {
  fs.mkdirSync(path, (err) => {
    if (err) throw err;
  });
}

function deletefile(path) {
  fs.rm(path, (err) => {
    if (err) throw err;
  });
}

function deleteDir(path) {
  fs.rmdir(path, { recursive: true }, (err) => {
    if (err) throw err;
  });
}
