import { Box, Breadcrumbs, CircularProgress, Container, Divider, Grid, IconButton, InputBase, List, ListItemButton, ListItemText, Pagination, Skeleton, TextField, Toolbar, Typography } from "@mui/material"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Octokit } from "@octokit/core";
import { SetRepoResultAction, SetRepoResultPageAction, SetSearchValueAction } from "../store/action";
import { StoreContext } from "../store";

const perPage = 10

function Repositories() {
    const { user: userRepo } = useParams()
    const { dispatch, state: { searchValue, repoResult, repoResultPage, repoResultMessage } } = useContext(StoreContext);
    const [paginationPage, setPaginationPage] = useState(0)
    const [isChangePage, setIsChangePage] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const controller = new AbortController()
        dispatch(SetRepoResultAction([]))
        getRepos(controller.signal)
        return () => controller.abort()
    }, [userRepo])

    useEffect(() => {
        const controller = new AbortController()
        getRepos(controller.signal)
        return () => controller.abort()
    }, [repoResultPage])

    const getRepos = async (signal) => {
        try {
            const octokit = new Octokit({
                auth: import.meta.env.VITE_GITHUB_TOKEN,
                request: { signal }
            });
            const result = await octokit.request('GET /users/{username}/repos', {
                username: userRepo,
                page: repoResultPage,
                per_page: perPage,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            })
            const user = await octokit.request('GET /users/{username}', {
                username: userRepo,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            })
            if (result.status === 200 && user.status === 200) {
                let message = ''
                if (result.data.length === 0)
                    message = 'Empty'
                else {
                    const repoCount = user.data.public_repos
                    setPaginationPage(Math.ceil(repoCount / perPage))
                    // setUserRepos(result.data)
                    // setFetchMessage(repoCount + ' repo')
                    message = repoCount + ' repo'
                }
                dispatch(SetRepoResultAction({
                    repoResult: result?.data,
                    repoResultMessage: message
                }))
            }
        } catch (error) {
            if (error.code !== 20) {
                let message = error.message || ''
                if (error?.code === 500) message = 'Internet is not available'
                // console.error('err', error.code);
                // setFetchMessage(message)
                dispatch(SetRepoResultAction({
                    repoResult: [],
                    repoResultError: message
                }))
            }
        } finally {
            setIsChangePage(false)
        }

    }
    const handleChangePage = (e, value) => {
        setIsChangePage(true)
        dispatch(SetRepoResultPageAction(value))
    }
    const breadcrumbs = [
        <IconButton color="text.primary"
            onClick={() => { dispatch(SetSearchValueAction('')); navigate('/') }}
            key={0}
        ><HomeIcon /></IconButton>,
        searchValue && <Link underline="hover" to="/" key={1} color="primary" >
            <Typography color="text.primary">Search</Typography>
        </Link>,
        <Typography color="text.primary" key={2}>{userRepo}'s repos</Typography>
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
            {repoResultMessage &&
                <Typography variant="h6" align="center">
                    {repoResultMessage}
                </Typography>}
            {!repoResultMessage && repoResult?.length === 0 &&
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>}
            <Box>
                <List component="nav" aria-label="repos result">
                    {
                        repoResult.map((repo) => {
                            const { id, full_name, } = repo
                            return isChangePage ? <Skeleton animation='wave' key={id}>
                                <RepoItem repo={repo} />
                                <Divider />
                            </Skeleton>
                                :
                                <div key={id}>
                                    <RepoItem
                                        repo={repo}
                                        onClick={() => navigate('/' + full_name + '/commit')}
                                    />
                                    <Divider />
                                </div>
                        })
                    }
                </List>
            </Box>
            {repoResult.length !== 0 && paginationPage > 1 &&
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <Pagination
                        count={paginationPage}
                        page={repoResultPage}
                        variant="outlined"
                        color="primary"
                        onChange={handleChangePage}
                    />
                </Box>}
        </Container>
    )
}
function RepoItem({ repo, onClick }) {
    const { id, name, full_name, description, stargazers_count, open_issues_count } = repo
    return (
        <ListItemButton
            onClick={onClick}
        >
            <Grid container>
                <Grid item xs>
                    <Typography>{name}</Typography>
                    <Typography fontSize='14px' color={"gray"}>{description}</Typography>
                </Grid>
                <Grid item >
                    <Box display="flex" flexDirection="column" alignItems="end">
                        <Box display="flex">
                            <Typography>{stargazers_count} </Typography>
                            <StarIcon fontSize="small" sx={{ marginLeft: "4px" }} />
                        </Box>
                        {open_issues_count !== 0 &&
                            <Typography fontSize='small' color={"gray"}>
                                {open_issues_count} issues need help
                            </Typography>
                        }
                    </Box>
                </Grid>
            </Grid>
        </ListItemButton>
    )
}
export default Repositories