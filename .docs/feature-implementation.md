# Feature implementation contract

Read this document and `AGENTS.md` before adding a feature. For frontend UI, also read `.docs/frontend-design-system.md` first.
For landing-page sections and composition, read `.docs/landing-page-cms.md` for the stable component key contract, caching, administration, and media audit.

## Trace an existing feature

Find the nearest working feature in `BackEnd/Domain`, `BackEnd/Application`, `BackEnd/Infrastructure`, `BackEnd/Api`, and `FrontEnd`. Preserve its response envelope, authentication rules, naming, media paths, validation, and admin behavior. Do not let API controllers query EF directly or put business rules into React components.

## Backend checklist

1. Define the entity and domain validation in `Domain/Entities`, and the repository contract in `Domain/Interfaces`. Keep state changes behind entity methods and preserve audit/soft delete behavior from `BaseEntity`.
2. Add an EF repository, `AppDbContext` DbSet, mapping (lengths, indexes, table name), and DI registration in `Infrastructure`. Generate and review a migration and model snapshot; make seeds deterministic and verify upgrades against existing rows.
3. Define request commands, queries, and DTOs in `Application`. Implement command handlers for mutations and query handlers for reads. Paginated admin lists return `ListDto` including `ColumnsJson` and `ActionsJson` when `ByConfig` is requested. Public queries expose only active, nondeleted rows in stable order.
4. Expose routes in `Api/Controllers`: public reads may be anonymous; every admin mutation and admin read must enforce the project's admin roles. Check unauthorized, not found, validation, and upload failure paths. Use multipart `[FromForm]` with `IFormFile` for files; store only relative media paths, and keep old media until replacement succeeds.
5. Register the entity in `EntityConfigConfiguration` for the generic admin menu/list/form when that UI is appropriate. Match endpoint names and form field names to the controller and DTO exactly. Confirm that the generic form can submit the chosen types (especially file and checkbox fields).

## Frontend checklist

1. Put public API access in a server only `FrontEnd/lib` function. Render public content with server components where possible and set an explicit cache window/tag. Cache invalidation after admin changes should target the corresponding tag or public path; a timed refresh is the fallback.
2. Read `.docs/frontend-design-system.md`; use its semantic theme tokens and typography pipeline. Handle Persian and English content, RTL/LTR, responsive media, and missing or inactive content. Resolve stored images through `MediaImage` or `toMediaUrl`.
3. Verify an admin create/edit/active/delete cycle and public rendering in both locales. Run the backend build and relevant tests, frontend type check and build when dependencies are available. Include the generated migration with the implementation.

## Content features in this repository

`LandingFeatures` is a bilingual, ordered set of home page blocks. It uses one image per block for mobile and desktop, optional link text and URL, and a 60 second server fetch cache. `AboutSections` supplies story page text and optional images for hero, chapters, and closing tiles; missing images use bundled assets. Successful admin mutations through the authenticated BFF invalidate the corresponding storefront paths and fetch tags; the 60 second interval remains the fallback.
