import { AppBar, Avatar, Box, Breadcrumbs, Button, ButtonBase, CircularProgress, Container, Divider, Grid, IconButton, List, ListItemButton, TextField, Toolbar, Tooltip, Typography } from "@mui/material"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link, useNavigate, useParams } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import { useEffect, useState, useLayoutEffect, useCallback, useContext } from "react";
import { Octokit } from "@octokit/core";
import { StoreContext } from "../store";
import { SetSearchValueAction } from "../store/action";

function Commit() {
    const [repoCommits, setRepoCommits] = useState([])
    const { dispatch, state: { searchValue } } = useContext(StoreContext);
    const { user: userRepo, repo: repoName } = useParams()
    const [fetchMessage, setFetchMessage] = useState('')
    const navigate = useNavigate()

    useLayoutEffect(() => {
        const controller = new AbortController()
        getRepoCommits(controller.signal)
        return () => controller && controller.abort()
    }, [repoName, userRepo])


    const getRepoCommits = useCallback(
        async (signal) => {
            try {
                const octokit = new Octokit({
                    auth: import.meta.env.VITE_GITHUB_TOKEN,
                    request: { signal }
                });
                const result = await octokit.request('GET /repos/{username}/{repo}/commits', {
                    username: userRepo,
                    repo: repoName,
                    per_page: 10,
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                })
                setRepoCommits(result.data)
            } catch (error) {
                if (error.code !== 20) {
                    let message = error.message || ''
                    if (error?.code === 500) message = 'Internet is not available'
                    // console.error('err', error);
                    setFetchMessage(message)
                }

            }
        },
        [repoName, userRepo],
    )


    const breadcrumbs = [
        <IconButton color="text.primary"
            onClick={() => { dispatch(SetSearchValueAction('')); navigate('/') }}
            key={0}
        ><HomeIcon /></IconButton>,
        searchValue && <Link underline="hover" to="/" key={1} color="primary" >
            <Typography color="text.primary">Search</Typography>
        </Link>,
        <Link to={'/' + userRepo + '/repositories'} key={2}>
            <Typography color="text.primary">{userRepo}'s repos</Typography>
        </Link>,
        <Link to={'/' + userRepo + '/repositories'} color="#fff" key={3}>
            <Typography color="text.primary">{repoName}</Typography>
        </Link>,
        <Typography color="text.primary" key={4}>Commit</Typography>
    ];
    return (
        <Container
            sx={{
                minHeight: '100vh',
                paddingTop: '10px'
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'left',
                padding: '6px'
            }}>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    {breadcrumbs}
                </Breadcrumbs>
            </Box>
            {fetchMessage &&
                <Typography variant="h6" align="center">
                    {fetchMessage}
                </Typography>}
            {repoCommits.length === 0 && !fetchMessage &&
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>}

            <Box>
                <List component="nav" aria-label="repos result">
                    {
                        repoCommits.map((repoCommit) => {
                            const { sha, author, html_url, commit: { message } } = repoCommit
                            return <div key={sha}>
                                <Tooltip title="show details in new tab" >

                                    <Link
                                        to={html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <ListItemButton >
                                            <Grid container>
                                                <Grid item xs>
                                                    <Typography>{message}</Typography>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar alt="user avatar" src={author?.avatar_url} sx={{ width: 24, height: 24, marginRight: '4px' }} />
                                                        <Typography fontSize='14px' color={"gray"}>{author?.login}</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid>
                                                    <Typography fontSize='14px' color={"gray"}>{sha}</Typography>
                                                </Grid>
                                            </Grid>
                                        </ListItemButton>
                                    </Link>
                                </Tooltip>
                                <Divider />
                            </div>
                        })
                    }
                </List>
            </Box>
        </Container>
    )
}

export default Commit