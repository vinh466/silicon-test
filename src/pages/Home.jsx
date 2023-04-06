import { Box, Breadcrumbs, Button, CircularProgress, Container, Divider, Grid, IconButton, InputBase, Pagination, Paper, Typography } from "@mui/material"
import { useContext, useEffect, useMemo, useState } from "react";
import { Octokit } from "@octokit/core";
import UsersResult from "../components/UsersResult";
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link, useNavigate, useParams } from "react-router-dom";
import { red } from "@mui/material/colors";
import { StoreContext } from "../store";
import { SetSearchValueAction, SetUserResultAction, SetUserResultPageAction } from "../store/action";

const perPage = 10

// import dotenv from 'dotenv'
// dotenv.config()

function Home() {
    const [isChangePage, setIsChangePage] = useState(false)
    const [paginationPage, setPaginationPage] = useState(0)
    const navigate = useNavigate()
    const { dispatch, state: {
        searchValue,
        userResult,
        searchMessage,
        searchError,
        userResultPage
    } } = useContext(StoreContext);
    const { user: username } = useParams()
    useEffect(() => {
        const controller = new AbortController()
        dispatch(SetUserResultAction([]))
        if (searchValue) handleSearch(controller.signal)
        return () => controller && controller.abort()
    }, [searchValue])

    useEffect(() => {
        const controller = new AbortController()
        if (searchValue) handleSearch(controller.signal)
        return () => controller && controller.abort()
    }, [userResultPage])

    const handleSearch = async (signal) => {
        try {
            const octokit = new Octokit({
                auth: import.meta.env.VITE_GITHUB_TOKEN,
                request: { signal }
            });
            const result = await octokit.request('GET /search/users', {
                q: searchValue,
                page: userResultPage,
                per_page: perPage,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                },
            })
            if (result.status === 200) {
                let message = ''
                if (result?.data?.items?.length === 0)
                    message = 'Your search did not match any users'
                else {
                    const count = result.data.total_count
                    message = result.data.total_count + ' results'
                    setPaginationPage(Math.ceil(count / perPage))
                }
                dispatch(SetUserResultAction({
                    userResult: result?.data?.items,
                    searchMessage: message
                }))
            }
        } catch (error) {
            if (error.code !== 20) {
                let message = error.message || ''
                if (error?.code === 500) message = 'Internet is not available'
                dispatch(SetUserResultAction({
                    userResult: [],
                    searchError: message
                }))
            }
        } finally {
            setIsChangePage(false)
        }
    }
    const handleChangePage = (e, value) => {
        setIsChangePage(true)
        dispatch(SetUserResultPageAction(value))
    }
    const breadcrumbs = [
        searchValue &&
        <IconButton color="text.primary"
            onClick={() => { dispatch(SetSearchValueAction('')); navigate('/') }}
            key={0}
        ><HomeIcon /></IconButton>,
        searchValue && <Typography color="text.primary" key={1}>Search</Typography>
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
            {searchMessage &&
                <Typography variant="h6" align="center">
                    {searchMessage}
                </Typography>}
            {searchError &&
                <Typography variant="h6" align="center" color={red[300]}>
                    {searchError}
                </Typography>}
            {!searchMessage && !searchError && userResult.length === 0 && searchValue &&
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>}
            {userResult.length !== 0 &&
                <UsersResult userList={userResult} isChangePage={isChangePage} />
            }
            {userResult.length !== 0 && paginationPage > 1 &&
                <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                    <Pagination
                        count={paginationPage}
                        variant="outlined"
                        color="primary"
                        page={userResultPage}
                        onChange={handleChangePage}
                    />
                </Box>}
        </Container>
    )
}

export default Home