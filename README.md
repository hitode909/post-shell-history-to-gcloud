# post-shell-history

- Post shell history and $pwd to Cloud DataStore
- Fetch history of $pwd and filter with peco

## Setup(WIP)

### API Key

Create your API key and write to env.yaml. The API Key will used in Cloud Function to authenticate requests from your shell.

```
ruby -rsecurerandom -e 'puts "APIKEY: #{SecureRandom.hex}"' > env.yaml
```

Then, Set your API to your .zshrc.

```
# env.yaml
APIKEY: 22f4470cab2f9133ed8340354287d979
# In your .zshrc
POST_SHELL_HISTORY_APIKEY=22f4470cab2f9133ed8340354287d979
```

### Deploy

`make deploy` will

- Create a GCP project named shell-history-`whoami`.
- Create a Clound Function
- Create indices for DataStore

```
make project
```

`make deploy` will print `httpsTrigger`.  Then, set the url root to `POST_SHELL_HISTTORY_APIROOT` in your .zshrc. Note that `APIROOT` doesn't have last `/`.

```
# Output
httpsTrigger:
  url: https://asia-northeast1-shell-history-hitorde909.cloudfunctions.net/accept

# In your .zshrc
POST_SHELL_HISTORY_APIROOT=https://asia-northeast1-shell-history-hitode909.cloudfunctions.net
  ```

### In your .zshrc

Set environment variables and load hooks.

```
export POST_SHELL_HISTORY_APIROOT=https://***.cloudfunctions.net
export POST_SHELL_HISTORY_APIKEY=***
source ~/dev/github.com/hitode909/post-shell-history-to-gcloud/hooks.sh
```

And set the keybinds to execute complement.

```
# Fetch history from current directory
zle -N peco-history-selection-from-remote
bindkey '^R' peco-history-selection-from-remote

# Fetch history from all directories
zle -N peco-history-selection-from-remote-all
bindkey '^T' peco-history-selection-from-remote-all
```
