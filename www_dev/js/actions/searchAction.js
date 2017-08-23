const resetValues =  { filterText: null, sortText: null, sortOrder: null };

export const searchAction = (orderlist) => ({
    type: 'SEARCH',
    orderlist
});

export const advancedSearchAction = (query) => ({
    type: 'ADVANCED_SEARCH',
    query
});

export const keepResultAction = (result) => ({
    type: 'KEEP_RESULT',
    result
});

export const resetFilterAndSorting = () => {
   return dispatch =>  {
    dispatch(keepResultAction(resetValues));
}};
