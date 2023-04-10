import { Octokit } from "octokit";

class GithubService {
    #octokit

    constructor(signal = null) {
        this.#octokit = new Octokit({
            auth: import.meta.env.VITE_GITHUB_TOKEN,
            request: { signal }
        });
    }
    searchUsers({ q = '', page = 1, per_page = 10, }) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.#octokit.request('GET /search/users', {
                    q, page, per_page,
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    },
                })
                resolve(result)
            } catch (error) {
                if (error.code !== 20) { // not abort
                    let message = error.message || ''
                    if (error.code === 500) message = 'Internet is not available'
                    if (error.code === 422) message = 'No search value'
                    reject({ code: error.code, message })
                }
            }
        })
    }
    getUser(username) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.#octokit.request('GET /users/{username}', {
                    username,
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                })
                resolve(result)
            } catch (error) {
                if (error.code !== 20) { // not abort
                    let message = error.message || ''
                    if (error.code === 500) message = 'Internet is not available'
                    if (error.code === 404) message = 'User not found'
                    reject({ code: error.code, message })
                }
            }
        })
    }
    getUserRepos({ username = '', page = 1, per_page = 10, }) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.#octokit.request('GET /users/{username}/repos', {
                    username, page, per_page,
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                })
                resolve(result)
            } catch (error) {
                if (error.code !== 20) { // not abort
                    let message = error.message || ''
                    if (error.code === 500) message = 'Internet is not available'
                    reject({ code: error.code, message })
                }
            }
        })
    }
    getCommits({ username = '', repo = '', }) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.#octokit.request('GET /repos/{username}/{repo}/commits', {
                    username, repo, per_page: 10,
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                })
                resolve(result)
            } catch (error) {
                if (error.code !== 20) { // not abort
                    let message = error.message || ''
                    if (error.code === 500) message = 'Internet is not available'
                    reject({ code: error.code, message })
                }
            }
        })
    }
}

export default GithubService