import { Box, Breadcrumbs, CircularProgress, Container, Divider, Grid, IconButton, List, ListItemButton, Pagination, Skeleton, Typography } from "@mui/material"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SetRepoResultAction, SetRepoResultPageAction, SetSearchValueAction } from "../store/action";
import { StoreContext } from "../store";
import GithubService from "../services/githubApi.service";

const perPage = 10

function Repositories() {
    const { user: userRepo } = useParams()
    const { dispatch, state: { searchValue, repoResult, repoResultPage, repoResultMessage, repoResultError } } = useContext(StoreContext);
    const [paginationPage, setPaginationPage] = useState(0)
    const [isChangePage, setIsChangePage] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(SetRepoResultAction([]))
    }, [userRepo])

    useEffect(() => {
        const controller = new AbortController()
        getRepos(controller.signal)
        return () => controller.abort()
    }, [repoResultPage, userRepo])

    const getRepos = async (signal) => {
        try {
            const githubService = new GithubService(signal)
            const getRepos = githubService.getUserRepos({
                username: userRepo,
                page: repoResultPage,
                per_page: perPage,
            })
            const getUser = githubService.getUser(userRepo)
            const [repoResult, userResult] = await Promise.all([getRepos, getUser])


            if (repoResult.status === 200 && userResult.status === 200) {
                const repos = repoResult.data
                const user = userResult.data
                let message = ''
                if (repos?.length === 0)
                    message = 'Empty'
                else if (user?.public_repos) {
                    setPaginationPage(Math.ceil(user.public_repos / perPage))
                    message = user.public_repos + ' repo'
                }
                dispatch(SetRepoResultAction({
                    repoResult: repos,
                    repoResultMessage: message
                }))
            }
        } catch (error) {
            // console.log(error);
            dispatch(SetRepoResultAction({
                repoResult: [],
                repoResultError: error.message || 'Error'
            }))
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
            {repoResultError &&
                <Typography variant="h6" align="center" color={red[300]}>
                    {repoResultError}
                </Typography>}
            {!repoResultMessage && !repoResultError && repoResult?.length === 0 &&
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