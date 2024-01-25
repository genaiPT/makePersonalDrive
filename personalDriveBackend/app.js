
const { login, logout, isLoggedin } = require("./login");
const { csfrCheck, csfrCheckUploads, csfrInsert } = require("./csrfCheck");
const express = require("express");
const session = require("express-session");
const USERS = require("./USERS")
const {getActiveUserName} = require("./utils")

const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const helmet = require('helmet');

const app = express();

// MiddleWare
const secret = "insert a random super secret secret" // EDIT HERE

app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: secret, resave:false, saveUninitialized:false, cookie:{} }))

const origin = "https://yourFrontendSite.com" // INSERT YOUR FRONT END ADDRESS OR LOCALHOST

app.use(cors({ origin: origin, credentials: true }));
app.use(helmet());
app.use(express.json());


const FILESFOLDER = "files" // INSERT PATH TO YOUR FILES OR LEAVE IT AS DEFAULT

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    let userFolder =  getActiveUserName(USERS, req.user)
    const FOLDERPATH = path.join(__dirname, `${FILESFOLDER}/${userFolder}`);
    cb(null, FOLDERPATH);
  },
  filename: function (req, file, cb) {
    // Use the original file name
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage: storage, limits: {
  fileSize: 1024 * 1024 * 1024, // 1gb files
} });

const storageCommon = multer.diskStorage({
  destination: function (req, file, cb) {
    const FOLDERPATH = path.join(__dirname, `${FILESFOLDER}/uploads`);
    cb(null, FOLDERPATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadsCommon = multer({ storage: storageCommon, limits: {
  fileSize: 1024 * 1024 * 1024,
}  });



// ROUTES

app.get("/", csfrInsert, (req, res) => {});

app.post("/login", csfrCheck, login, (req, res) => {});

app.post("/logout", csfrCheck, logout, (req, res) => {});


app.get("/dash", isLoggedin, (req, res) => {
  let userFolder =  getActiveUserName(USERS, req.user)
  const FOLDERPATH = path.join(__dirname, `${FILESFOLDER}/${userFolder}`);
  fs.readdir(`${FOLDERPATH}`, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ files });
  });
});


app.get("/dash/:filename", isLoggedin, (req, res) => {
  let userFolder =  getActiveUserName(USERS, req.user)
  const FOLDERPATH = path.join(__dirname, `${FILESFOLDER}/${userFolder}`);
  const { filename } = req.params;
  if (fs.existsSync(FOLDERPATH)) {
    // Header for download
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/octet-stream");

    // Send download
    const fileStream = fs.createReadStream(`${FOLDERPATH}/${filename}`);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

app.get("/dashcommon", isLoggedin, (req, res) => {
  const FOLDERPATH = path.join(__dirname, `${FILESFOLDER}/uploads`);
  fs.readdir(`${FOLDERPATH}`, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ files });
  });
});

app.get("/dashcommon/:filename", isLoggedin, (req, res) => {
  const FOLDERPATH = path.join(__dirname, `${FILESFOLDER}/uploads`);
  const { filename } = req.params;
  if (fs.existsSync(FOLDERPATH)) {
    // Header for download
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/octet-stream");

    // Send download
    const fileStream = fs.createReadStream(`${FOLDERPATH}/${filename}`);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

app.delete("/dashcommon/:filename", isLoggedin, (req, res) => {
  const {filename} = req.params
  const filePath = path.join(__dirname, `${FILESFOLDER}/uploads/${filename}`);
  console.log(filePath)
  try {
    fs.unlinkSync(filePath)
    res.status(200).json({message: "Ficheiro apagado com sucesso"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Erro ao apagar o ficheiro"})
  }
})

app.delete("/dash/:filename", isLoggedin, (req, res) => {
  const {filename} = req.params
  let userFolder =  getActiveUserName(USERS, req.user)
  const filePath = path.join(__dirname, `${FILESFOLDER}/${userFolder}/${filename}`);
  try {
    fs.unlinkSync(filePath)
    res.status(200).json({message: "Ficheiro apagado com sucesso"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Erro ao apagar o ficheiro"})
  }
})

app.post("/uploads", csfrCheckUploads, isLoggedin, uploads.single("file"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.json({ success: true, message: "received" });
});

app.post("/uploadscommon", csfrCheckUploads, isLoggedin, uploadsCommon.single("file"), (req, res) => {
  console.log(req.file);
  res.json({ success: true, message: "received" });
});

/////
const PORT = 5000

app.listen(PORT, () => {
  console.log(`server runing on port: ${PORT}`);
});
