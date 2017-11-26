const config = require("../config");

const fs = require("fs");
const { promisify } = require("util");
const marked = require("marked");

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const draft = process.argv[2];

run(draft).catch(e => console.error(e));

async function run(draft) {
  const drafts = await readdir(`${config.draftsDirectory}/${draft}`);
  if (drafts.filter(d => d === `${draft}.md`).length !== 1) {
    console.log(`No draft with name '${draft}' found`);
    return;
  }

  return await publishDraft(draft);
}

async function publishDraft(draft) {
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

  let template = (await readFile(`${__dirname}/../template/article.html`)).toString();
  const replace = `\\$\\{(.*?)\\}`;
  template = template.replace(new RegExp(replace, "g"), (matched, key) => (meta[key] ? meta[key] : "not-found"));

  await resultPath.split("/").reduce(async (acc, p) => {
    const ps = await acc;
    console.log("ps?", ps);
    return await mkdir(`${ps}/${p}`);
  }, Promise.resolve(config.blogDirectory));
  await promisify(fs.writeFile)(`${config.blogDirectory}/${resultPath}/index.html`, template);
}

async function mkdir(path) {
  return promisify(fs.mkdir)(path)
    .then(() => path)
    .catch(err => (err.code === "EEXIST" ? Promise.resolve(path) : Promise.reject(err)));
}
