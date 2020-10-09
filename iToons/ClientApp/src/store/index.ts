import * as Audio from './audio';

export interface ApplicationState {
    audio: Audio.AudioState | undefined;
}

export const reducers = {
    audio: Audio.reducer,
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
