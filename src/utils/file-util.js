const fs = require('fs');
const path = require('path');

function isImage(filename) {
    return (/\.(gif|jpe?g|tiff|png|webp|bmp|svg)$/i).test(filename);
}

function getFileExtension(filename) {
    return /[^.]+$/.exec(filename)[0];
}

//function getExtension(filename) {
//    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
//}

function saveImage(modelType, id, image) {
    return new Promise((resolve, reject) => {
        const extension = getFileExtension(image.name);
        const filename = `${id}_${new Date().getMilliseconds()}.${extension}`;

        // Use the mv() method to place the file somewhere on your server
        image.mv(`./uploads/${modelType}/${filename}`, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(filename);
            }
        });
    })
}

function deleteImage(modelType, model) {
    const imagePath = `./uploads/${modelType}/${model.image}`;
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}


function getImagePath(modelType,filename) {
    const imagePath = path.resolve(__dirname, `../../uploads/${modelType}/${filename}`);
    if (fs.existsSync(imagePath)){
        return imagePath;
    }
    //return path.resolve(__dirname, '../assets/no-image.jpg');
    return undefined;
}

module.exports = {
    isImage,
    getFileExtension,
    saveImage,
    deleteImage,
    getImagePath
}