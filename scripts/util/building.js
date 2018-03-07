const fs = require("fs");
const { promisify } = require("util");
const marked = require("marked");
const util = require("./util");
const Vue = require("vue");
const renderer = require("vue-server-renderer").createRenderer();

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rename = promisify(fs.rename);
const stat = promisify(fs.stat);

module.exports = {
  buildArticle,
  getDirectoryOfPost,
  publishDraft
};

async function buildArticle(post, config) {
  const metaArticle = post.meta;
  const postDirectory = await getDirectoryOfPost(post.name, config);
  const html = await getContentOfPost(postDirectory, post.name);
  const lastEditedOn = metaArticle.lastEditedOn || metaArticle.createdAt;
  const { day, month, year } = util.getDateFromPost(metaArticle, lastEditedOn);
  const meta = { ...metaArticle, lastEditedOn };

  console.log(`Building post ${post.name}`, meta);
  await writePost({ post: { ...meta, name: post.name, content: html }, day, month, year, config });
}

async function getDirectoryOfPost(name, config) {
  const postsDir = `${config.postsDirectory}/${name}`;
  const draftsDir = `${config.draftsDirectory}/${name}`;
  return stat(postsDir)
    .then(() => postsDir)
    .catch(e => (e.code === "ENOENT" ? stat(draftsDir).then(() => draftsDir) : Promise.reject(e)));
}

async function publishDraft(name, config) {
  const directory = await getDirectoryOfPost(name, config);
  const metaFile = `${directory}/${name}.json`;
  const metaFileString = (await readFile(metaFile).catch(e => "{}")).toString();
  console.log(metaFileString);
  const metaArticle = JSON.parse(metaFileString);
  const html = await getContentOfPost(directory, name);
  const { day, month, year, createdAt, lastEditedOn } = util.getDateFromPost(metaArticle, new Date().toISOString());
  const meta = { createdAt, ...metaArticle, lastEditedOn };

  console.log(`Updating draft ${name} meta-data.`);
  await writeFile(metaFile, `${JSON.stringify(meta, null, 2)}\n`);
  await writePost({ post: { meta, name, content: html }, day, month, year, config });
  await moveDraftToPost(name, config);
}

async function moveDraftToPost(name, config) {
  try {
    await rename(`${config.draftsDirectory}/${name}`, `${config.postsDirectory}/${name}`);
  } catch (e) {
    if (e.code !== "ENOENT") {
      console.error("Error moving draft to published posts", e);
      throw e;
    }
  }
}

async function getContentOfPost(directory, name) {
  const content = (await readFile(`${directory}/${name}.md`)).toString();
  return marked(content);
}

async function writePost({ post, day, month, year, config }) {
  const nf = n => (n < 10 ? "0" : "") + n;
  const resultPath = `${year}/${nf(month)}/${nf(day)}/${post.name}`;

  const template = (await readFile(`${config.templateDirectory}/article.vue`)).toString();
  const app = new Vue({
    data: {
      article: post
    },
    methods: util,
    template
  });
  const html = await renderer.renderToString(app);

  console.log(`Publishing post ${post.name} into ${resultPath}`);
  await mkdirp(config.blogDirectory, resultPath);
  await promisify(fs.writeFile)(`${config.blogDirectory}/${resultPath}/index.html`, html);
}

async function mkdirp(workingDir, path) {
  await path.split("/").reduce(async (acc, p) => {
    const ps = await acc;
    return await mkdir(`${ps}/${p}`);
  }, Promise.resolve(workingDir));
}

async function mkdir(path) {
  return promisify(fs.mkdir)(path)
    .then(() => path)
    .catch(err => (err.code === "EEXIST" ? Promise.resolve(path) : Promise.reject(err)));
}
