import { useContext, useEffect } from 'react';

import { PageContext } from '../../contexts/pageContext';

import './home.css';

export default function Home() {
    const { setCurrentPage } = useContext(PageContext);

    useEffect(() => {
        setCurrentPage({
            title: "Home"
        });
    }, []);

    return '';
}