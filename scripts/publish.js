const fs = require("fs");
const { promisify } = require("util");
const { publishDraft } = require("./util/publish-draft");
const config = require("../config");

const readdir = promisify(fs.readdir);
const draft = process.argv[2];

run(draft).catch(e => console.error(e));

async function run(draft) {
  const drafts = await readdir(`${config.draftsDirectory}/${draft}`);
  if (drafts.filter(d => d === `${draft}.md`).length !== 1) {
    console.log(`No draft with name '${draft}' found`);
    return;
  }

  return await publishDraft(draft, config);
}
