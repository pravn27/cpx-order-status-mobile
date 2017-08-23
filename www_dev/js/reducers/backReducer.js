const backReducer = (state = false, action) => {
    switch (action.type) {
        case 'BACK':
            return action.isBack;
        default:
            return state
    }
}

export default backReducer;
