import initStripe from "stripe";
import { product } from "../types/lesson";
import { useUserProfile } from "../hooks/use-profile";
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

    const showSubscribeButton = profile && !profile.is_subscribed;
    const showCreateAccountButton = !profile;
    const showManageSubscriptionButton = profile && profile.is_subscribed;

    return (
        <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
            {plans.map((plan: product) => (
                <div key={plan.id} className="w-80 rounded shadow px-6 py-4">
                    <h2 className="text-xl">{plan.name}</h2>
                    <p className="text-gray-500">
                        ${plan.price / 100} / {plan.interval}
                    </p>
                    {!loadingProfile && (
                        <div>
                            {showSubscribeButton && (
                                <button onClick={processSubscription(plan.id)} className="w-full justify-center rounded-lg text-sm font-semibold py-3 px-4 mt-8 bg-violet-800 text-white hover:bg-violet-500">
                                    Subscribe
                                </button>
                            )}
                            {showCreateAccountButton && (
                                <Link href="/login" legacyBehavior className="w-full justify-center rounded-lg text-sm font-semibold py-3 px-4 mt-8 bg-violet-800 text-white hover:bg-violet-500">
                                    Create Account
                                </Link>
                            )}
                            {showManageSubscriptionButton && (
                                <Link href="/dashboard" legacyBehavior>
                                    <a className="w-full block justify-center rounded-lg text-center text-sm font-semibold py-3 px-4 mt-8 bg-violet-800 text-white hover:bg-violet-500">Manage Subscription</a>
                                </Link>
                            )}
                        </div>
                    )}
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
