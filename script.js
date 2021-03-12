#!/usr/bin/env node
let fse = require("fs-extra");
let fs = require("fs");
let cmd = process.argv.slice(2);
let options = [];
let folder = [];
let Images = ["png","jpg","jpeg","gif","svg"];
let Videos = ["mp4","mp2","m4v","mv4","mov"];
let Documents = ["pdf","txt","doc"]
let Audios = ["mp3","au","mpc"]
for (let x in cmd) {
  if (cmd[x].startsWith("-") && cmd[x].length == 2) {
    options.push(cmd[x]);
  } else {
    folder.push(cmd[x]);
  }
}

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
    if (Documents.includes(files[x].split(".")[1])) {
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

    if (Images.includes(files[x].split(".")[1])) {
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

    if (Videos.includes(files[x].split(".")[1])) {
      if (!folders.includes("Videos")) {
        createDir("./" + outputdir + "/Videos");
        folders.push("Videos");
        folder.push("Videos");
      }
      fs.copyFileSync(
        "./" + outputdir + "/" + files[x],
        "./" + outputdir + "/Videos/" + files[x]
      );
      deletefile("./" + outputdir + "/" + files[x]);
    }

    if (Audios.includes(files[x].split(".")[1])) {
      if (!folders.includes("Audios")) {
        createDir("./" + outputdir + "/Audios");
        folders.push("Audios");
        folder.push("Audios");
      }
      fs.copyFileSync(
        "./" + outputdir + "/" + files[x],
        "./" + outputdir + "/Audios/" + files[x]
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
