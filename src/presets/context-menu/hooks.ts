import { onCleanup } from "solid-js";

export function useDebounce(
    cb: () => void,
    timeout: number
): [(() => void) | null, () => void] {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function cancel() {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }

    const func = () => {
        cancel();
        timeoutId = setTimeout(() => {
            cb();
        }, timeout);
    };

    // Cleanup on component unmount
    onCleanup(cancel);

    return [func, cancel];
}
