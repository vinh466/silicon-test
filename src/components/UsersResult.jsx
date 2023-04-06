import { Divider, List, Skeleton, } from "@mui/material";
import UserCard from "./UserCard";

function UsersResult({ userList, isChangePage = false }) {
    return <List component="nav" aria-label="users result">
        {
            userList.map((user) => {
                const { id, } = user
                return isChangePage ? <Skeleton
                    animation='wave'
                    key={id}
                >
                    <UserCard user={user} />
                    <Divider />
                </Skeleton>
                    :
                    <div key={id}>
                        <UserCard user={user} />
                        <Divider />
                    </div>
            })
        }
    </List>
}

export default UsersResult