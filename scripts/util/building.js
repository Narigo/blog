const fs = require("fs-extra");
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
  createDraft,
  getDirectoryOfPost,
  mkdirp,
  publishDraft
};

async function buildArticle(post, config) {
  const metaArticle = post.meta;
  const postDirectory = await getDirectoryOfPost(post.name, config);
  const html = await getContentOfPost(postDirectory, post.name);
  const lastEditedOn = metaArticle.lastEditedOn || metaArticle.createdAt;
  const { day, month, year } = util.getDateFromPost(metaArticle, lastEditedOn);
  const meta = { ...metaArticle, lastEditedOn };

  console.log(`Building post ${post.name}`);
  await writePost({
    post: { ...meta, name: post.name, content: html },
    day,
    month,
    year,
    config,
    directory: postDirectory
  });
}

async function createDraft(name, title, config) {
  // 1. create draft dir
  // 2. create meta file
  // 3. create markdown file
  const draftDir = `${config.draftsDirectory}/${name}`;
  await mkdirp(draftDir);

  const draftMetaFile = `${config.draftsDirectory}/${name}/${name}.json`;
  const draftMeta = await readFile(draftMetaFile)
    .then(c => JSON.parse(c.toString()))
    .catch(e => (e.code === "ENOENT" ? createMeta(title) : Promise.reject(e)));
  draftMeta.title = title || draftMeta.title;
  await writeFile(draftMetaFile, JSON.stringify(draftMeta, null, 2));

  const draftMarkdownFile = `${config.draftsDirectory}/${name}/${name}.md`;
  await stat(draftMarkdownFile).catch(
    e => (e.code === "ENOENT" ? writeFile(draftMarkdownFile, createMarkdown(title)) : Promise.reject(e))
  );
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
  const metaArticle = JSON.parse(metaFileString);
  const html = await getContentOfPost(directory, name);
  const { day, month, year, createdAt } = util.getDateFromPost(metaArticle, new Date().toISOString());
	const meta = { createdAt, ...metaArticle, lastEditedOn: createdAt.toISOString() };

  console.log(`Updating draft ${name} meta-data.`);
  await writeFile(metaFile, `${JSON.stringify(meta, null, 2)}\n`);
  await writePost({ post: { ...meta, name, content: html }, day, month, year, config, directory });
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

async function writePost({ post, day, month, year, config, directory }) {
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
  await copyAssets(directory, `${config.blogDirectory}/${resultPath}`, { name: post.name });
  await promisify(fs.writeFile)(`${config.blogDirectory}/${resultPath}/index.html`, html);
}

async function copyAssets(fromDir, toDir, { name }) {
  return fs.copy(fromDir, toDir, {
    filter: file => {
      const isPostOrMeta = file.endsWith(`${name}.json`) || file.endsWith(`${name}.md`);
      return !isPostOrMeta;
    }
  });
}

async function mkdirp(workingDir, path = "") {
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

function createMeta(title) {
  const createdAt = new Date();
  return {
    createdAt,
    title
  };
}

function createMarkdown(title) {
  return `# ${title}\n\n\n`;
}
