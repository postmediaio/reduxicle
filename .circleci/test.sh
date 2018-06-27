#! bash
reduxicle_core_version="23"

                        if [[ -n $reduxicle_core_version && $reduxicle_core_version != "null" ]]; then
                            cat package.json | jq '.dependencies["@reduxicle/core"] = "rc"'
                        fi
