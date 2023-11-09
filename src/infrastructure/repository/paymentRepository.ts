import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined");
}

const stripe = new Stripe(stripeSecretKey);

class PaymentRepository {
  async ConfirmPayment(data: any) {
    console.log(data, "Reached payment");
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:4242/success",
      cancel_url: "http://localhost:4242/cancel",
    });

    return session;
  }

  async PaymentSuccess(request: any) {
    console.log(request, "this is the request");

    const payload = request.body;
    const payloadString = JSON.stringify(payload, null, 2);
    const sig = request.headers["stripe-signature"];

    if (typeof sig !== "string") {
      return false;
    }

    const endpointSecret =
      "whsec_58dacc12a6ed659bca48edc52c664e95a502f3d98831948ae548a43f81791e66";
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: endpointSecret,
    });

    let event;

    event = stripe.webhooks.constructEvent(
      payloadString,
      header,
      endpointSecret
    );
    console.log(`Webhook Verified: `, event);
    if (event.type == "checkout.session.completed") {
      return true;
    } else {
      return false;
    }
  }
}

export default PaymentRepository;
