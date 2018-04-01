# dotfiles and automating repetitive work

Setting up servers, computers and other things made myself wonder about how I could automate or optimize my own 
workflows. There are a lot of great examples what aliases people set up for themselves. I've wondered if I could do the
same for myself and keep it modular for multiple operating systems as well. The project that I have been tinkering with
is simply called [dotfiles](https://github.com/Narigo/dotfiles) and is largely based on the input of great resources I 
have found via [dotfiles.github.io](https://dotfiles.github.io).

In my case, I've been looking to get a backup for my regular dotfiles, which were not really complex when I started. 
While working on it, I've been digging into a lot of settings that help me automate and optimize commands and aliases. 
As I was concerned about overwriting all my configuration files, I've added a `backup` folder. Existing configuration
files get a backup there before overwriting them now. I don't want to make that mistake twice...

There is also a dry-run option. Doing `. install.sh -d`  will generate all files in the `.dry-run/` directory, so you 
can see what the resulting files will look like.

## How to write a module

For now, my modules have simple "commands" which can be used. They can either copy all files into a directory (usually 
`~/`) or concatenate all files into a single file residing somewhere. Through the former I can directly set 
configuration files like `.gitconfig` and through the latter I can split aliases, setting of paths and adding scripted 
logic into separate files. Maybe this will help me to reuse parts of it cross-platform later.

Right now, I've set up `.settings-macos` files in the two first modules, namely `git` and `shell`. In the 
`.settings-macos` I can either put a line like `platform_file=<file_to_concatenate_into>` or a line 
`copy_files_to=<directory_to_copy_into>`. If the script finds a `platform_file`, it tries to concatenate all files in a
single file. If it finds a `copy_files_to`, it will simply copy all files into that directory.

For example, to recreate git settings, you need to put a `.gitconfig` file into your `$HOME` directory. Hence the 
`.settings-macos` file contains `copy_files_to=$HOME`. The script will evaluate the `.settings-*` files, so keep that in
mind when doing anything inside of them.

The shell module on the other hand, needs to concatenate multiple files into the `.bash_profile`. Usually, the 
`.settings-macos` should contain `platform_file=$HOME/.bash_profile`.

## Extra settings

There are two special extra settings. The first file is to an arbitrary shell script running any commands we like on a 
platform. This is useful to set various OS-dependant options and flags that make the system behave more like I want it 
to. For example in MacOS it will set options for Finder that I think are better than the defaults. The second "extra"
settings file is to set up user specific stuff. For me, it sets git user options etc.

## Conclusion

Creating a repository and thinking more about automating my own workflow really help to get repetitive things done much 
faster. Working on it also leads to thinking more into a direction of DevOps: Scripting all of my configuration to
prevent myself from making mistakes setting up a new machine.
