// fetching files from github

export const fetchDiff = (repo, commit1, commit2) => {
    return fetch(`https://api.github.com/repos/${repo}/compare/${commit1}...${commit2}`).then(res=>res.json())
}