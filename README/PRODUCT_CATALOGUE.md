# Product Catalogue Data Format & API Integration

## Overview
This document describes the data structure, metadata, and integration points for the product (project) catalogue in this app. It covers both mock data and real API usage, including YouTube trailer and poster image APIs.

---

## Data Format (Project)

| Field            | Type                | Required | Description                                                      |
|------------------|---------------------|----------|------------------------------------------------------------------|
| id               | string              | Yes      | Unique project identifier                                        |
| title            | string              | Yes      | Project title                                                    |
| type             | 'film'\|'music'\|'webseries' | Yes | Project type/category                                            |
| category         | string              | Yes      | Main category (e.g., Bollywood, Hollywood, Regional, etc.)       |
| language         | string              | Yes      | Language of the project                                          |
| poster           | string (URL)        | Yes      | Poster image URL                                                 |
| fundedPercentage | number              | Yes      | % of funding achieved                                            |
| targetAmount     | number              | Yes      | Target funding amount (in INR)                                   |
| raisedAmount     | number              | Yes      | Amount raised so far (in INR)                                    |
| timeLeft         | string (optional)   | No       | Time left for funding (e.g., '12 days')                          |
| tags             | string[]            | Yes      | List of tags/keywords                                            |
| description      | string              | Yes      | Short project description                                        |
| director         | string (optional)   | No       | Director's name (for films)                                      |
| artist           | string (optional)   | No       | Artist's name (for music)                                        |
| genre            | string              | Yes      | Genre (e.g., Action, Drama, etc.)                                |
| perks            | string[]            | Yes      | List of perks for investors                                      |
| rating           | number (optional)   | No       | Project rating (1-5 scale)                                       |
| investorCount    | number (optional)   | No       | Number of investors                                              |
| trailer          | string (optional)   | No       | Trailer video URL (YouTube)                                      |
| imageValidated   | boolean (optional)  | No       | Whether the image is validated                                   |
| imageSource      | string (optional)   | No       | Source of the image (e.g., 'verified')                           |

---

## Example Project Object
```json
{
  "id": "3",
  "title": "Brahmastra Part Two: Dev",
  "type": "film",
  "category": "Bollywood",
  "language": "Hindi",
  "poster": "https://m.media-amazon.com/images/M/MV5BN2I4ZWY2NGYtZWFkZS00N2Y4LWJkZWEtN2YzM2ZlYjcyZWJjXkEyXkFqcGdeQXVyMTI1NDEyNTM5._V1_FMjpg_UX1000_.jpg",
  "fundedPercentage": 78,
  "targetAmount": 25000000,
  "raisedAmount": 19500000,
  "timeLeft": "12 days",
  "tags": ["Fantasy", "VFX", "Mythology", "Ranbir Kapoor"],
  "description": "The second installment of the Astraverse mythology",
  "director": "Ayan Mukerji",
  "genre": "Fantasy Adventure",
  "perks": ["VFX Studio Tour", "Concept Art", "Digital Assets", "Premiere"],
  "rating": 4.7,
  "imageValidated": true,
  "imageSource": "verified",
  "trailer": "https://www.youtube.com/watch?v=example"
}
```

---

## API Integration

### 1. Fetching Real Project Data
- Replace the mock data import with an API call that returns an array of objects in the above format.
- Example endpoint: `GET /api/projects`
- Response: `[{...project}, {...project}, ...]`

### 2. YouTube Trailer API
- Each project can have a `trailer` field with a YouTube video URL.
- To fetch trailer data dynamically, use the [YouTube Data API v3](https://developers.google.com/youtube/v3/docs/search/list):
  - Endpoint: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=<project title> trailer&type=video&key=YOUR_API_KEY`
  - Use the first result's `videoId` to construct the trailer URL: `https://www.youtube.com/watch?v=<videoId>`
- Store the resulting URL in the `trailer` field for each project.

### 3. Poster Image API
- Poster images should be served from a CDN or image optimization service for best performance.
- Example: [TMDB API](https://developers.themoviedb.org/3/getting-started/images)
  - Endpoint: `https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=<project title>`
  - Use the `poster_path` from the first result and prepend with the TMDB image base URL (e.g., `https://image.tmdb.org/t/p/w500/<poster_path>`)
- Store the resulting URL in the `poster` field for each project.

---

## Feeding Real Data
- All required fields must be present; optional fields can be omitted or set to `null`/`undefined`.
- Validate that your backend or API returns data matching the `Project` interface.
- Images and trailers should be optimized for web and mobile.

---

## Notes
- The UI expects all fields to be present for best results, but will gracefully handle missing optional fields.
- For best performance, use `loading="lazy"` and serve images in modern formats (WebP, AVIF).
- See also: `src/types/index.ts` and `src/data/projects.ts` for more details. 