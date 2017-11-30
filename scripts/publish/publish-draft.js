const fs = require("fs");
const { promisify } = require("util");

const marked = require("marked");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports = {
  publishDraft
};

async function publishDraft(draft, config) {
  const content = (await readFile(`${config.draftsDirectory}/${draft}/${draft}.md`)).toString();
  const metaFile = `${config.draftsDirectory}/${draft}/${draft}.json`;
  const metaFileString = (await readFile(metaFile).catch(e => ({}))).toString();
  const metaArticle = JSON.parse(metaFileString);
  const html = marked(content);
  const { day, month, year, createdAt, lastEditedOn } = getDateFromDraft(metaArticle);
  const resultPath = `${year}/${month}/${day}/${draft}`;
  const meta = { createdAt, ...metaArticle, lastEditedOn };
  const article = { ...meta, content: html };

  let template = (await readFile(`${config.templateDirectory}/article.html`)).toString();
  const replace = `\\$\\{((?:\{.*?}|[^}])+?)\\}`;
  template = template.replace(new RegExp(replace, "g"), (matched, key) => (article[key] ? article[key] : eval(key)));

  console.log(`Updating draft ${draft} meta-data.`);
  await writeFile(metaFile, `${JSON.stringify(meta, null, 2)}\n`);
  console.log(`Publishing draft ${draft} into ${resultPath}`);
  await mkdirp(config.blogDirectory, resultPath);
  await promisify(fs.writeFile)(`${config.blogDirectory}/${resultPath}/index.html`, template);
}

function getDateFromDraft(metaArticle) {
  const lastEditedOn = new Date();
  const createdAt = metaArticle.createdAt ? new Date(metaArticle.createdAt) : lastEditedOn;
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
