// src/lib/pricing.ts

const raw = process.env.NEXT_PUBLIC_PRICING;

export const PRICING = raw
  ? JSON.parse(raw)
  : {
      monthlyRegular: 4500,
      monthlyLaunch: 3900,
      monthlyReferral: 3600,
      referralDiscount: 300,
      yearlyTotal: 25200,
      yearlyMonthly: 2100,
    };
