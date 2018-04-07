const fs = require("fs");
const { promisify } = require("util");
const config = require("../config");
const { createDraft } = require("./util/building");

const draftName = process.argv[2];
const draftTitle = process.argv[3];

main(draftName, draftTitle, config);

async function main(draftName, draftTitle, config) {
  await createDraft(draftName, draftTitle, config);
}
