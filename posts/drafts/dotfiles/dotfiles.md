# dotfiles and automating repetitive work

Setting up servers, computers and other things made myself wonder about how I could automate or optimize my own 
workflows. There are a lot of great examples what aliases people set up for themselves. I've wondered if I could do the
same for myself and keep it modular for multiple operating systems as well. The project that I have been tinkering on is
simply called [dotfiles](https://github.com/Narigo/dotfiles) and is largely based on the input of great resources I have
found via [dotfiles.github.io](https://dotfiles.github.io).

In my case, I've been looking to get a backup for my regular dotfiles, which were not really complex when I started. 
While working on it, I've been digging into a lot of settings that help me automate and optimize commands and aliases. 
As I was concerned about overwriting all my configuration files, I've added a `backup` folder. Existing configuration
files get a backup there before overwriting them now. I don't want to make that mistake twice...

## How to write a module

For now, my modules have simple "commands" which can be used. They can either copy all files into a directory (usually 
`~/`) or concatenate all files into a single file residing somewhere. Through the former I can directly set 
configuration files like `.gitconfig` and through the latter I can split aliases, setting of paths and adding scripted 
logic into separate files. Maybe this will help me to reuse parts of it cross-platform later.

### Copy-Example

This mode of operaions copies all existing files into a simple directory, passed into the directory.

### Concatenation-Example

See the `shell` module as an example. It takes all files in the modules sub-directories and merges them into the single
file called `.bash_profile`. As the environment settings, alias declarations and scripts are split accross multiple 
files, It could be possible to reuse parts of it or just remove parts I hardly ever used.  

## Extra settings

There are two special extra settings. The first file is to an arbitrary shell script running any commands we like on a 
platform. This is useful to set various OS-dependant options and flags that make the system behave more like I want it 
to. For example in MacOS it will set options for Finder that I think are better than the defaults. The second "extra"
settings file is to set up user specific stuff. For me, it sets git user options etc.

## Conclusion

Creating a repository and thinking more about automating my own workflows really help to get repetitive  things done 
much faster. Working on it also leads to thinking more into a direction of DevOps: Scripting all of my configuration to
prevent myself from making mistakes setting up a new machine.
