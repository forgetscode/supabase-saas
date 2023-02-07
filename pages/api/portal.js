import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
    if (req.method === 'GET') {
        // Create authenticated Supabase Client
        const supabaseServerClient = createServerSupabaseClient({
            req,
            res,
        });

        // Check if we have a session
        const {
            data: { session },
        } = await supabaseServerClient.auth.getSession();

        if (!session) {
            return res.status(401).send("Unauthorized");
        }

        try {
            const {
                data,
            } = await supabaseServerClient
                .from("profile")
                .select("stripe_customer")
                .eq("id", session?.user.id)
                .single();

            if (!data) {
                return res.status(404).send("Stripe customer not found");
            }

            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: data.stripe_customer,
                return_url: `${process.env.CLIENT_URL}/dashboard`,
            });

            res.status(200).json({ stripeSession });
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'GET');
        res.status(405).end('Method Not Allowed');
    }
};

export default handler;
