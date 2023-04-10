import { Box, Divider, IconButton, InputBase, Paper, Typography } from "@mui/material"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { useContext, useEffect, useMemo, useState } from "react";
import { StoreContext } from "../../store";
import { SetSearchValueAction, SetUserResultAction } from "../../store/action";

function AppbarLayout() {
    const { dispatch, state: { searchValue, userResult } } = useContext(StoreContext);

    const navigate = useNavigate()
    const location = useLocation();
    const [searchInput, setSearchInput] = useState('')
    const isStart = useMemo(() => !searchValue && location.pathname === '/', [searchValue, location.pathname])
    useEffect(() => { setSearchInput(searchValue) }, [searchValue])
    useEffect(() => {
        dispatch(SetUserResultAction([]))
    }, [searchValue])
    const handleSearch = async (e) => {
        e.preventDefault()
        if (searchInput) {
            dispatch(SetSearchValueAction(searchInput))
        }
        navigate('/')
    }

    return (
        <div>
            <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', }}>
                <img
                    src="/silicon-stack-logo-dark.png"
                    alt="logo"
                    style={{
                        width: isStart ? '400px' : '200px',
                        margin: isStart ? '40px 0' : '0',
                        transition: 'all ease .4s'
                    }}
                />
                <Box>
                    <Paper
                        autoComplete="off"
                        onSubmit={(e) => handleSearch(e)}
                        elevation={8}
                        component="form"
                        sx={{ p: '2px 4px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', }}
                    >
                        <Box sx={{ p: '6px', transform: 'translateY(4px)' }}><PersonIcon /></Box>
                        <InputBase
                            style={{ width: isStart ? '600px' : '400px', transition: 'all ease .5s' }}
                            name="search"
                            autoComplete='off'
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="search github user"
                            inputProps={{ 'aria-label': 'search github user' }}

                        />
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <IconButton
                            type="submit"
                            sx={{ p: '10px' }}
                            aria-label="search"
                        >
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    {isStart && <Typography margin={'10px'} align="center">A github search tool!</Typography>}
                </Box>

            </Box>
            <Outlet />
        </div>
    )
}

export default AppbarLayout