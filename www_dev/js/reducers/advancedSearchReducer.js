const advancedSearch = (state = {}, action) => {
    switch (action.type) {
        case 'ADVANCED_SEARCH':
            return action.query;
        default:
            return state
    }
}

export default advancedSearch;
