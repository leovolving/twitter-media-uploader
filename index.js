const fs = require('fs');
const request = require('request-promise-native');
const { fullyEncodeURI, oauth } = require('./utils');

class TwitterMediaUploader {
    constructor() {
        this.mediaIds = []
        this.mediaPaths = []
        this.mediaSizes = []
        this.mediaFiles = []
        this.mediaCategories = ['TweetImage', 'TweetVideo', 'TweetGif', 'DmImage', 'DmVideo', 'DmGif', 'Subtitles'];
        this.baseOptions = {
            method: 'POST',
            json: true,
            oauth,
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        this.init = this.init.bind(this);
        this.getFile = this.getFile.bind(this);
        this.processFile = this.processFile.bind(this);
        this.append = this.append.bind(this);
        this.finalize = this.finalize.bind(this);
        this.tweet = this.tweet.bind(this);
    }

    async init(data) {
        const r = data.map(async ({path, type}, i) => {
            console.log('start init')
            this.mediaPaths[i]= path;
            this.mediaFiles[i]= await this.getFile(i);
            this.mediaSizes[i]= this.mediaFiles[i].length;
            console.log('size', this.mediaSizes[i]);
            const url = `https://upload.twitter.com/1.1/media/upload.json`;

            return request({
                ...this.baseOptions,
                url,
                form: {
                    command: 'INIT',
                    'media_type': type, // 'video/mp4, image/jpeg, image/gif
                    'media_category': TwitterMediaUploader.getMediaCategory(type), // 'tweet_video', tweet_image
                    'total_bytes': this.mediaSizes[i]
                }
            })
            .then((res) => {
                const mediaId = res.media_id_string;
                console.log('done init', mediaId)
                this.mediaIds[i] = mediaId;
                fs.appendFileSync(__dirname + '/media-ids.txt', mediaId + ' => ' + new Date().toISOString() + '\n');
            })
            .catch(e => console.error('TwitterMediaUploader: error with init', e.message));
        });
        return Promise.all(r);
    }

    async append(chunk, mediaId, i=0) {
        console.log('start append')
        const url = `https://upload.twitter.com/1.1/media/upload.json`;
        console.log('chunk size', chunk.length)

        return request({
            ...this.baseOptions,
            url,
            form: {
                command: 'APPEND',
                'media_data': chunk.toString('base64'),
                'media_id': mediaId,
                'segment_index': i,
            }
        })
        .then(() => console.log('done append'))
        .catch(e => console.error('TwitterMediaUploader: error with append segment ' + i, e.message));
    }

    async finalize(mediaId) {
        console.log('start finalize')
        const url = `https://upload.twitter.com/1.1/media/upload.json`;

        return request({
            ...this.baseOptions,
            url,
            form: {
                command: 'FINALIZE',
                'media_id': mediaId
            }
        })
        .then(() => console.log('done finalize'))
        .catch(e => console.error('TwitterMediaUploader: error with finalizing', e.message));
    }

    async tweet(status) {
        const url = 'https://api.twitter.com/1.1/statuses/update.json?status='
        + fullyEncodeURI(status)
        + '&media_ids=' + this.mediaIds.join(',');

        return request({
            url,
            method: 'POST',
            json: true,
            oauth
        }).catch(e => console.error('TwitterMediaUploader: error with tweet', e.message));
    }

    static getMediaCategory(type) {
        switch(type) {
            case 'video/mp4':
                return 'tweet_video';
            case 'image/gif':
                return 'tweet_gif';
            default:
                return 'tweet_image';
        }
    }

    async getFile(i) {
        if (!this.mediaPaths[i].startsWith('http')) return fs.readFileSync(this.mediaPaths[i]);

        return request({
            url: this.mediaPaths[i],
            encoding: null
        }).catch(e => console.log('error getting external media file from ' + this.mediaPath, e.message))
    }

    // https://gist.github.com/shiawuen/1534477
    async processFile() {
        const r = this.mediaIds.map(async(mediaId, i) => {
            const size = this.mediaSizes[i];
            const sliceSize = 500000;
            let count = 0;

            for (let start = 0; start < size; start += sliceSize) {
                let end = start + sliceSize;

                if (size - end < 0) {
                    end = size;
                }
                console.log('end', end)

                const s = this.sliceFile(this.mediaFiles[i], start, end);

                await this.append(s, mediaId, count);
                count++;
                console.log('end < size and typeof', end < size, typeof end, typeof size)

            }

            return await this.finalize(mediaId);
        });
        return Promise.all(r);
    }

    sliceFile(file, start, end) {
        const noop = () => this;
        const slice = file.mozSlice ? mozSlice :
                    file.webkitSlice ? file.webkitSlice :
                    file.slice ? file.slice : noop;
        
        return slice.bind(file)(start, end);
    }
}

module.exports = {TwitterMediaUploader};