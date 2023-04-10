const action = {
    SetSearchValue: 'SetSearchValue',
    SetUserResult: 'SetUserResult',
    SetUserResultPage: 'SetUserResultPage',
    SetRepoResult: 'SetRepoResult',
    SetRepoResultPage: 'SetRepoResultPage',
}
const SetSearchValueAction = (searchValue) => ({
    type: action.SetSearchValue,
    payload: { searchValue }
})
const SetUserResultAction = ({ userResult, searchMessage, searchError }) => ({
    type: action.SetUserResult,
    payload: { userResult, searchMessage, searchError }
})
const SetUserResultPageAction = (userPage, userPaginationPage) => ({
    type: action.SetUserResultPage,
    payload: { userPage, userPaginationPage }
})
const SetRepoResultAction = ({ repoResult, repoResultMessage, repoResultError }) => ({
    type: action.SetRepoResult,
    payload: { repoResult, repoResultMessage, repoResultError }
})
const SetRepoResultPageAction = (repoPage) => ({
    type: action.SetRepoResultPage,
    payload: { repoPage }
})
export {
    SetSearchValueAction,
    SetUserResultAction,
    SetUserResultPageAction,
    SetRepoResultAction,
    SetRepoResultPageAction,
}
export default action