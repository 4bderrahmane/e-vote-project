import {RouterProvider} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import router from "./routes/routes";
import {AuthProvider} from "./auth/AuthProvider";
import LoadingSpinner from "./shared/components/LoadingSpinner.tsx";
import {ToastProvider} from "./shared/contexts/ToastProvider.tsx";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <AuthProvider>
                    <RouterProvider router={router} fallbackElement={<LoadingSpinner/>}/>
                </AuthProvider>
            </ToastProvider>
        </QueryClientProvider>
    );
}