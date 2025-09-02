
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const { action, planData } = await req.json();

    switch (action) {
      case "create": {
        // Criar produto no Stripe
        const product = await stripe.products.create({
          name: planData.name,
          description: planData.description,
        });

        // Criar preço no Stripe
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(planData.price_monthly * 100),
          currency: "brl",
          recurring: { interval: "month" },
        });

        let yearlyPrice = null;
        if (planData.price_yearly) {
          yearlyPrice = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(planData.price_yearly * 100),
            currency: "brl",
            recurring: { interval: "year" },
          });
        }

        // Salvar no Supabase
        const { data: newPlan, error } = await supabaseClient
          .from("subscription_plans")
          .insert({
            name: planData.name,
            description: planData.description,
            price_monthly: planData.price_monthly,
            price_yearly: planData.price_yearly,
            features: planData.features,
            stripe_price_id: price.id,
            status: planData.status || "active",
            trial_days: planData.trial_days || 0,
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, plan: newPlan }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "update": {
        const { planId, updates } = planData;

        // Buscar o plano atual
        const { data: currentPlan } = await supabaseClient
          .from("subscription_plans")
          .select("*")
          .eq("id", planId)
          .single();

        if (!currentPlan) {
          throw new Error("Plano não encontrado");
        }

        // Se o preço mudou, criar novo preço no Stripe
        let newStripePrice = currentPlan.stripe_price_id;
        if (updates.price_monthly && updates.price_monthly !== currentPlan.price_monthly) {
          const newPrice = await stripe.prices.create({
            product: currentPlan.stripe_price_id ? 
              (await stripe.prices.retrieve(currentPlan.stripe_price_id)).product : 
              (await stripe.products.create({ name: currentPlan.name })).id,
            unit_amount: Math.round(updates.price_monthly * 100),
            currency: "brl",
            recurring: { interval: "month" },
          });
          newStripePrice = newPrice.id;
        }

        // Atualizar no Supabase
        const { data: updatedPlan, error } = await supabaseClient
          .from("subscription_plans")
          .update({
            ...updates,
            stripe_price_id: newStripePrice,
          })
          .eq("id", planId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, plan: updatedPlan }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      default:
        throw new Error("Ação não suportada");
    }
  } catch (error) {
    console.error("Error in manage-subscription-plans:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
