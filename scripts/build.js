const fs = require("fs");
const { promisify } = require("util");
const { buildArticle, mkdirp } = require("./util/building");
const util = require("./util/util");
const config = require("../config");
const Vue = require("vue");
const renderer = require("vue-server-renderer").createRenderer();

const statFile = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const INITIAL_ASSETS_DIR = `${config.templateDirectory}/assets`;

run().catch(e => console.error(e));

async function run() {
  await mkdirp(config.blogDirectory);
  await copyAssets();
  const publishedPosts = await getPublishedPosts();
  await buildIndex(publishedPosts.map(post => ({ ...post.meta, ...post })));
  await buildArticles(publishedPosts);
}

async function buildIndex(posts) {
  const template = (await readFile(`${config.templateDirectory}/index.vue`)).toString();
  const app = new Vue({
    data: {
      posts
    },
    methods: util,
    template
  });
  const html = await renderer.renderToString(app);
  return writeFile(`${config.blogDirectory}/index.html`, html);
}

async function copyAssets(directory = INITIAL_ASSETS_DIR) {
  const files = await readdir(directory);
  await files.reduce(async (acc, file) => {
    await acc;
    const filePath = `${directory}/${file}`;
    const stats = await statFile(filePath);
    const toPath = `${config.blogDirectory}/${filePath.slice(INITIAL_ASSETS_DIR.length)}`;
    if (stats.isDirectory()) {
      await mkdirp(toPath);
      await copyAssets(filePath);
    } else {
      await copyFile(filePath, toPath);
    }
  }, Promise.resolve());
}

function copyFile(from, to) {
  const fromStream = fs.createReadStream(from);
  const toStream = fs.createWriteStream(to);
  return new Promise((resolve, reject) => {
    const piped = fromStream.pipe(toStream);
    piped.on("error", reject);
    piped.on("close", resolve);
  });
}

async function getPublishedPosts() {
  const posts = await readdir(config.postsDirectory);
  return posts.reduce(async (allPosts, post) => [...(await allPosts), await metaFromPost(post)], Promise.resolve([]));

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
