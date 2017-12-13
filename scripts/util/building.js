const fs = require("fs");
const { promisify } = require("util");
const marked = require("marked");
const util = require("./util");

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
  const { day, month, year } = util.getDateFromPost(metaArticle, lastEditedOn);
  const meta = { ...metaArticle, lastEditedOn };

  console.log(`Building post ${post.name}`, meta);
  await writePost({ post: { ...meta, name: post.name, content: html }, day, month, year, config });
}

async function publishDraft(name, config) {
  const metaFile = `${config.draftsDirectory}/${name}/${name}.json`;
  const metaFileString = (await readFile(metaFile).catch(e => ({}))).toString();
  const metaArticle = JSON.parse(metaFileString);
  const html = await getContentOfPost(name, config);
  const { day, month, year, createdAt, lastEditedOn } = util.getDateFromPost(metaArticle, new Date().toISOString());
  const meta = { createdAt, ...metaArticle, lastEditedOn };

  console.log(`Updating draft ${name} meta-data.`);
  await writeFile(metaFile, `${JSON.stringify(meta, null, 2)}\n`);
  await writePost({ post: { meta, name, content: html }, day, month, year, config });
}

async function getContentOfPost(name, config) {
  const content = (await readFile(`${config.draftsDirectory}/${name}/${name}.md`)).toString();
  return marked(content);
}

function makeArticle(article, util, template) {
  return eval("`" + template + "`");
}

async function writePost({ post, day, month, year, config }) {
  const nf = n => (n < 10 ? "0" : "") + n;
  const resultPath = `${year}/${nf(month)}/${nf(day)}/${post.name}`;

  let template = (await readFile(`${config.templateDirectory}/article.html`)).toString();
  const article = { ...post.meta, ...post };
  template = makeArticle(article, util, template);

  console.log(`Publishing post ${post.name} into ${resultPath}`);
  await mkdirp(config.blogDirectory, resultPath);
  await promisify(fs.writeFile)(`${config.blogDirectory}/${resultPath}/index.html`, template);
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
