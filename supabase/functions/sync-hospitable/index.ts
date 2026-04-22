/**
 * sync-hospitable — Supabase Edge Function
 *
 * Pulls reservations from the Hospitable API and upserts them into
 * the Supabase `reservations` table. Designed to be invoked:
 *   - Manually via curl / Supabase dashboard
 *   - On a cron schedule (pg_cron or external)
 *   - From Apps Script "Sync Hospitable" menu button
 *
 * Environment Variables (set via `supabase secrets set`):
 *   HOSPITABLE_PAT     — Hospitable Personal Access Token
 *   SUPABASE_URL       — Auto-provided by Supabase
 *   SUPABASE_SERVICE_ROLE_KEY — Auto-provided by Supabase
 *
 * Deploy:
 *   supabase functions deploy sync-hospitable --no-verify-jwt
 *
 * Invoke:
 *   curl -X POST https://vuhoqcmdmsgcpknbtpgv.supabase.co/functions/v1/sync-hospitable \
 *     -H "Authorization: Bearer <ANON_KEY>"
 *
 * Optional query params:
 *   ?days_back=1&days_ahead=30   (default: 1 day back, 30 days ahead)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Types ──────────────────────────────────────────────────────

interface HospitableReservation {
  id?: string;
  reservation_id?: string;
  guest_name?: string;
  guest?: { name?: string; email?: string; phone?: string };
  guest_email?: string;
  guest_phone?: string;
  check_in?: string;
  checkin_date?: string;
  arrival_date?: string;
  check_out?: string;
  checkout_date?: string;
  departure_date?: string;
  check_in_time?: string;
  arrival_time?: string;
  check_out_time?: string;
  departure_time?: string;
  status?: string;
  number_of_guests?: number;
  guests?: number;
  adults?: number;
  children?: number;
  platform?: string;
  source?: string;
  channel?: string;
  listing_id?: string;
  property_id?: string;
  notes?: string;
  [key: string]: unknown;
}

interface SyncResult {
  upserted: number;
  skipped: number;
  errors: string[];
  total_fetched: number;
  duration_ms: number;
}

// ── Constants ──────────────────────────────────────────────────

const HOSPITABLE_BASE_URL = "https://hospitable.com/api/v2";
const MAX_PAGES = 10;
const PER_PAGE = 100;

// Valid source values for the reservations table CHECK constraint
const VALID_SOURCES = [
  "hospitable",
  "airbnb",
  "booking",
  "direct",
  "agoda",
  "vrbo",
];

// ── Main Handler ───────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  const startTime = Date.now();

  try {
    // ── Auth: Get secrets ────────────────────────────────────
    const hospPat = Deno.env.get("HOSPITABLE_PAT");
    if (!hospPat) {
      return jsonResponse(
        { error: "HOSPITABLE_PAT secret not configured" },
        500
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // ── Parse optional date range params ─────────────────────
    const url = new URL(req.url);
    const daysBack = parseInt(url.searchParams.get("days_back") || "1");
    const daysAhead = parseInt(url.searchParams.get("days_ahead") || "30");

    const today = new Date();
    const fromDate = formatDate(addDays(today, -daysBack));
    const toDate = formatDate(addDays(today, daysAhead));

    console.log(`Syncing reservations from ${fromDate} to ${toDate}`);

    // ── Init Supabase client (service role for writes) ───────
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // ── Load property mapping (hospitable_listing_id → UUID) ─
    const propertyMap = await loadPropertyMap(supabase);
    console.log(
      `Loaded ${Object.keys(propertyMap).length} property mappings`
    );

    // ── Fetch reservations from Hospitable API ───────────────
    const reservations = await fetchAllReservations(hospPat, fromDate, toDate);
    console.log(`Fetched ${reservations.length} reservations from Hospitable`);

    // ── Upsert into Supabase ─────────────────────────────────
    const result = await upsertReservations(
      supabase,
      reservations,
      propertyMap
    );
    result.duration_ms = Date.now() - startTime;

    console.log(
      `Sync complete: ${result.upserted} upserted, ${result.skipped} skipped, ${result.errors.length} errors`
    );

    return jsonResponse({
      status: "ok",
      ...result,
      date_range: { from: fromDate, to: toDate },
    });
  } catch (err) {
    console.error("Sync failed:", err);
    return jsonResponse(
      {
        status: "error",
        error: err instanceof Error ? err.message : String(err),
        duration_ms: Date.now() - startTime,
      },
      500
    );
  }
});

// ── Hospitable API ─────────────────────────────────────────────

async function fetchAllReservations(
  pat: string,
  fromDate: string,
  toDate: string
): Promise<HospitableReservation[]> {
  const allReservations: HospitableReservation[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= MAX_PAGES) {
    const url = `${HOSPITABLE_BASE_URL}/reservations?arrival_date_from=${fromDate}&departure_date_to=${toDate}&page=${page}&per_page=${PER_PAGE}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Hospitable API returned ${response.status}: ${body.substring(0, 200)}`
      );
    }

    const json = await response.json();

    // Handle flexible response shape
    const reservations: HospitableReservation[] =
      json.data || json.reservations || json.results || (Array.isArray(json) ? json : []);

    allReservations.push(...reservations);

    // Check pagination
    const meta = json.meta || json.pagination || {};
    const lastPage = meta.last_page || meta.total_pages || 1;
    hasMore = page < lastPage;
    page++;
  }

  return allReservations;
}

// ── Property Mapping ───────────────────────────────────────────

async function loadPropertyMap(
  supabase: ReturnType<typeof createClient>
): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("properties")
    .select("id, hospitable_listing_id, property_reference")
    .not("hospitable_listing_id", "is", null);

  if (error) {
    console.warn("Failed to load property map:", error.message);
    return {};
  }

  const map: Record<string, string> = {};
  for (const prop of data || []) {
    if (prop.hospitable_listing_id) {
      map[prop.hospitable_listing_id] = prop.id;
    }
  }

  return map;
}

// ── Upsert Logic ───────────────────────────────────────────────

async function upsertReservations(
  supabase: ReturnType<typeof createClient>,
  reservations: HospitableReservation[],
  propertyMap: Record<string, string>
): Promise<SyncResult> {
  const result: SyncResult = {
    upserted: 0,
    skipped: 0,
    errors: [],
    total_fetched: reservations.length,
    duration_ms: 0,
  };

  for (const res of reservations) {
    try {
      // Extract external ID for dedup
      const externalId = String(res.id || res.reservation_id || "");
      if (!externalId) {
        result.skipped++;
        result.errors.push("Reservation missing ID — skipped");
        continue;
      }

      // Map listing to property
      const listingId = String(res.listing_id || res.property_id || "");
      const propertyId = listingId ? propertyMap[listingId] : null;

      if (!propertyId) {
        result.skipped++;
        result.errors.push(
          `No property mapping for listing_id=${listingId} (reservation ${externalId})`
        );
        continue;
      }

      // Extract fields with fallbacks
      const guestName =
        res.guest_name || res.guest?.name || "Unknown Guest";
      const guestEmail = res.guest_email || res.guest?.email || null;
      const guestPhone = res.guest_phone || res.guest?.phone || null;
      const checkInDate =
        res.check_in || res.checkin_date || res.arrival_date || null;
      const checkOutDate =
        res.check_out || res.checkout_date || res.departure_date || null;
      const checkInTime =
        res.check_in_time || res.arrival_time || null;
      const checkOutTime =
        res.check_out_time || res.departure_time || null;

      if (!checkInDate || !checkOutDate) {
        result.skipped++;
        result.errors.push(
          `Reservation ${externalId} missing check-in/out dates`
        );
        continue;
      }

      // Determine source (validate against CHECK constraint)
      const rawSource = (
        res.platform ||
        res.source ||
        res.channel ||
        "hospitable"
      ).toLowerCase();
      const source = VALID_SOURCES.includes(rawSource)
        ? rawSource
        : "hospitable";

      // Guest count
      const adults = res.adults || res.number_of_guests || res.guests || 1;
      const children = res.children || 0;

      // Map status
      const status = mapStatus(res.status);

      // Upsert on external_id
      const { error } = await supabase.from("reservations").upsert(
        {
          external_id: externalId,
          property_id: propertyId,
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          check_in_time: checkInTime,
          check_out_time: checkOutTime,
          status: status,
          adults: adults,
          children: children,
          source: source,
          platform_reservation_id:
            res.platform_reservation_id || null,
          notes: res.notes || null,
        },
        { onConflict: "external_id" }
      );

      if (error) {
        result.errors.push(
          `Upsert failed for ${externalId}: ${error.message}`
        );
        result.skipped++;
      } else {
        result.upserted++;
      }
    } catch (err) {
      result.errors.push(
        `Exception processing reservation: ${err instanceof Error ? err.message : String(err)}`
      );
      result.skipped++;
    }
  }

  return result;
}

// ── Helpers ────────────────────────────────────────────────────

function mapStatus(rawStatus?: string): string {
  if (!rawStatus) return "confirmed";
  const s = rawStatus.toLowerCase();
  if (s === "cancelled" || s === "canceled") return "cancelled";
  if (s === "checked_in" || s === "checkedin") return "checked_in";
  if (s === "checked_out" || s === "checkedout") return "checked_out";
  if (s === "no_show" || s === "noshow") return "no_show";
  return "confirmed";
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
