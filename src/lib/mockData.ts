import type { DashboardData, PriceForecast } from "./api";

export const mockDashboardData: DashboardData = {
  temperature: 28.5,
  humidity: 62.3,
  co2: 480,
  quantity: 150,
  risk_level: "MODERATE",
  risk_score: 34.2,
  safe_storage_days: 41.7,
  confidence: 96,
  recommendation: {
    action: "HOLD",
    reason: "Current market prices are below optimal. Storage conditions are stable with moderate risk. Hold wheat for 12–15 days for better returns as prices are trending upward.",
    recommended_day: 14,
    expected_price: 2450,
    expected_total_value: 367500,
  },
  market_analysis: {
    trend: "Upward",
    volatility: 8.3,
    max_price: 2520,
    avg_price: 2340,
    min_price: 2180,
  },
  recommendations: [
    "Maintain current temperature below 30°C for optimal storage",
    "Monitor humidity levels — consider dehumidification if above 65%",
    "CO₂ levels are within acceptable range",
    "Inspect grain for signs of insect activity weekly",
    "Consider selling within 2 weeks for best market price",
  ],
  detailed_report: `=== WHEAT STORAGE ANALYSIS REPORT ===
Generated: ${new Date().toLocaleString()}

SENSOR READINGS:
  Temperature:  28.5°C
  Humidity:     62.3%
  CO₂ Level:    480 PPM
  Quantity:     150 quintals

RISK ASSESSMENT:
  Risk Level:   MODERATE
  Risk Score:   34.2 / 100
  Safe Storage: 41.7 days remaining

AI MODEL OUTPUT:
  Confidence:   96%
  Action:       HOLD
  Best Sell Day: Day 14
  Expected Price: ₹2,450/quintal
  Total Value:   ₹3,67,500

MARKET OVERVIEW:
  30-Day Trend:  Upward (+3.2%)
  Volatility:    8.3%
  Price Range:   ₹2,180 – ₹2,520/quintal

RECOMMENDATIONS:
  1. Hold grain for 12–15 days
  2. Monitor humidity closely
  3. Ensure proper aeration
  4. Review market daily after Day 10`,
  last_updated: new Date().toLocaleTimeString(),
  confidence_flags: {
    ai_model: true,
    valid_data: true,
    extreme_values: false,
  },
};

export const mockPriceForecast: PriceForecast = {
  forecast: Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    price: Math.round(2200 + 120 * Math.sin(i / 5) + i * 8 + (Math.random() - 0.5) * 40),
  })),
  best_day: 14,
  best_price: 2450,
  trend: "upward",
};
