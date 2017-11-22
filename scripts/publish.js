const config = require("../config");

const fs = require("fs");
const {promisify} = require("util");
const marked = require("marked");

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const draft = process.argv[2];

const generalMeta = {};

run(draft)
  .catch(e => console.error(e));

async function run(draft) {
  const drafts = await readdir(`${config.draftsDirectory}/${draft}`);
  if (drafts.filter(d => d === `${draft}.md`).length === 1) {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;
    const day = now.getUTCDate();
    console.log(`Publishing draft ${draft} into ${year}/${month}/${day}/${draft}`);

    const content = (await readFile(`${config.draftsDirectory}/${draft}/${draft}.md`)).toString();
    const metaArticle = await readFile(`${config.draftsDirectory}/${draft}/${draft}.json`).catch(e => ({}));
    const html = marked(content);
    const meta = {...generalMeta, ...metaArticle, content: html};

    let template = (await readFile(`${__dirname}/../template/article.html`)).toString();
    Object.keys(meta).forEach(key => {
      const replace = `\\$\\{${key}\\}`;
      console.log("replace", replace);
      template = template.replace(new RegExp(replace, "g"), meta[key]);
    });

    console.log("marked", template);
  } else {
    console.log(`No draft with name '${draft}' found`);
  }
}
