import DispathAction from './action'

export const initialState = {
    searchValue: '',

    userResult: [],
    userResultPage: 1,
    searchMessage: '',
    searchError: '',

    repoResult: [],
    repoResultPage: 1,
    repoResultMessage: '',
    repoResultError: '',
};
const reducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
        case DispathAction.SetSearchValue:
            return {
                ...state,
                userResultPage: 1,
                searchValue: payload?.searchValue || ''
            };
        case DispathAction.SetUserResult:
            return {
                ...state,
                userResult: payload?.userResult || [],
                searchMessage: payload?.searchMessage || '',
                searchError: payload?.searchError || '',
            };
        case DispathAction.SetUserResultPage:
            return {
                ...state,
                userResultPage: payload?.userPage || 1
            };
        case DispathAction.SetRepoResult:

            return {
                ...state,
                repoResult: payload?.repoResult || [],
                repoResultMessage: payload?.repoResultMessage || '',
                repoResultError: payload?.repoResultError || '',
            };
        case DispathAction.SetRepoResultPage:
            return {
                ...state,
                repoResultPage: payload?.repoPage || 1
            };
        default:
            console.log((`No case for type ${type} found in store.`));
            return state
    }

}
export default reducer