# Building a blog

This post will guide through how to use this blog "engine" and why I've built it. 

## Usage

I just want Markdown files being converted to blog posts, so the usage should be very simple for this use case.

### Creating a post

This should change. For now, I'll just create a new directory under `/posts/drafts`, call it whatever I want and put an
`.md` file with the same name under it. You can add meta data like title by adding a `.json` file into that directory.

### Publishing a post

The command `npm run publish <draft-name>` uses the `.json` and `.md` files inside the draft directory and creates a 
post from it. It will create a `.json` if none exists and add a `createdAt` field to it with the current date.

It will also move the whole directory of the post from `/posts/drafts/<draft-name>` into 
`/posts/published/<draft-name>`.

### Editing a published post

If I need to change a published post, I can edit it directly and another run of `npm run publish <draft-name>` takes 
care of updating the `lastEditedOn` field. It will try to find the draft in `/posts/published/<draft-name>` first and if
it doesn't find it there, it will resort to a regular publish.

### Rebuilding the blog

`npm run build` recreates all published posts with the template in `template/article.html`. This is useful to change the
design whenever I want to.

## Motivation

There are a lot of frameworks available to create your own blog. I thought it makes sense to give some reasons why I've
built yet another one.

1. Building stuff is fun! Why evaluate and decide between established frameworks that are probably not as flexible as I
wish them to be when building one myself seems possible?
2. GitHub is free for doing things open source and it's free to host something as simple as this. I do not expect this 
to get very popular, so I am able to learn and try out a few things while building it.
3. Automating workflows is something I want to get better with and this enables me to get more into an automation 
workflow.
4. I want to be able to link to my thoughts when I create something new. Doing so by creating blog postsseems like a 
good idea. 
5. Maybe this gets updated a bit more so I can make it reusable at some point.
