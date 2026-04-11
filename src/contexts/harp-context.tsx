'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useState, Suspense } from 'react';

export interface IHarpContext {
    application?: string | null;
    setApplication: (appName: string) => void;
    applicationUrl?: string | null;
    setApplicationUrl: (appName: string) => void;
}

export const HarpContext = createContext<IHarpContext>({} as any);

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

function HarpProviderContent({ children }: any) {
    const searchParams = useSearchParams();

    const harpApplication = searchParams.get("i") || getCookie("harp-product");
    const harpRedirect = searchParams.get("r");

    const [application, setApplication] = useState<string | null>(harpApplication);
    const [applicationUrl, setApplicationUrl] = useState<string | null>(harpRedirect);

    const contextValue: IHarpContext = {
        application,
        setApplication,
        applicationUrl,
        setApplicationUrl,
    };

    return (
        <HarpContext.Provider value={contextValue}>
            {children}
        </HarpContext.Provider>
    );
}

export const HarpProvider = ({ children }: any) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HarpProviderContent>
                {children}
            </HarpProviderContent>
        </Suspense>
    );
}

export function useHarp() {
    return useContext(HarpContext);
}
