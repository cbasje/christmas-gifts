import { Draft, produce } from "immer";
import { shallowRef } from "vue";

export const useImmer = <T>(baseState: T) => {
    const state = shallowRef(baseState);
    const update = (updater: any) => {
        state.value = produce(state.value, updater);
    };

    return { state, update };
};
