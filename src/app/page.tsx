import LandingPage from "@/components/LandingPage";

// Swap this for a real fetch (Supabase, a CMS, your own API route, etc.)
// once you've got a services table wired up. Keeping it inline for now
// so the page renders without a backend dependency.
const services = [
  { id: "1", name: "Signature Cut", duration_minutes: 45, price: 850 },
  { id: "2", name: "Cut & Blow Dry", duration_minutes: 75, price: 1400 },
  { id: "3", name: "Balayage", duration_minutes: 180, price: 4500 },
  { id: "4", name: "Full Color", duration_minutes: 120, price: 3200 },
  { id: "5", name: "Root Touch-Up", duration_minutes: 60, price: 1800 },
  { id: "6", name: "Keratin Treatment", duration_minutes: 150, price: 5500 },
];

export default function Page() {
  return <LandingPage services={services} />;
}