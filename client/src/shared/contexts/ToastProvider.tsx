import React, {useState, useCallback, useMemo} from 'react';
import SuccessToast from '../components/SuccessToast';
import type {ToastProviderProps} from "../types/types.ts";
import {ToastContext} from "./ToastContext.tsx";

export const ToastProvider: React.FC<ToastProviderProps> = ({children}) => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const showToast = useCallback((message: string, duration: number = 3000) => {
        setToastMessage(message);
        setIsVisible(true);

        setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => setToastMessage(null), 300);
        }, duration);
    }, []);

    const closeToast = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => setToastMessage(null), 300);
    }, []);

    const contextValue = useMemo(() => ({
        showToast,
    }), [showToast]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            {toastMessage && (
                <SuccessToast
                    message={toastMessage}
                    isVisible={isVisible}
                    onClose={closeToast}
                />
            )}
        </ToastContext.Provider>
    );
};
