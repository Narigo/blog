const fs = require("fs");
const { promisify } = require("util");

const marked = require("marked");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports = {
  publishDraft,
  buildArticle,
  getDateFromDraft
};

async function buildArticle(post, config) {
  const metaArticle = post.meta;
  const html = await getContentOfPost(post.name, config);
  const lastEditedOn = metaArticle.lastEditedOn || metaArticle.createdAt;
  const { day, month, year } = getDateFromDraft(metaArticle, lastEditedOn);
  const meta = { ...metaArticle, lastEditedOn };

  console.log(`Building post ${post.name}`, meta);
  await writePost({ post: { ...meta, name: post.name, content: html }, day, month, year, config });
}

async function publishDraft(name, config) {
  const metaFile = `${config.draftsDirectory}/${name}/${name}.json`;
  const metaFileString = (await readFile(metaFile).catch(e => ({}))).toString();
  const metaArticle = JSON.parse(metaFileString);
  const html = await getContentOfPost(name, config);
  const { day, month, year, createdAt, lastEditedOn } = getDateFromDraft(metaArticle, new Date().toISOString());
  const meta = { createdAt, ...metaArticle, lastEditedOn };

  console.log(`Updating draft ${name} meta-data.`);
  await writeFile(metaFile, `${JSON.stringify(meta, null, 2)}\n`);
  await writePost({ post: { meta, name, content: html }, day, month, year, config });
}

async function getContentOfPost(name, config) {
  const content = (await readFile(`${config.draftsDirectory}/${name}/${name}.md`)).toString();
  return marked(content);
}

function makeArticle(article, template) {
  return eval("`" + template + "`");
}

async function writePost({ post, day, month, year, config }) {
  const nf = n => (n < 10 ? "0" : "") + n;
  const resultPath = `${year}/${nf(month)}/${nf(day)}/${post.name}`;

  let template = (await readFile(`${config.templateDirectory}/article.html`)).toString();
  const article = { ...post.meta, ...post };
  template = makeArticle(article, template);

  console.log(`Publishing post ${post.name} into ${resultPath}`);
  await mkdirp(config.blogDirectory, resultPath);
  await promisify(fs.writeFile)(`${config.blogDirectory}/${resultPath}/index.html`, template);
}

function getDateFromDraft(metaArticle, lastEditedOn) {
  const createdAt = new Date(metaArticle.createdAt ? metaArticle.createdAt : lastEditedOn);
  const year = createdAt.getUTCFullYear();
  const month = createdAt.getUTCMonth() + 1;
  const day = createdAt.getUTCDate();

  return { day, month, year, createdAt, lastEditedOn };
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
