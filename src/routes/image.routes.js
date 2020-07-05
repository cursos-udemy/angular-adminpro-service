const express = require('express');
const fileUpload = require('express-fileupload');

const handleError = require('../utils/error-util');
const fileUtil = require('../utils/file-util');
const hospitalRepository = require('../repositories/hospital.repository');
const userRepository = require('../repositories/user.repository');
const doctorRepository = require('../repositories/doctor.repository');

const MODEL_USER = 'user';
const MODEL_HOSPITAL = 'hospital';
const MODEL_DOCTOR = 'doctor';
const MODEL_TYPES = [MODEL_HOSPITAL, MODEL_USER, MODEL_DOCTOR];

const router = express.Router();
router.use(fileUpload());

router.post('/upload/:modelType/:id', async (req, res) => {
    let { modelType, id } = req.params;
    if (!MODEL_TYPES.includes(modelType.toLowerCase())) {
        return res.status(400).json({ error: 'invalid model type' });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files were uploaded' });
    }
    modelType = modelType.toLowerCase();
    const model = await findModel(modelType, id);
    if (!model) {
        return res.status(400).json({ error: 'invalid model id' });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const { image } = req.files;
    if (!fileUtil.isImage(image.name)) {
        return res.status(400).json({ error: 'must upload an image with extension [gif|jpe?g|tiff|png|webp|bmp]' });
    }

    fileUtil.deleteImage(modelType, model);
    fileUtil.saveImage(modelType, id, image)
        .then(filename => updateModel(modelType, id, filename))
        .then(modelUpdated => {
            res.json({ message: 'image uploads successfully' })
        })
        .catch(err => handleError(res, err, 'error upload image', 500))
});

router.get('/:modelType/:filename', (req, res) => {
    let { modelType, filename } = req.params;
    if (!MODEL_TYPES.includes(modelType.toLowerCase())) {
        return res.status(400).json({ error: 'invalid model type' });
    }
    modelType = modelType.toLowerCase();
    const imagePath = fileUtil.getImagePath(modelType, filename);
    if (imagePath) {
        res.sendFile(imagePath);
    } else {
        res.status(400).json({ error: 'image not found' });
    }
});



function updateModel(model, id, filename) {
    const modelUpdate = { image: filename }
    if (model === MODEL_USER) return userRepository.update(id, modelUpdate);
    if (model === MODEL_DOCTOR) return doctorRepository.update(id, modelUpdate);
    if (model === MODEL_HOSPITAL) return hospitalRepository.update(id, modelUpdate);
}

function findModel(model, id) {
    if (model === MODEL_USER) return userRepository.findById(id);
    if (model === MODEL_DOCTOR) return doctorRepository.findById(id);
    if (model === MODEL_HOSPITAL) return hospitalRepository.findById(id);
}

module.exports = router;