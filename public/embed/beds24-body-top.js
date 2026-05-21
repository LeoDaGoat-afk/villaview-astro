/* VILLA VIEW — Beds24 body-top injection.
 *
 * Intentionally a no-op as of 2026-05-21.
 *
 * Beds24's native booking2.php UI (hero photo carousel + date/guest fbar +
 * room card + booking flow + payment) is rendering well for a single-villa
 * vacation rental. Brand chrome (site header + nav) is now provided by the
 * Astro Layout wrapping the iframe at villaokinawa.com/booking, not by
 * injecting into the iframe.
 *
 * Kept as a stub so the Beds24 admin script tag at
 *   Booking Engine → Property Booking Page → Developer → Body Top
 * stays valid. To re-enable in-iframe brand UI later (header, footer,
 * cancel policy, license number, etc.), edit this file and redeploy — no
 * Beds24 admin change needed.
 */
