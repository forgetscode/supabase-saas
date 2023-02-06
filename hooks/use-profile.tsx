import { User, useSession, useUser } from "@supabase/auth-helpers-react";
import { supabase } from "../utils/supabase";
import {
    createContext,
    FC,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { profile } from "../types/lesson";

interface UserProfileContext {
    error: any[] | null;
    fetching: boolean;
    profile: profile | null;
    auth: User | null;
}

interface Props {
    children: React.ReactNode;
}

const UserProfileContext = createContext<UserProfileContext>({
    error: null,
    fetching: false,
    profile: null,
    auth: null,
});

export const UserProfileContextProvider: FC<Props> = ({ children }) => {
    const [error, setError] = useState<any[] | null>(null);
    const [userProfile, setUserProfile] = useState<profile | null>(null);
    const [fetching, setFetching] = useState(false);
    const user = useUser();
    const session = useSession();
    

    useEffect(() => {
        if (!user) {
            return;
        }
        setFetching(true);
        (async () => {
            supabase
                .from("profile")
                .select("*")
                .eq("id", user.id)
                .single()
                .then((res) => {
                    if (res.error) {
                        throw res;
                    }
                    return res.data;
                })
                .then((res) =>
                    setUserProfile({
                        id: res.id ?? undefined,
                        created_at: res.created_at ?? undefined,
                        is_subscribed: res.is_subscribed ?? undefined,
                        interval: res.interval ?? undefined,
                        stripe_customer: res.stripe_customer ?? undefined,
                        email: res.email ?? undefined,
                    })
                );
        })()
            .catch((err) => {
                console.error("error fetching profile", err);
                setError(["error fetching profile", err]);
            })
            .finally(() => {
                setFetching(false);
            });
    }, [supabase, user]);

    const profile = useMemo(() => {
        if (userProfile) {
            return {
                ...userProfile,
            };
        }
        return null;
    }, [userProfile]);
    

    return (
        <UserProfileContext.Provider
            value={{
                auth: user,
                profile: profile,
                fetching: fetching,
                error: error,
            }}
        >
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => {
    return useContext(UserProfileContext);
};
