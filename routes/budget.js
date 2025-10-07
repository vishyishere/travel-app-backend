/**
 * budget.js
 * Simple demo backend route that accepts:
 *  { budget: number, category: string, location?: { place?: string, lat?: number, lng?: number } }
 *
 * If location.place is provided, we map known places to coordinates (Kochi example).
 * Real app should call a geocoding API here (Google Places / Mapbox) to resolve place -> coords.
 */

import express from "express";
const router = express.Router();

function placeToCoords(place) {
  if (!place) return null;
  const p = place.trim().toLowerCase();
  // Demo mapping - add more cities here
  if (p === "kochi" || p === "cochin") {
    return { lat: 9.9312, lng: 76.2673 };
  }
  // default: unknown
  return null;
}

router.post("/", (req, res) => {
  try {
    const { budget, category, location } = req.body || {};
    if (!budget || !category) return res.status(400).json({ error: "budget and category required" });

    // location may be { place } or { lat, lng }
    let coords = null;
    if (location) {
      if (location.lat != null && location.lng != null) {
        coords = { lat: Number(location.lat), lng: Number(location.lng) };
      } else if (location.place) {
        coords = placeToCoords(location.place);
      }
    }

    // For the demo: produce a single suggestion for movies (same as before)
    // In real implementation you'd query external APIs and compute travel cost based on coords.
    const suggestions = [];

    if (category === "movies") {
      // estimate: ticket + travel
      const ticket = 180;
      const travel = 70;
      const total = ticket + travel;
      suggestions.push({
        id: "movie_std",
        title: `Cinema — Standard Seat${coords ? " (" + (location?.place || `${coords.lat},${coords.lng}`) + ")" : ""}`,
        category: "movies",
        distanceKm: coords ? Math.round(Math.random() * 10 * 10) / 10 : undefined, // demo random distance
        breakdown: [{ label: "Ticket", amount: ticket }, { label: "Travel", amount: travel }],
        totalEstimate: total,
        overBudget: total > budget
      });
    } else {
      // fallback: a generic suggestion
      suggestions.push({
        id: "generic_1",
        title: `Spend in ${category} ${location?.place ? "in " + location.place : ""}`,
        category,
        breakdown: [{ label: "Misc", amount: Math.max(50, Math.round(budget * 0.6)) }],
        totalEstimate: Math.max(50, Math.round(budget * 0.6)),
        overBudget: Math.max(50, Math.round(budget * 0.6)) > budget
      });
    }

    return res.json({ budget, category, suggestions });
  } catch (err) {
    console.error("budget route error", err);
    return res.status(500).json({ error: "internal error" });
  }
});

export default router;
