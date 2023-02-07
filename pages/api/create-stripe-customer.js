import initStripe from "stripe";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (req, res) => {
    if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
        return res.status(401).send("unauthorized");
    }
    
    const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

    const customer = await stripe.customers.create({
        email: req.body.record.email,
    });

    const supabase = createServerSupabaseClient({ req, res }, { 
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    });

    await supabase
        .from("profile")
        .update({
            stripe_customer: customer.id,
        })
        .eq("id", req.body.record.id);

    res.send({ message: `stripe customer created: ${customer.id}` });
};

export default handler;
