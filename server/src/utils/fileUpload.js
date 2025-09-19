const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ServerError = require('../errors/ServerError');
const env = process.env.NODE_ENV || 'development';
const {
  STATIC_IMAGES_PATH,
  STATIC_FOLDER: { AVATARS, CONTESTS, LOGOS },
} = require('./../constants');
const devFilePath = STATIC_IMAGES_PATH;

const filePath = env === 'production' ? '/var/www/html/images/' : devFilePath;

const folders = {
  avatars: AVATARS,
  contests: CONTESTS,
  logos: LOGOS,
};

Object.values(folders).forEach(dir => {
  const fullDir = path.join(filePath, dir);
  if (!fs.existsSync(fullDir)) {
    fs.mkdirSync(fullDir, {
      recursive: true,
    });
  }
});

const storageContestFiles = dir =>
  multer.diskStorage({
    destination (req, file, cb) {
      cb(null, path.join(filePath, dir));
    },
    filename (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

const uploadAvatars = multer({
  storage: storageContestFiles(AVATARS),
}).single('file');
const uploadContestFiles = multer({
  storage: storageContestFiles(CONTESTS),
}).array('files', 3);
const updateContestFile = multer({
  storage: storageContestFiles(CONTESTS),
}).single('file');
const uploadLogoFiles = multer({
  storage: storageContestFiles(LOGOS),
}).single('offerData');

module.exports.uploadAvatar = (req, res, next) => {
  uploadAvatars(req, res, err => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

module.exports.uploadContestFiles = (req, res, next) => {
  uploadContestFiles(req, res, err => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

module.exports.updateContestFile = (req, res, next) => {
  updateContestFile(req, res, err => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

module.exports.uploadLogoFiles = (req, res, next) => {
  uploadLogoFiles(req, res, err => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};
