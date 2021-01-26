const { TwitterMediaUploader } = require("..");
const { photos, video, gif } = require("./files");

const mediaUploader = new TwitterMediaUploader();
mediaUploader
  .init(photos)
  .then(mediaUploader.processFile)
  .then(() => mediaUploader.tweet("demo media"))
  .catch(e => console.error("something broke", e));
