# Price Levels

Price level utilities.

## Prerequisites

Open Settings > Privacy & Security > Full Disk Access, click the plus button at the bottom, go to Applications > Utilities and add Terminal.app.

## Installing Dependencies

### Homebrew

Go to [brew.sh](https://brew.sh) and copy and paste the install command into your terminal.

#### Install packages

NVM:

```bash
brew install nvm
```

The nvm command needs to be initialized in your shell. Type `echo $SHELL` to find which shell you're using. It is probably `zsh`. 

```bash
mkdir ~/.nvm
touch ~/.zshrc
open -e ~/.zshrc
```

(If `$SHELL` prints out bash, open `~/.bashrc` instead)

Copy and paste the lines immediately after "Add the following to your shell..." into the open .zshrc file and save it.

Run `exit` and then close the window once it says the process is done.

### GitHub Desktop

Install GitHub Desktop and authenticate with a GitHub (not GitHub Enterprise) account. 

Check out the [weilstreet/price-levels](https://github.com/weilstreet/price-levels) repository in a folder (examples given as ~/Desktop/tools/price-levels).

### Visual Studio Code

Install Visual Studio Code.

Optionally, Cmd+Shift+P and typing "shell command" will give the option to install the `code` command in your shell.

## Setup

### Terminal

Navigate to the price levels directory with `cd ~/Desktop/tools/price-levels`

Run `nvm use`. If it says the required version isn't installed, type `nvm install`.

Install node packages with `npm install`.

### Environment

Open the price levels project in Visual Studio Code. If you installed the shell tools, you can type `code .` to open the current directory in your terminal.

In the Explorer tab, copy the `.env.example` file and rename it to `.env`. Fill in all of the environment variables.

## Running the tool

Type `npm run price-levels` to run the tool and see the list of commands.

To import from a Google Sheet, the full command is `npm run price-levels update-versions "<sheet url>"` (with quotes around the URL).
