import {isRouteErrorResponse, useRouteError} from "react-router-dom";

export default function RouteErrorElement() {
    const err = useRouteError();

    if (isRouteErrorResponse(err)) {
        return (
            <div style={{padding: 24}}>
                <h2>Route error</h2>
                <p>
                    {err.status} — {err.statusText}
                </p>
            </div>
        );
    }

    return (
        <div style={{padding: 24}}>
            <h2>Unexpected error</h2>
            <pre style={{whiteSpace: "pre-wrap"}}>{String(err)}</pre>
        </div>
    );
}
