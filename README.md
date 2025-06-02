# ainews-hub
A dynamic Single Page Application (SPA) delivering the latest AI news and insights for my working company.

## SPA Routing with CloudFront and S3

```mermaid
flowchart TD
    A["User requests /dashboard"] --> B["CloudFront checks S3 for /dashboard"]
    B -- "404 or 403" --> C{"Error response rule"}
    C -- "Map to /index.html" --> D["/index.html served"]
    D --> E["SPA JS router handles /dashboard"]
```

- CloudFront is configured to map 404/403 errors to `/index.html`.
- This allows your SPA's router to handle deep links and browser refreshes for any route.
