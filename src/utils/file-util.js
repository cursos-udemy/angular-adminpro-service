const fs = require('fs');

function isImage(filename) {
    return (/\.(gif|jpe?g|tiff|png|webp|bmp)$/i).test(filename);
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
    const path = `./uploads/${modelType}/${model.image}`;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

//var serveIndex = require('serve-index');
//app.use(express.static(__dirname + '/'))
//app.use('/uploads', serveIndex(__dirname + '/uploads'));

module.exports = {
    isImage,
    getFileExtension,
    saveImage,
    deleteImage
}