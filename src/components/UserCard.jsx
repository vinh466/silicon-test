import { Avatar, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import { Octokit } from "@octokit/core"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function UserCard({ user }) {
    const { id, login, avatar_url, url, repos_url } = user
    const navigate = useNavigate()

    return <ListItemButton
        key={id}
        onClick={() => navigate('/' + login + '/repositories')}
    >
        <ListItemAvatar>
            <Avatar alt={login} src={avatar_url} />
        </ListItemAvatar>
        <ListItemText primary={login} />
        {/* <span>{url}</span>
                    <span>{repos_url}</span> */}
    </ListItemButton>
}

export default UserCard 