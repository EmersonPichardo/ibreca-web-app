import { createContext, useState } from 'react';

export const PageContext = createContext();

export default function PageContextProvider(props) {
    const [page, setPage] = useState({});

    const setCurrentPage = (config) => {
        const { title, subtitle, extra, onBack } = config;
        setPage({ title, subtitle, extra, onBack });
    }

    return (
        <PageContext.Provider value={{ currentPage: page, setCurrentPage }}>
            {props.element}
        </PageContext.Provider>
    )
}