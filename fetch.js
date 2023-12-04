const { iwa } = require('instagram-without-api-node');

const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const { IG_COOKIE, IG_AGENT, IG_APPID, TARGET_USER } = process.env;

// Getting Cookie Info https://github.com/orsifrancesco/instagram-without-api-node#-how-to-get-instagram-cookie

const _cookie = IG_COOKIE;
const _userAgent = IG_AGENT;
const _xIgAppId = IG_APPID;

async function fetch() {

  const responseIwa = await iwa({

    base64images: false,
    base64imagesCarousel: false,
    base64videos: false,

    headers: {
      'cookie': _cookie,
      'user-agent': _userAgent,
      'x-ig-app-id': _xIgAppId
    },

    maxImages: 12,
    file: "./results/sourcePosts.json",
    pretty: true,
    time: 3600,
    id: TARGET_USER

  })

  console.log({ responseIwa });

}

fetch();