import { GetServerSidePropsContext } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from "next/router";
import { useUserProfile } from "../hooks/use-profile";

export default function Dashboard() {
    const { fetching: loadingProfile, error, profile } = useUserProfile();
    const router = useRouter();
    const loadPortal = async () => {
        const response = await fetch("/api/portal");
        const data = await response.json();

        router.push(data.stripeSession.url);
    };

    return (
        <div className="w-full max-w-3xl mx-auto py-16 px-8">
        <h1 className="text-3xl mb-6">Dashboard</h1>
        {loadingProfile === false && (
            <>
                <p className="mb-6 text-teal-500 font-black text-xl">
                {profile?.is_subscribed
                    ? `Subscribed: ${profile.interval}`
                    : "Not subscribed"}
                </p>
                <button onClick={loadPortal} className="rounded-lg text-sm font-semibold py-3 px-4 mt-8 bg-violet-800 text-white hover:bg-violet-500">Manage Subscription</button>
            </>
        )}
        </div>
    );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	// Create authenticated Supabase Client
	const supabaseServerClient = createServerSupabaseClient(ctx);

	// Check if we have a session
	const {
		data: { session },
	} = await supabaseServerClient.auth.getSession();

	if (!session) {
		return {
			redirect: {
                permanent: false,
                destination: "/login",
            },
            props: {},
		}
	}

	return {
		props: {
			initialSession: session,
			user: session.user,
		},
	};
};