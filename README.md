# post-shell-history

- Post shell history and $pwd to Cloud DataStore
- Fetch history of $pwd and filter with peco

## Setup

WIP

```
cp env.sample.yaml env.yaml
vim env.yaml
make index
make deploy
```

### In your .zshrc

Set environment variables and load hooks.

```
export POST_EHSLL_HISTTORY_APIROOT=https://***.cloudfunctions.net
export POST_SHELL_HISTORY_APIKEY=***
source ~/dev/github.com/hitode909/post-shell-history/hooks.sh
```

Set the key to execute complement.

```
zle -N peco-history-selection-from-remote
bindkey '^T' peco-history-selection-from-remote
```
