"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.actionCreators = void 0;
// action creators - functions exposed to ui components that will trigger a state transition
// they don't directly mutate state, but they can have external side-effects (such as loading data).
exports.actionCreators = {
    requestRadio: function (startDateIndex) { return function (dispatch, getState) {
        // Only load data if it's something we don't already have (and are not already loading)
        var appState = getState();
        if (appState && appState.audio && startDateIndex !== appState.audio.startDateIndex) {
            fetch("audio")
                .then(function (response) { return response.json(); })
                .then(function (data) {
                dispatch({ type: 'RECEIVE_PLAYER_REQUEST', startDateIndex: startDateIndex, playlist: data });
            });
            dispatch({ type: 'REQUEST_PLAYER_REQUEST', startDateIndex: startDateIndex });
        }
    }; }
};
// reducer - for a given state and action, returns the new state.
var unloadedState = { playlist: [], isLoading: false, player: null };
exports.reducer = function (state, incomingAction) {
    if (state === undefined) {
        return unloadedState;
    }
    var action = incomingAction;
    switch (action.type) {
        case 'REQUEST_PLAYER_REQUEST':
            return {
                startDateIndex: action.startDateIndex,
                playlist: state.playlist,
                player: state.player,
                isLoading: true
            };
        case 'RECEIVE_PLAYER_REQUEST':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
                    playlist: state.playlist,
                    player: state.player,
                    isLoading: false
                };
            }
            break;
    }
    return state;
};
//# sourceMappingURL=audio.js.map