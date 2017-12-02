const fs = require("fs");
const { promisify } = require("util");
const config = require("../config");

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

run().catch(e => console.error(e));

async function run() {
  const drafts = await readdir(config.draftsDirectory);
  const publishedPosts = await drafts.reduce(filterPublishedDraft, Promise.resolve([]));
  console.log(publishedPosts);
}

async function filterPublishedDraft(publishedDrafts, draft) {
  const drafts = await publishedDrafts;
  try {
    const meta = await readFile(`${config.draftsDirectory}/${draft}/${draft}.json`).then(JSON.parse);
    return !!meta.createdAt ? [...drafts, draft] : drafts;
  } catch (e) {
    if (e.code !== "ENOENT") {
      console.error(e);
    }
    return drafts;
  }
}
