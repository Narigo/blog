const fs = require("fs");
const { promisify } = require("util");
const { getDirectoryOfPost, mkdirp, publishDraft } = require("./util/building");
const config = require("../config");

const readdir = promisify(fs.readdir);
const draft = process.argv[2];

run(draft).catch(e => console.error("error running publish", e));

async function run(draft) {
  await mkdirp(config.blogDirectory);
  const directory = await getDirectoryOfPost(draft, config);
  const drafts = await readdir(`${directory}`);
  if (drafts.filter(d => d === `${draft}.md`).length !== 1) {
    console.log(`No draft with name '${draft}' found`);
    return;
  }

  return await publishDraft(draft, config);
}
