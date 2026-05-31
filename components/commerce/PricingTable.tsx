"use client";

import { Check } from "lucide-react";

const plans = [
  {
    name: "Day Pass",
    id: "day_pass",
    price: "$9.90",
    description: "Access all content for 24 hours",
    features: ["All Photos & Videos", "24/7 Access", "No Download"],
  },
  {
    name: "Monthly",
    id: "monthly_sub",
    price: "$29.90",
    description: "Billed monthly. Cancel anytime.",
    features: ["All Photos & Videos", "Priority Support", "High Resolution"],
    highlight: true,
  },
  {
    name: "VIP Lifetime",
    id: "lifetime",
    price: "$199.00",
    description: "One-time payment for forever access",
    features: [
      "All Photos & Videos",
      "Private Contact Info",
      "Original Source Files",
      "Exclusive Requests",
    ],
  },
];

export function PricingTable() {
  return (
    <div className="py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Unlock Exclusive Access
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Choose a plan to support and view all private content.
        </p>
      </div>

      <div className="grid max-w-7xl mx-auto gap-8 lg:grid-cols-3 items-center">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col p-8 bg-white rounded-2xl shadow-xl ring-1 ${
              plan.highlight
                ? "ring-pink-500 scale-105 z-10"
                : "ring-gray-200"
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            <p className="mt-2 text-gray-500 text-sm h-10">{plan.description}</p>
            <div className="my-6">
              <span className="text-4xl font-bold text-gray-900">
                {plan.price}
              </span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-pink-500 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => alert(`Selected ${plan.name} - Payment Modal Placeholder`)}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                plan.highlight
                  ? "bg-pink-600 text-white hover:bg-pink-700 shadow-lg hover:shadow-pink-500/30"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
