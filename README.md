# igfetch-ocr-translate-imagegenerate

- <https://www.npmjs.com/package/instagram-without-api-node>
- <https://github.com/optiic/optiic>
- <https://textgears.com/api>
- <https://cloud.google.com/translate/docs/setup>

## env sample

```text
IG_COOKIE='ig_did=...'
IG_AGENT='Mozilla/5.0...'
IG_APPID=936...59
TARGET_USER=igaccountname
OCR_KEY=optiic_key
TEXTGEARS_KEY=textgears_key
```

## Commands

- npm run fetch
Fetches the latest 12 posts from an instagram account and write the results to a JSON file

- npm run process
Reads the results JSON and uses an OCR API to get the copy from the images, then translates the copy into Spanish, Run grammar corrections and save results to the JSON file. Every proccessed post id gets added to a used.txt file to avoid duplicates.

- npm run generate
Reads the transcriptions JSON and generates an image with the tranlsation value for each item

- npm start
Runns all tasks
