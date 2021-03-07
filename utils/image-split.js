const sharp = require("sharp");

sharp("mage/originalFile1.jpg")
  .resize(5400, 3600)
  .jpeg({ quality: 100 })
  .toFile("originalFile1.jpg")
  .metadata()
  .then(function (info) {
    for (let i = 1; i < 500; i++) {
      if (info.height % i === 0 && info.width % i === 0) {
        console.log("dsa", i);
      }
    }
    console.log(info.height, info.width);
  });

isDone = false;
const sourceImage = sharp("public/mage/originalFile1.jpg");
leftOffset = 0;
topOffset = 0;
counter = 1;

async function cropAndSave() {
  try {
    await sourceImage
      .extract({ width: 225, height: 225, left: leftOffset, top: topOffset })
      .jpeg({ quality: 80 })
      .toFile(`public/mage/subimages/part-${counter}.jpg`);
    console.log(leftOffset, topOffset);
    counter++;
    leftOffset += 225;
    if (leftOffset === 5400) {
      topOffset += 225;
      leftOffset = 0;
    }
    if (leftOffset !== 5400 && topOffset != 3600) {
      cropAndSave();
    }
  } catch (e) {
    console.log(e);
  }
}

cropAndSave();
console.log("done", 5400 % 300, 3600 % 300);
