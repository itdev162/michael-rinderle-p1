import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { AudioControls } from '../models/AudioControls'

// state - this defines the type of data maintained in the Redux store.
export interface AudioState {
    isLoading: boolean;
    startDateIndex?: number;
    player: Player;
    playlist: UpcomingSong[];
}

export interface Player {
    audio: AudioControls;
}

export interface UpcomingSong {
    title: string;
    artist: string;
}

// actions - these are serializable (hence replayable) descriptions of state transitions.
// they do not themselves have any side-effects; they just describe something that is going to happen.
interface RequestPlayerAction {
    type: 'REQUEST_PLAYER_REQUEST';
    startDateIndex: number;
}

interface ReceivePlayerAction {
    type: 'RECEIVE_PLAYER_REQUEST';
    startDateIndex: number;
    playlist: UpcomingSong[];
}

// declare a 'discriminated union' type. this guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestPlayerAction | ReceivePlayerAction;

// action creators - functions exposed to ui components that will trigger a state transition
// they don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    requestRadio: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.audio && startDateIndex !== appState.audio.startDateIndex) {
            fetch(`audio`)
                .then(response => response.json() as Promise<UpcomingSong[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_PLAYER_REQUEST', startDateIndex: startDateIndex, playlist: data });
                });

            dispatch({ type: 'REQUEST_PLAYER_REQUEST', startDateIndex: startDateIndex });
        }
    }
};

// reducer - for a given state and action, returns the new state.
const unloadedState: AudioState = { playlist: [], isLoading: false, player: null };

export const reducer: Reducer<AudioState> = (state: AudioState | undefined, incomingAction: Action): AudioState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
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
