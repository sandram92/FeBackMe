const express = require("express");
const mongoose = require("mongoose");
const keys = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");

const User = mongoose.model("users");
const stripe = require("stripe")(keys.stripeSecretKey);
const CREDITS_PER_PURCHASE = 5;

async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata?.userId || session.client_reference_id;
  const credits = Number.parseInt(session.metadata?.credits, 10);

  if (!userId || !Number.isFinite(credits)) {
    console.log("Stripe checkout completed without user metadata", session.id);
    return;
  }

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      stripeCheckoutSessions: { $ne: session.id },
    },
    {
      $inc: { credits },
      $push: { stripeCheckoutSessions: session.id },
    },
    { new: true },
  );

  if (!user) {
    console.log("Stripe checkout already handled or user missing", {
      sessionId: session.id,
      userId,
    });
    return;
  }

  console.log("Stripe payment confirmed", {
    sessionId: session.id,
    userId: user.id,
    creditsAdded: credits,
    totalCredits: user.credits,
    amountTotal: session.amount_total,
    currency: session.currency,
  });
}

function registerStripeWebhook(app) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      if (!keys.stripeWebhookSecret) {
        return res.status(500).send("Stripe webhook secret is not configured.");
      }

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          req.headers["stripe-signature"],
          keys.stripeWebhookSecret,
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return res.status(400).send(`Webhook Error: ${message}`);
      }

      try {
        console.log(`[stripe webhook] received ${event.type}`);

        if (event.type === "checkout.session.completed") {
          await handleCheckoutSessionCompleted(event.data.object);
        }

        res.send({ received: true, type: event.type });
      } catch (err) {
        console.error("Stripe webhook handler failed", err);
        res.status(500).send("Webhook handler failed.");
      }
    },
  );
}
// https://febackme.onrender.com/api/stripe/webhook
function registerBillingRoutes(app) {
  app.post("/api/create-checkout-session", requireLogin, async (req, res) => {
    const origin = req.get("origin") || `${req.protocol}://${req.get("host")}`;

    console.log("origin", origin);

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        client_reference_id: req.user.id,
        metadata: {
          userId: req.user.id,
          credits: String(CREDITS_PER_PURCHASE),
        },
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${CREDITS_PER_PURCHASE} email credits`,
              },
              unit_amount: 500,
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/surveys?payment=success`,
        cancel_url: `${origin}/surveys?payment=cancel`,
      });

      if (!session.url) {
        throw new Error("Stripe did not return a Checkout URL.");
      }

      res.send({ url: session.url });
    } catch (err) {
      res.status(500).send({ error: "Unable to create checkout session." });
    }
  });
}

module.exports = {
  registerBillingRoutes,
  registerStripeWebhook,
};
