# Twitter Media Upload

Works with photos, videos, and GIFs.

Save media ids and post media to Twitter via the [Upload Media API](https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/overview).

## Demo

1. Clone repo
2. Create your Twitter environment variables in an .env file (or add your twitter oauth credentials in [utils/index.js](./utils/index.js)).
4. From the root of the directory, run `npm run demo`. **Note: this *will* upload media to the Twitter account provided**

This will upload 4 images with the text "demo media." If you want to demo GIFs or videos, change the argument in the `init` function call in [./demo/index.js](./demo/index.js) to the desired media type.