# Building a blog

There are so many frameworks and I just want to build stuff. It's a lot more fun than trying out all these frameworks.
And to create my own scripted blog stuff, I should add some more test articles. Well, this is obviously one because I 
have not really something to say other than what I'm building here right now.

I'll try to put my thoughts into something readable.

## Creating a post

This should change. For now, I'll just create a new directory under `/drafts`, call it whatever I want and put an `.md` 
file with the same name under it. You can add meta data like title by adding a `.json` file into that directory.

## Publishing a post

The command `npm run publish <draft-name>` uses the `.json` and `.md` files inside the draft directory and creates a 
post from it. It will create a `.json` if none exists and add a `createdAt` field to it with the current date.

## Editing a published post

If I need to change a published post, I can edit it directly and another run of `npm run publish <draft-name>` takes 
care of updating the `lastEditedOn` field. Hopefully.

## Rebuilding the blog

`npm run build` recreates all published posts with the template in `template/article.html`. This is useful to change the
design later.
