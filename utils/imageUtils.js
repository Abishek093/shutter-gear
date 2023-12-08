// utils/imageUtils.js
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

async function cropImage(inputImagePath, outputImagePath, width, height) {
    await sharp(inputImagePath)
        .resize({ width, height, fit: 'cover' })
        .toFile(outputImagePath);
}

async function cropAndSaveImages(fileNames, inputDir, outputDir, width, height) {
    await Promise.all(fileNames.map(async (filename) => {
        const inputImagePath = path.join(inputDir, filename);
        const outputImagePath = path.join(outputDir, filename);

        await cropImage(inputImagePath, outputImagePath, width, height);
    }));
}

module.exports = {
    cropImage,
    cropAndSaveImages,
};
