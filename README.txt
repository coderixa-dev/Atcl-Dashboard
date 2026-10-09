ATCL CORPORATE B2B ADMIN — STATIC PROTOTYPE

Open index.html directly in a browser. No server, package installation, build
step, API or internet connection is required. Review at 100% browser zoom.

Architecture
- Every HTML file contains its own sidebar, topbar, primary content and data.
- Local Bootstrap 5.3.3 CSS supplies the form/component foundation.
- assets/css/admin.css owns the custom visual design and responsive layout.
- assets/js/admin.js progressively enhances existing HTML. It only creates
  interaction controls (pagination buttons/filter chips), never primary content.
- Without JavaScript, every static table row and form remains available.

Preview boundaries
- Dashboard metrics deliberately retain the approved reference values. Module
  summaries reflect the smaller authored static datasets.
- Detail and edit links open a representative, fixed HTML record. They do not
  dynamically load the clicked row. That binding belongs to the Blade phase.
- Form saves, drafts, delete and bulk actions provide honest preview feedback;
  no data is persisted. Inquiry status controls update only the current DOM.
- Global search is presentation-only. Table-level search and combined filters
  are functional. The dashboard date is a visual preview control.
- All contact identities and example-domain email addresses are fictional.
- Product illustrations and reference imagery are representative; they do not
  certify an exact manufacturer/model. Brand wordmarks are typeset stand-ins.
- The brochure area includes a downloadable text specification preview; a final
  manufacturer PDF can be uploaded through the static form in the next phase.

Data volumes
Products: 60
Categories: 20
Subcategories: 40
Child Categories: 50
Brands: 24
Inquiries: 48
Contact Messages: 36
News / Events: 24
Career Posts: 18
Dashboard: 8 recent inquiries, 6 recent activities

Assets
15 original technical product SVG illustrations; 1 licensed valve photograph.
24 locally typeset brand-name SVG assets (not official manufacturer logos).
3 local Unsplash photographs for news/events.
1 original administrator avatar and 1 original favicon.
See assets/images/SOURCES.txt for image credits and source/license links.

Laravel conversion (future, not implemented)
Extract the repeated shell into a layout and sidebar/topbar partials. Replace
literal values with escaped Blade variables and table rows with @foreach.
Keep the current row data-* attributes for frontend filtering, or replace the
client-side table controls with server-side pagination once data volume grows.
Wire forms with CSRF, validation, authorization and actual upload handling only
in the backend phase. No Laravel, PHP, database or API is present now.

Verification
verification/results.json records the Chrome browser checks at scale 1.
verification/ includes dashboard screenshots at 1672, 1366 and 390px plus a
products screenshot. Browser checks include all 28 pages at 1366/1024/768/390px,
the dashboard at all eight requested viewports, table interactions and all
pages with script execution disabled. No commits or pushes were performed.

To repeat verification (optional developer tooling only):
1. Run Chrome headless with --remote-debugging-port=9223 and an isolated
   --user-data-dir.
2. Run node admin-ui/verification/check.cjs (Node 22 or later).
This is not needed to open or use the prototype.
