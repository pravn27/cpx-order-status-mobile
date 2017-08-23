import { LOADING_START, LOADING_STOPPED, GET_WATCHLIST, GET_WATCHLIST_SORT, ORDER_REMOVED_FROM_WATCHLIST,
         TOGGLE_SORT_ASCEND, RETAIN_FILTER, FILTER_CRITERIA, SORT_CRITERIA, DEFAULT_SORT } from '../actions/watchListActions';

import { FETCHING_USER_INFO, USER_INFO_RECEIVED } from '../actions/userActions';


const 
    initialState = { IsLoading: false, data: [], sortData: [] },
    initialFilterCriteria = ['Submitted', 'Accepted', 'In Production', 'Shipped to Customer', 'Delivered', 'Cancelled'];

function isLoading ( state = false, { type }) {
    switch (type) {
        case GET_WATCHLIST:
        case GET_WATCHLIST_SORT:
        case ORDER_REMOVED_FROM_WATCHLIST:
        case FETCHING_USER_INFO:
        case LOADING_START:
            return true;

        case LOADING_STOPPED:
        case USER_INFO_RECEIVED:
            return false;

        default:
            return state
    }
}

function updateWatchlistData ( state = [], { type, watchList, assetId, userInfo }) {
    switch (type) {

        case USER_INFO_RECEIVED:
            watchList = userInfo.watchList.list;
        case GET_WATCHLIST:
            var filterWatchList = watchList.filter(x => x.asset.qtcuid !== undefined);
            
            return filterWatchList;
           
        case ORDER_REMOVED_FROM_WATCHLIST:
            var clonedWatchList = state.slice(0);
            var index = clonedWatchList.findIndex(x => x.assetId === assetId);
            clonedWatchList.splice(index, 1);
            return clonedWatchList;

        default:
            return state
    }
}

function sortType ( state = false, { type }) {
    // TRUE - Means ascending sort
    // FALSE - Descending sort

    switch (type) {
        case TOGGLE_SORT_ASCEND:
            return !state;

        default:
            return state
    }
}

function setRetainFilter (state = false, { type, flag }) {
    // true: retain filter i.e. when user goes into order details and go back to watchlist
    // false: opposite of true, duh

    switch (type) {
        case RETAIN_FILTER:
            return flag;

        default:
            return state;
    }
}

function setFilterCriteria ( state = initialFilterCriteria, { type, criteria }) {
    switch (type) {
        case FILTER_CRITERIA:
            return criteria;

        default:
            return state
    }
}

function setDefaultSort ( state = true, { type, flag }) {

    switch (type) {
        case DEFAULT_SORT:
            return flag;
        default:
            return state
    }
}

function watchlistLastUpdated ( state = new Date(), { type, last_updated }) {
    switch (type) {
        case USER_INFO_RECEIVED:
        case GET_WATCHLIST:
            return last_updated;

        default:
            return state
    }
}

export const watchList = (state = {}, action) => {

    return Object.assign({}, state, 
        {
            IsLoading: isLoading( state.IsLoading, action ),
            data: updateWatchlistData( state.data, action ),
            watchlistLastUpdated: watchlistLastUpdated( state.watchlistLastUpdated, action ),
            ascendingSort: sortType( state.ascendingSort, action ),
            retainFilter: setRetainFilter( state.retainFilter, action ),
            filterCriteria: setFilterCriteria( state.filterCriteria, action ),
            defaultSort: setDefaultSort(state.defaultSort,action)
        }
    )
}

export default watchList
