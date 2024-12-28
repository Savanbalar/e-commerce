const config = require("../config/config");
const moment = require('moment');
const fs = require('fs');
// const { resolve } = require("path");



const saveFile = (files, uploadPath = '') => {
    let fileUploadPath = config.fileUploadPath + '/images/' + uploadPath;
    const fileName = moment().unix() + Math.floor(1000 + Math.random() * 9000) + '.' + files.name.split('.').pop();
    // console.log(fileName,"fileName");

    return new Promise(async (resolve, reject) => {
        fileUploadPath = fileUploadPath + '/' + fileName;
        files.mv(fileUploadPath, async (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    upload_path: '/images/' + uploadPath + '/' + fileName,
                    file_name: fileName
                });
            }
        });
    })
}


const removeFile = (file_name) => {
    let fileUploadPath = config.fileUploadPath;
    return new Promise(async (resolve, reject) => {
        fileUploadPath = fileUploadPath + file_name;
        fs.unlink(fileUploadPath, async (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    })
}

const arrayImage = (image) => {
    if (Array.isArray(image)) {
        return image[0]
    } else {
        return image
    }
}







module.exports = {
    saveFile,
    removeFile,
    arrayImage,
    
}