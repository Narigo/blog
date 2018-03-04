const fs = require("fs");
const { promisify } = require("util");
const { buildArticle } = require("./util/building");
const util = require("./util/util");
const config = require("../config");

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

run().catch(e => console.error(e));

async function run() {
  await copyAssets();
  const publishedPosts = await getPublishedPosts();
  await buildIndex(publishedPosts.map(post => ({ ...post.meta, ...post })));
  await buildArticles(publishedPosts);
}

async function buildIndex(posts) {
  const template = (await readFile(`${config.templateDirectory}/index.html`)).toString();
  const index = makeIndex(posts, util, template);
  return writeFile(`${config.blogDirectory}/index.html`, index);
}

function makeIndex(posts, util, template) {
  return eval("`" + template + "`");
}

async function copyAssets() {
  const assetsDir = `${config.templateDirectory}/assets`;
  const files = await readdir(assetsDir);
  files.reduce(async (acc, file) => {
    await acc;
    await copyFile(`${assetsDir}/${file}`, `${config.blogDirectory}/${file}`);
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

async function getPublishedPosts() {
  const posts = await readdir(config.postsDirectory);
  return posts.reduce(async (allPosts, post) => [...await allPosts, await metaFromPost(post)], Promise.resolve([]));

  async function metaFromPost(post) {
    const meta = await readFile(`${config.postsDirectory}/${post}/${post}.json`).then(JSON.parse);
    return { meta, name: post };
  }
}

async function buildArticles(publishedPosts) {
  await publishedPosts.reduce(async (p, post) => {
    await p;
    return buildArticle(post, config);
  }, Promise.resolve());
}
