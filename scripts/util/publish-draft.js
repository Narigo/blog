const fs = require("fs");
const { promisify } = require("util");

const marked = require("marked");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports = {
  publishDraft,
  buildArticle
};

async function buildArticle(post, config) {
  const metaArticle = post.meta;
  const html = await getContentOfPost(post.name, config);
  const lastEditedOn = metaArticle.lastEditedOn || metaArticle.createdAt;
  console.log("build with times", metaArticle);
  const { day, month, year} = getDateFromDraft(metaArticle, lastEditedOn);
  const meta = { ...metaArticle, lastEditedOn };

  console.log(`Building post ${post.name}`, meta);
  await writePost(post.name, meta, html, day, month, year, config);
}

async function publishDraft(draft, config) {
  const metaFile = `${config.draftsDirectory}/${draft}/${draft}.json`;
  const metaFileString = (await readFile(metaFile).catch(e => ({}))).toString();
  const metaArticle = JSON.parse(metaFileString);
  const html = await getContentOfPost(draft, config);
  const { day, month, year, createdAt, lastEditedOn } = getDateFromDraft(metaArticle, (new Date()).toISOString());
  const meta = { createdAt, ...metaArticle, lastEditedOn };

  console.log(`Updating draft ${draft} meta-data.`);
  await writeFile(metaFile, `${JSON.stringify(meta, null, 2)}\n`);
  await writePost(draft, meta, html, day, month, year, config);
}

async function getContentOfPost(name, config) {
  const content = (await readFile(`${config.draftsDirectory}/${name}/${name}.md`)).toString();
  return marked(content);
}

function makeArticle(article, template) {
  return eval("`" + template + "`");
}

async function writePost(draft, meta, content, day, month, year, config) {
  const resultPath = `${year}/${month}/${day}/${draft}`;

  let template = (await readFile(`${config.templateDirectory}/article.html`)).toString();
  const article = { ...meta, content };
  template = makeArticle(article, template);

  console.log(`Publishing draft ${draft} into ${resultPath}`);
  await mkdirp(config.blogDirectory, resultPath);
  await promisify(fs.writeFile)(`${config.blogDirectory}/${resultPath}/index.html`, template);
}

function getDateFromDraft(metaArticle, lastEditedOn) {
  const createdAt = new Date(metaArticle.createdAt ? metaArticle.createdAt : lastEditedOn);
  console.log("createdAt=", createdAt);
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
