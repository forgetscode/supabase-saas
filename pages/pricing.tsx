import initStripe from "stripe";
import { product } from "../types/lesson";
import { useUserProfile } from "../hooks/use-profile";
import { supabase } from "../utils/supabase";
import Link from 'next/link';

const Pricing = ({ plans }: { plans: product[] }) => {
    const { fetching: loadingProfile, error, profile } = useUserProfile();

    const processSubscription = (planId: string) => async () => {
        const response = await fetch(`/api/subscription/${planId}`, {
            method: 'POST'
        });
        const data = await response.json();

        window.location.href = data.stripeSession.url;
    };

    
    function handleClick() {
        supabase.auth.signInWithOAuth({ provider: "github" }).then(response => {
          // handle response
        });
      }

    const showSubscribeButton = !!profile && !profile.is_subscribed;
    const showCreateAccountButton = !profile;
    const showManageSubscriptionButton = profile && profile.is_subscribed;

    return (
        <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
            {plans.map((plan) => (
                <div
                    key={plan.id}
                    className="w-80 flex flex-col rounded shadow px-6 py-4 space-y-2"
                >
                    <h2 className="text-xl">{plan.name}</h2>
                    <p className="text-gray-500">
                        ${plan.price / 100} / {plan.interval}
                    </p>
                    { loadingProfile ? <></> : 
                        <div className="border p-6 flex justify-center pointer-cursor bg-slate-100 hover:bg-slate-200">
                        {showSubscribeButton && (
                            <button onClick={processSubscription(plan.id)}>
                            Subscribe
                            </button>
                        )}
                        {showCreateAccountButton && (
                            <button onClick={handleClick}>Create Account</button>
                        )}
                        {showManageSubscriptionButton && (
                            <Link href="/dashboard">
                                <a>Manage Subscription</a>
                            </Link>
                        )}
                        </div>
                    }
                </div>
            ))}
        </div>
    );
};

export const getStaticProps = async () => {
    const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

    const { data: prices } = await stripe.prices.list();

    const plans = await Promise.all(
        prices.map(async (price: any) => {
            const product = await stripe.products.retrieve(price.product);
            return {
                id: price.id,
                name: product.name,
                price: price.unit_amount,
                interval: price.recurring.interval,
                currency: price.currency,
            };
        })
    );

    const sortedPlans = plans.sort(
        (a: product, b: product) => a.price - b.price
    );

    return {
        props: {
            plans: sortedPlans,
        },
    };
};

export default Pricing;
