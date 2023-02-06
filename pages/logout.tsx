import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import Router, { useRouter } from "next/router";

const Logout = () => {
    useEffect(() => {
        const logout = async () => {
            await supabase.auth.signOut();
            console.log("logged out");
            Router.push('/')
        }
        logout();
    }, []);

    return(
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <p>Logging out...</p>
        </div>
    ) 
};

export default Logout;