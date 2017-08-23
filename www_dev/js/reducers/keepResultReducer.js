const keepResultReducer = (state = {}, action) => {
    switch (action.type) {
        case 'KEEP_RESULT':
            return action.result;
        default:
            return state
    }
}

export default keepResultReducer;
