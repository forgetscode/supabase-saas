import { useEffect } from "react";
import { supabase } from "../utils/supabase";

const Login = () => {
    useEffect(() => {
        supabase.auth.signInWithOAuth({
            provider: "github",
        })
    }, []);
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <p>Logging in...</p>
        </div>
    )
}

export default Login