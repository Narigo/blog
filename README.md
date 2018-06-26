# blog

I just want to see what I will do, if I have a repository called "blog" and what I will do with it.

As soon as the first post is ready, I will put it up into `blog/<year>/<month>/<day>-<title-slug>.md`. Drafts will have 
a simpler structure, namely `drafts/<title-slug>.md`. Most probably I will write a script to "publish" a new blog post 
from the drafts. Should be added as a blog post though.

I should put ideas for new posts into the issues in this repository I guess.

## Commands

### Create new draft

```
npm run draft <name> <title>
```

This creates a new draft with the internal id of `<name>` and a title `<title>`.

### Publish a post

```
npm run publish <name>
```

This publishes a draft or updates an already published post with the name `<name>`.

You need to run `npm run build` to make sure that the page with index will be built as well.
