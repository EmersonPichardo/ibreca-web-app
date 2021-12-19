import { Link } from "react-router-dom";

const BreadcrumbService = {
    itemRender: (route, _, routes, paths) => {
        const last = routes.indexOf(route) === routes.length - 1;

        return last || !route.path ? (
            <span style={{ cursor: 'default' }}>{route.breadcrumbName}</span>
        ) : (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        );
    }
}

export default BreadcrumbService;