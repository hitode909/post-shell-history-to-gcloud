# post-shell-history

- Post shell history and $pwd to Cloud DataStore
- Fetch history of $pwd and filter with peco

## Setup(WIP)

### API Key

Edit env.yaml from env.sample.yaml and set a API Key.

```
cp env.sample.yaml env.yaml
vim env.yaml
```

```
# env.yaml
APIKEY: yo
# In your .zshrc
POST_SHELL_HISTORY_APIKEY=yo
```

### Deploy

```
make deploy
make index
```

`make deploy` will print `httpsTrigger`.  Set the url root to `POST_SHELL_HISTTORY_APIROOT`.
```
# Output
httpsTrigger:
  url: https://asia-northeast1-shell-history2.cloudfunctions.net/accept

# In your .zshrc
POST_SHELL_HISTORY_APIROOT=https://asia-northeast1-shell-history2.cloudfunctions.net
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
