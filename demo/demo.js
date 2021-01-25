const { TwitterMediaUploader } = require("..");

const files = [
  {
    path: "https://i.picsum.photos/id/991/300/300.jpg",
    type: "image/jpg"
  },
  {
    path: (__dirname + "/demo.1.jpg"),
    type: "image/jpg"
  },
  {
    path: (__dirname + "/demo.2.jpg"),
    type: "image/jpg"
  },
  {
    path: (__dirname + "/demo.3.jpg"),
    type: "image/jpg"
  },
]

const mediaUploader = new TwitterMediaUploader();
mediaUploader
  .init(files)
  .then(mediaUploader.processFile)
  .then(() => mediaUploader.tweet("demo media"))
  .catch(e => console.error("something broke", e));
