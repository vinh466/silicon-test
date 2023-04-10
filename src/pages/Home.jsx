import { Box, Breadcrumbs, CircularProgress, Container, IconButton, Pagination, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react";
import UsersResult from "../components/UsersResult";
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate, useParams } from "react-router-dom";
import { red } from "@mui/material/colors";
import { StoreContext } from "../store";
import { SetSearchValueAction, SetUserResultAction, SetUserResultPageAction } from "../store/action";
import GithubService from "../services/githubApi.service";

const perPage = 10

function Home() {
    const [isChangePage, setIsChangePage] = useState(false)
    const navigate = useNavigate()
    const { dispatch, state: {
        searchValue,
        userResult,
        searchMessage,
        searchError,
        userResultPage,
        userPaginationPage
    } } = useContext(StoreContext);
    const { user: username } = useParams()

    useEffect(() => {
        const controller = new AbortController()
        if (searchValue) handleSearch(controller.signal)
        return () => controller && controller.abort()
    }, [userResultPage, searchValue])

    const handleSearch = async (signal) => {
        try {
            const githubService = new GithubService(signal)
            const result = await githubService.searchUsers({
                q: searchValue,
                page: userResultPage,
                per_page: perPage,
            })
            if (result.status === 200) {
                const users = result.data
                let message = ''
                if (users.items?.length === 0)
                    message = 'Your search did not match any users'
                else {
                    message = users.total_count + ' results'
                    dispatch(SetUserResultPageAction(
                        userResultPage,
                        Math.ceil(users.total_count / perPage)
                    ))
                }
                dispatch(SetUserResultAction({
                    userResult: users.items,
                    searchMessage: message
                }))
            }
        } catch (error) {
            dispatch(SetUserResultAction({
                userResult: [],
                searchError: error.message || 'Error'
            }))
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
            {userResult.length !== 0 && userPaginationPage > 1 &&
                <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                    <Pagination
                        count={userPaginationPage}
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