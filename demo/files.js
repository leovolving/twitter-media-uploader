// maximum 4 photos per Tweet
const photos = [
  {
    path: "https://picsum.photos/200/300",
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

const video = [
    {
      path: (__dirname + "/demo.mp4"),
      type: "video/mp4"
    }
]

const gif = [
    {
      path: (__dirname + "/demo.gif"),
      type: "image/gif"
    }
]

module.exports = {
    gif,
    photos,
    video
};