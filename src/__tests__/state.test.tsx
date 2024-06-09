
import { describe, it, expect } from 'vitest';
import { StateProvider, useStateContext } from '../utils/hooks/useStateManager.tsx';
import {renderHook} from "@testing-library/react";
import {act} from "react";


const renderHookWithProvider = (hook: () => any) => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateProvider>{children}</StateProvider>
    );
    return renderHook(hook, { wrapper });
};

describe('useStateContext', () => {
    it('should initialize with the default state', () => {
        const { result } = renderHookWithProvider(useStateContext);
        expect(result.current.state.planetsList).toEqual([]);
    });

    it('should update the state correctly when dispatching an action', () => {
        const { result } = renderHookWithProvider(useStateContext);

        act(() => {
            result.current.dispatch({ type: 'SET_PLANETS_LIST', payload: [{ name: 'Earth' }] });
        });

        expect(result.current.state.planetsList).toEqual([{ name: 'Earth' }]);
    });

    it('should not mutate the previous state when updating', () => {
        const { result } = renderHookWithProvider(useStateContext);

        act(() => {
            result.current.dispatch({ type: 'SET_PLANETS_LIST', payload: [{ name: 'Mars' }] });
        });

        expect(result.current.state.planetsList).toEqual([{ name: 'Mars' }]);

        act(() => {
            result.current.dispatch({ type: 'SET_PLANETS_LIST', payload: [{ name: 'Venus' }] });
        });

        expect(result.current.state.planetsList).toEqual([{ name: 'Venus' }]);
    });
});
