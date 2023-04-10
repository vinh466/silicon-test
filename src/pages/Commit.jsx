import { Avatar, Box, Breadcrumbs, CircularProgress, Container, Divider, Grid, IconButton, List, ListItemButton, Tooltip, Typography } from "@mui/material"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link, useNavigate, useParams } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import { useEffect, useState, useContext } from "react";
import { StoreContext } from "../store";
import { SetSearchValueAction } from "../store/action";
import GithubService from "../services/githubApi.service";

function Commit() {
    const [repoCommits, setRepoCommits] = useState([])
    const { dispatch, state: { searchValue } } = useContext(StoreContext);
    const { user: userRepo, repo: repoName } = useParams()
    const [fetchMessage, setFetchMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const controller = new AbortController()
        getRepoCommits(controller.signal)
        return () => controller && controller.abort()
    }, [repoName, userRepo])


    const getRepoCommits = async (signal) => {
        try {
            setFetchMessage('')
            const githubService = new GithubService(signal)
            const result = await githubService.getCommits({
                username: userRepo,
                repo: repoName,
            })
            setFetchMessage(!result.data?.length ? 'Empty' : '')
            setRepoCommits(result.data || [])
        } catch (error) {
            setFetchMessage(error.message || 'Error')
        }
    }


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