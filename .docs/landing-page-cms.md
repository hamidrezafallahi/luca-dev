# Landing page content and ordering

The home route (`FrontEnd/app/[locale]/page.tsx`) renders approved sections on the server. The `hero` section is required and remains first. Other persisted keys are `products`, `homeSlider`, `categories`, `features`, `specialOffers`, `experience`, `usp`, `trust`, `blog`, `testimonials`, `faq`, and `contactBand`. These keys form a contract between the backend allowlist and the frontend registry. A database row never supplies a React import or executable component name. When introducing a section, add its stable key to both allowlists and add an idempotent seed without updating existing administrator order or visibility.

LandingExperience consists of a section heading and three fixed cards, `appointment`, `fitting`, and `contact`. Each has English and Persian title, body, and CTA label and destination. Images are optional; preserve the existing placeholder until a card image is supplied. Store image paths rather than uploaded bytes, with localized alternative text. A missing section hides it; a failed fetch falls back to the bundled translations. The server fetch and home route use a 60-second freshness fallback; authenticated administration invalidates the relevant fetch tags and localized home paths after successful changes. Page metadata and locale alternates belong to the home route, not the section entity.

The API exposes `GET /api/LandingExperiences/public` and authenticated `GET`, `POST`, `PUT`, and `DELETE /api/LandingExperiences`. Text mutations use JSON and allow partial card updates by fixed `cardKey`; `PUT /api/LandingExperiences/cards/{cardKey}/image` uses multipart fields `Image`, `MobileImage`, `RemoveImage`, and `RemoveMobileImage`. Authenticated `GET /api/LandingPageComponents` and public `GET /api/LandingPageComponents/public` return keys and order. `PUT /api/LandingPageComponents/order` accepts `{ "keys": [...], "visibility": { "key": true } }`, validating the complete approved set and applying it in one transaction; `PUT /api/LandingPageComponents/{key}/visibility` changes one eligible section. Administrator routes use the same roles as existing content management.

The ordering editor submits one complete ordering operation; the backend validates the approved key set and saves it atomically. The frontend uses an explicit key-to-component map and falls back to the previous static order if configuration cannot be fetched. Global layout, navigation, footer, admin dock, and JSON-LD are outside the registry. A newly introduced component should have an existing server-compatible renderer before its key is published. Check both locales, hidden optional sections, missing content, mobile layout, administrator typography and colors, and keyboard ordering.

Admin navigation exposes `/{locale}/admin/landingExperience` for bilingual content and image management and `/{locale}/admin/landingPageLayout` for drag and drop or button-based ordering. Changes remain local until Save; Discard restores fetched state. The layout editor sends order and visibility together. The experience editor saves text first, then uploads images per card; if an upload fails, the saved text remains and the error is shown for retry. Backend authorization is required on every administrative endpoint.

## Media storage audit (source and migrations)

The uploader writes uploaded image, video, and font files beneath `BackEnd/Api/wwwroot/uploads` and persists relative paths. `UploaderService` returns these paths; `Program.cs` serves static files. The EF model snapshot maps the following media references to text columns. A path field may also contain an external or bundled URL, depending on its feature.

| Entity | Fields | Snapshot column type | Classification |
| --- | --- | --- | --- |
| AboutSections | ImageUrl | varchar(300) | Filesystem or URL reference |
| AnnouncementBars | BackgroundImageUrl | varchar(300) | Filesystem or URL reference |
| Blogs | ThumbnailFile | varchar(500) | Filesystem reference |
| Brands | LogoUrl | varchar(300) | Filesystem or URL reference |
| Categories | ImageUrl | varchar(200) | Filesystem or URL reference |
| CustomFonts | FileUrl | varchar(300) | Filesystem reference |
| HomeSlides | ImageUrl, MobileImageUrl | varchar(300) | Filesystem or URL reference |
| LandingFeatures | ImageUrl | varchar(300) | Filesystem or URL reference |
| ProductImages | ImageUrl, OriginalUrl | varchar(500) | Filesystem reference |
| SeoSettings | OgImageUrl | varchar(1000) | Filesystem or external URL reference |
| Slides | BannerUrl, VideoUrl, MobileBannerUrl, MobileVideoUrl | varchar(200), varchar(300), text, text | Filesystem or URL reference |
| Users | Image | varchar(200) | Filesystem reference |
| EntityConfigs | EntityIconBase64 | text | Inline SVG markup in database (despite the property name) |

Evidence: `BackEnd/Infrastructure/Migrations/AppDbContextModelSnapshot.cs`, `BackEnd/Infrastructure/Services/UploaderServices/UploaderService.cs`, `BackEnd/Application/Common/UploadPaths.cs`, `BackEnd/Api/Program.cs`, and `BackEnd/Infrastructure/Persistence/Configurations/EntityConfigConfiguration.cs`. There is no persisted `bytea` or uploaded image/video Base64 payload in the inspected source and migrations. In-memory `byte[]` and token Base64 processing are not media persistence.

The development Compose file mounts a named volume for uploads. A production image creates the upload directory, but production volume persistence was not established from the inspected configuration. Full backup combines a PostgreSQL dump with an uploads tree (`PostgresBackupService`). Static uploads are public; image upload has no explicit byte or dimension limit in the traced code; video validation checks extension and size but not content signature. Filesystem writes and database changes are separate operations, and best-effort deletion may leave orphaned files. These are follow-up concerns, not a media migration. No live PostgreSQL schema or production deployment was inspected.
