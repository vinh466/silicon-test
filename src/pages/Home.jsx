import { Box, Button, Container, Divider, Grid, IconButton, InputBase, Paper } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { useEffect, useState } from "react";
import { Octokit } from "octokit";
function Home() {
    const [searchInput, setSearchInput] = useState('')
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });


    useEffect(() => { console.log(octokit); })

    const handleSearch = async (e) => {
        e.preventDefault()
        const result = await octokit.request('GET /search/users', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        console.log(result);
        console.log('handleSearch', searchInput);
    }
    return (
        <Container
            sx={{
                minHeight: '100vh'
            }}
        >
            <Box sx={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Paper
                    autoComplete="off"
                    onSubmit={(e) => handleSearch(e)}
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', }}
                >
                    <Box sx={{ p: '8px' }}><PersonIcon /></Box>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        name="search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="search github user"
                        inputProps={{ 'aria-label': 'search github user' }}
                        disabled

                    />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton
                        type="submit"
                        sx={{ p: '10px' }}

                        aria-label="search"
                        disabled
                    >
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </Box>
        </Container>
    )
}

export default Home