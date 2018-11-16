#!/bin/zsh
autoload -Uz add-zsh-hook

# in your .zshrc
# export POST_EHSLL_HISTTORY_APIROOT=https://***.cloudfunctions.net
# export POST_SHELL_HISTORY_APIKEY=***
# source ~/dev/github.com/hitode909/post-shell-history/hooks.sh

_preexec_post_command () {
  command="$1"
  curl --silent --data-urlencode "command=${command}" --data-urlencode "pwd=${PWD}" "$POST_SHELL_HISTORY_APIROOT/accept?apikey=${POST_SHELL_HISTORY_APIKEY}" >& /dev/null &
}
add-zsh-hook preexec _preexec_post_command

function peco-history-selection-from-remote() {
    BUFFER=`curl --silent "$POST_SHELL_HISTORY_APIROOT/accept?apikey=${POST_SHELL_HISTORY_APIKEY}&pwd=${PWD}" | jq --raw-output 'map(.command) | join("\n")' | peco`
    CURSOR=$#BUFFER
    zle reset-prompt
}

function peco-history-selection-from-remote-all() {
    BUFFER=`curl --silent "$POST_SHELL_HISTORY_APIROOT/accept?apikey=${POST_SHELL_HISTORY_APIKEY}" | jq --raw-output 'map(.command) | join("\n")' | peco`
    CURSOR=$#BUFFER
    zle reset-prompt
}
