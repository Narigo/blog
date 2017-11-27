const fs = require("fs");
const { promisify } = require("util");

const marked = require("marked");

const readFile = promisify(fs.readFile);

module.exports = {
  publishDraft
};

async function publishDraft(draft, config) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const resultPath = `${year}/${month}/${day}/${draft}`;
  console.log(`Publishing draft ${draft} into ${resultPath}`);
  const generalMeta = {
    lastEditedOn: `${day}.${month}.${year}`
  };

  const content = (await readFile(`${config.draftsDirectory}/${draft}/${draft}.md`)).toString();
  const metaArticle = JSON.parse(
    (await readFile(`${config.draftsDirectory}/${draft}/${draft}.json`).catch(e => ({}))).toString()
  );
  const html = marked(content);
  const meta = { ...generalMeta, ...metaArticle, content: html };

  let template = (await readFile(`${config.templateDirectory}/article.html`)).toString();
  const replace = `\\$\\{(.*?)\\}`;
  template = template.replace(new RegExp(replace, "g"), (matched, key) => (meta[key] ? meta[key] : "not-found"));

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
