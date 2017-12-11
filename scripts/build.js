const fs = require("fs");
const { promisify } = require("util");
const { buildArticle } = require("./util/building");
const config = require("../config");

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

run().catch(e => console.error(e));

async function run() {
  await buildArticles();
  await copyAssets();
}

async function copyAssets() {
  const assetsDir = `${config.templateDirectory}/assets`;
  const files = await readdir(assetsDir);
  files.reduce(async (acc, file) => {
    await acc;
    await copyFile(`${assetsDir}/${file}`, `${config.blogDirectory}/${file}`)
  }, Promise.resolve());
}

function copyFile(from, to) {
  const fromStream = fs.createReadStream(from);
  const toStream = fs.createWriteStream(to);
  return new Promise(resolve => {
    console.log("from", from);
    console.log("to", to);
    fromStream.pipe(toStream).on("end", resolve);
  });
}

async function buildArticles() {
  const drafts = await readdir(config.draftsDirectory);
  const publishedPosts = await drafts.reduce(filterPublishedDraft, Promise.resolve([]));
  await publishedPosts.reduce(async (p, post) => {
    await p;
    return buildArticle(post, config);
  }, Promise.resolve());
}

async function filterPublishedDraft(publishedDrafts, draft) {
  const drafts = await publishedDrafts;
  try {
    const meta = await readFile(`${config.draftsDirectory}/${draft}/${draft}.json`).then(JSON.parse);
    return !!meta.createdAt ? [...drafts, { meta, name: draft }] : drafts;
  } catch (e) {
    if (e.code !== "ENOENT") {
      console.error(e);
    }
    return drafts;
  }
}
