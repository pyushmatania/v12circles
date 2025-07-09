# Project Catalogue App

A full-stack application for managing and displaying a catalogue of film, music, and webseries projects, with rich metadata, images, YouTube trailers, and community-centric data.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Data Format & Field Documentation](#data-format--field-documentation)
3. [Data Sources & Mocking](#data-sources--mocking)
4. [API Keys Setup](#api-keys-setup)
5. [Backend API](#backend-api)
6. [Frontend Usage](#frontend-usage)
7. [How to Add or Replace Projects](#how-to-add-or-replace-projects)
8. [Community Data (enterCircle)](#community-data-entercircle)
9. [Extending the Data Model](#extending-the-data-model)
10. [Development & Deployment](#development--deployment)
11. [FAQ](#faq)

---

## Project Structure

```
/omdb-fetcher
  ├── projects.json                    # Main data file (array of project objects)
  ├── index.js                         # Express backend serving /api/projects
  ├── generateEnterCircleData.js       # Enrichment script (OMDb + YouTube + Mock)
  ├── addOrReplaceProjects.js          # Script to add/replace projects
  └── src/
      ├── App.tsx                      # Main React app entry
      ├── components/
      │   └── ProjectList.tsx          # React component to display projects
      └── types/
          └── Project.ts               # TypeScript interface for Project
```

---

## Data Format & Field Documentation

All project data is stored in `projects.json` as an array of objects.  
Each object matches the following TypeScript interface (see `src/types/Project.ts`):

```ts
export interface Project {
  id: string;                // Unique project identifier (string, required)
  title: string;             // Project title (string, required)
  type: 'film' | 'music' | 'webseries'; // Project type/category (enum, required)
  category: string;          // Main category (e.g., Bollywood, Hollywood, Regional) (string, required)
  status: string;            // Project status (e.g., 'active') (string, required, usually mocked)
  fundedPercentage: number;  // % of funding achieved (number, required, mocked)
  targetAmount: number;      // Target funding amount in INR (number, required, mocked)
  raisedAmount: number;      // Amount raised so far in INR (number, required, mocked)
  createdAt: string;         // ISO date string for creation (string, required, mocked)
  updatedAt: string;         // ISO date string for last update (string, required, mocked)
  poster: string;            // Poster image URL (string, required, fetched from OMDb or fallback)
  description: string;       // Short project description (string, required, fetched or mocked)
  director?: string;         // Director's name (string, optional, fetched or mocked)
  genre: string;             // Genre (e.g., Action, Drama) (string, required, fetched or mocked)
  tags: string[];            // List of tags/keywords (array of strings, required, fetched or mocked)
  perks: string[];           // List of perks for investors (array of strings, required, mocked)
  rating?: number;           // Project rating (1-5 scale, number, optional, fetched or mocked)
  trailer?: string;          // Trailer video URL (YouTube, string, optional, fetched from YouTube API)
  keyCommunityData: Array<{  // Community data for grouping/filtering
    id: string;
    movieId: string;
    movieName: string;
    productionHouse: string;
    keyPeople: string[];
    actor: string;
    actress: string;
    director: string;
  }>;
}
```

### Example Project Object

```json
{
  "id": "1",
  "title": "Sholay",
  "type": "film",
  "category": "Hollywood",
  "status": "active",
  "fundedPercentage": 77,
  "targetAmount": 4000000,
  "raisedAmount": 3100000,
  "createdAt": "2025-07-07T08:56:18.142Z",
  "updatedAt": "2025-07-07T08:56:18.142Z",
  "poster": "https://via.placeholder.com/300x450/cccccc/666666?text=Movie+Poster",
  "description": "A compelling film that explores themes of love, life, and human connection.",
  "director": "Ramesh Sippy",
  "genre": "Drama, Action",
  "tags": ["Action", "Adventure", "Comedy"],
  "perks": ["Behind-the-scenes", "Signed Poster", "Premiere Invite"],
  "rating": 4.5,
  "trailer": "https://www.youtube.com/watch?v=fefaxq2nXoE",
  "keyCommunityData": [
    {
      "id": "kc_1",
      "movieId": "1",
      "movieName": "Sholay",
      "productionHouse": "",
      "keyPeople": [],
      "actor": "",
      "actress": "",
      "director": "Ramesh Sippy"
    }
  ]
}
```

---

## Data Sources & Mocking

- **id**: Generated sequentially or uniquely for each project (mocked).
- **title**: Real project/movie/webseries title (real, from input list).
- **type**: Real, from input list (`film`, `music`, or `webseries`).
- **category**: Mocked or set based on type (e.g., 'Hollywood', 'Bollywood').
- **status**: Mocked (e.g., 'active').
- **fundedPercentage, targetAmount, raisedAmount**: Mocked for demo/fake funding data.
- **createdAt, updatedAt**: Mocked ISO date strings.
- **poster**: Fetched from OMDb API (real, if available), otherwise fallback placeholder.
- **description, director, genre, tags, rating**: Fetched from OMDb if available, otherwise mocked.
- **perks**: Mocked (e.g., 'Behind-the-scenes', 'Signed Poster').
- **trailer**: Fetched from YouTube Data API (real, if available), otherwise fallback search URL.
- **keyCommunityData**: Generated from OMDb data or mocked for community features.

**Note:**  
If OMDb or YouTube data is missing, fields are filled with reasonable fallback values for demo purposes.

---

## API Keys Setup

### Required API Keys

To get real data (posters, descriptions, trailers), you need to set up API keys:

#### 1. OMDb API Key (for posters, descriptions, metadata)

1. **Get a free API key:**
   - Visit: http://www.omdbapi.com/apikey.aspx
   - Sign up for a free account
   - You'll get 1000 requests per day free

2. **Set the API key:**
   ```bash
   # On Windows (PowerShell)
   $env:OMDB_API_KEY="your_omdb_api_key_here"
   
   # On macOS/Linux
   export OMDB_API_KEY="your_omdb_api_key_here"
   ```

#### 2. YouTube Data API Key (for trailers)

1. **Get a free API key:**
   - Go to: https://console.cloud.google.com/
   - Create a new project or select existing
   - Enable YouTube Data API v3
   - Create credentials (API key)
   - You get 10,000 requests per day free

2. **Set the API key:**
   ```bash
   # On Windows (PowerShell)
   $env:YOUTUBE_API_KEY="your_youtube_api_key_here"
   
   # On macOS/Linux
   export YOUTUBE_API_KEY="your_youtube_api_key_here"
   ```

### Using API Keys

Once set, run the enrichment script:
```bash
node generateEnterCircleData.js
```

The script will:
- ✅ Fetch real posters from OMDb
- ✅ Fetch real descriptions and metadata from OMDb  
- ✅ Fetch real trailer URLs from YouTube
- ⚠️ Use fallback data if APIs are unavailable

### Fallback Behavior

If API keys are not set or invalid:
- **Posters**: Placeholder images (`https://via.placeholder.com/...`)
- **Descriptions**: Generic descriptions based on project type
- **Trailers**: YouTube search URLs (`https://www.youtube.com/results?search_query=...`)
- **Ratings**: Random realistic ratings (3.0-5.0)

---

## Backend API

- **File:** `index.js`
- **Endpoint:** `GET /api/projects`
- **Description:** Serves the contents of `projects.json` as an array of project objects.

### How it works

- Reads `projects.json` and returns the data as JSON.
- CORS is enabled for frontend access.
- To update the data, run the enrichment script or manually edit `projects.json`.

---

## Frontend Usage

- **TypeScript type:** `src/types/Project.ts`
- **Component:** `src/components/ProjectList.tsx`
- **Main App:** `src/App.tsx`

### How to Display the Catalogue

```tsx
import React from 'react';
import { ProjectList } from './components/ProjectList';

function App() {
  return (
    <div>
      <h1>Project Catalogue</h1>
      <ProjectList />
    </div>
  );
}

export default App;
```

### ProjectList Component

- Fetches `/api/projects` on mount.
- Displays each project in a card with poster, title, genre, director, description, tags, funding info, and a trailer button if available.

---

## How to Add or Replace Projects

### Method 1: Using addOrReplaceProjects.js (Recommended)

1. **Edit the script:**
   ```js
   // In addOrReplaceProjects.js
   const titles = [
     "New Movie 1",
     "New Movie 2",
     // ... add your titles
   ];
   const addMode = true; // true to add, false to replace
   ```

2. **Run the script:**
   ```bash
   node addOrReplaceProjects.js
   ```

3. **Enrich the data:**
   ```bash
   node generateEnterCircleData.js
   ```

### Method 2: Manual JSON Editing

1. **To add more projects:**
   - Open `projects.json`.
   - Add new objects to the array, following the documented schema.
   - Run the enrichment script to fill in missing data.

2. **To replace all projects:**
   - Overwrite the array in `projects.json` with your new set of project objects.
   - Run the enrichment script.

### Method 3: Direct API Integration

- Use a script or manually fetch from OMDb (for posters/metadata) and YouTube (for trailers).
- Fill in missing fields with mock data as needed.

---

## Community Data (enterCircle)

### What is enterCircle?

`enterCircle` is a community-centric data model and script for generating project data enriched with key people and production information. This enables community features based on film, production house, director, actor, or actress.

### How it Works

- **Script:** `generateEnterCircleData.js`
  - Reads from `projects.json`.
  - Fetches real data for `actor`, `actress`, `productionHouse`, and `keyPeople` from OMDb API.
  - Fetches real trailer URLs from YouTube Data API.
  - Randomizes mock fields (`fundedPercentage`, `targetAmount`, `raisedAmount`) if `mockMode` is set to `true`.
  - Updates `projects.json` with enriched data.
  - Can be imported and called from other Node.js projects.

### Usage

1. Set your API keys (see [API Keys Setup](#api-keys-setup)):
   ```sh
   export OMDB_API_KEY=your_omdb_api_key
   export YOUTUBE_API_KEY=AIzaSyAn5g5nxNOE_2g-QXTgtJfnE0vTzyy6R0U
   ```

2. Run the enrichment script:
   ```sh
   node generateEnterCircleData.js
   ```

3. Use `projects.json` as your data source for community features.

4. To control mock data, set `mockMode` at the top of the script.

### Field Sources

| Field             | Source         | Notes                                  |
|-------------------|---------------|----------------------------------------|
| poster            | OMDb API      | Real poster URL if available           |
| description      | OMDb API      | Real plot/description if available     |
| director         | OMDb API      | Real director if available             |
| genre            | OMDb API      | Real genre if available                |
| rating           | OMDb API      | Real IMDb rating if available          |
| trailer          | YouTube API   | Real trailer URL if available          |
| actor            | OMDb API      | Fetched, not mocked                    |
| actress          | OMDb API      | Fetched, not mocked                    |
| productionHouse  | OMDb API      | Fetched, not mocked                    |
| keyPeople        | OMDb API      | Fetched, not mocked (all actors)       |
| fundedPercentage | Mocked        | Randomized if mockMode=true            |
| targetAmount     | Mocked        | Randomized if mockMode=true            |
| raisedAmount     | Mocked        | Randomized if mockMode=true            |
| ...others        | See schema    | See `src/types/Project.ts`             |

### Integration in Other Projects

- Import and call `generateEnterCircleData` from `generateEnterCircleData.js` in any Node.js project to generate or refresh your community data.
- Use `projects.json` as a seed for community, filtering, or grouping features.

---

## Extending the Data Model

- To add new fields, update the `Project` interface in `src/types/Project.ts`.
- Add the new fields to each object in `projects.json`.
- Update the frontend components to display the new fields as needed.

---

## Development & Deployment

### Local Development

1. **Start the backend:**
   ```sh
   node index.js
   ```

2. **Start the frontend:**
   ```sh
   npm start
   ```
   (from your React app directory)

### Deployment

- Deploy the backend (Node.js/Express) to your server or cloud provider.
- Deploy the frontend (React) to your static hosting or cloud provider.
- Update the API URL in the frontend if needed.

---

## FAQ

**Q: How do I get real posters and trailers for new projects?**  
A: Set up OMDb and YouTube API keys (see [API Keys Setup](#api-keys-setup)), then run `node generateEnterCircleData.js`.

**Q: What if I don't have API keys?**  
A: The system will use fallback data (placeholder images, generic descriptions, YouTube search URLs).

**Q: Can I use this for real crowdfunding?**  
A: The funding fields are mocked for demo. Integrate with a real payment/funding backend for production use.

**Q: How do I add new fields?**  
A: Update the `Project` interface, the data in `projects.json`, and the frontend display logic.

**Q: What if a field is missing?**  
A: The frontend is resilient to missing optional fields, but for best results, fill all required fields.

**Q: How do I add new projects quickly?**  
A: Use `addOrReplaceProjects.js` - just edit the titles array and run the script.

---

## Comments on Each Data Field

| Field            | Source         | Required | Notes                                                                 |
|------------------|---------------|----------|-----------------------------------------------------------------------|
| id               | Mocked/Script | Yes      | Unique string, can be sequential or UUID                              |
| title            | Real/Input    | Yes      | Project/movie/webseries title                                         |
| type             | Real/Input    | Yes      | 'film', 'music', or 'webseries'                                       |
| category         | Mocked/Script | Yes      | E.g., 'Bollywood', 'Hollywood', 'Regional'                            |
| status           | Mocked        | Yes      | E.g., 'active'                                                        |
| fundedPercentage | Mocked        | Yes      | Random or demo value                                                  |
| targetAmount     | Mocked        | Yes      | Demo INR value                                                        |
| raisedAmount     | Mocked        | Yes      | Demo INR value                                                        |
| createdAt        | Mocked        | Yes      | ISO date string                                                       |
| updatedAt        | Mocked        | Yes      | ISO date string                                                       |
| poster           | OMDb API      | Yes      | Real poster URL if available, else fallback                           |
| description      | OMDb/Mocked   | Yes      | Real plot/description or fallback                                     |
| director         | OMDb/Mocked   | No       | Real director or fallback                                             |
| genre            | OMDb/Mocked   | Yes      | Real genre or fallback                                                |
| tags             | OMDb/Mocked   | Yes      | Real tags/keywords or fallback                                        |
| perks            | Mocked        | Yes      | Demo perks for investors                                              |
| rating           | OMDb/Mocked   | No       | Real IMDb rating (1-5 scale) or fallback                              |
| trailer          | YouTube API   | No       | Real YouTube trailer URL if available                                 |
| keyCommunityData | Generated     | Yes      | Community data for grouping/filtering                                 |

---

**For any further questions or to extend the app, see the code comments and this README.  
Happy building!**

## Data File

- **projects.json** is now the single source of truth.
- All enrichment (including OMDb data, mock fields, and community data) is performed in-place.
- There is no separate enterCircleProjects.json file anymore.

## Enrichment & Community Data

- Each project includes:
  - All original fields (id, title, type, etc.)
  - Enriched fields (actor, actress, productionHouse, keyPeople, director, human-readable fundraising numbers)
  - **keyCommunityData**: an array (currently with one object) containing:
    - `id`: unique key for the community data entry (e.g., "kc_1")
    - `movieId`: the project/movie id
    - `movieName`: the project/movie title
    - `productionHouse`: fetched or blank
    - `keyPeople`: array of key people (actors, etc.)
    - `actor`: main actor
    - `actress`: main actress
    - `director`: director name

## Usage

- Edit or add projects in `projects.json`.
- Run `node generateEnterCircleData.js` to enrich the data and update all fields.
- Your backend API (`index.js`) will serve from this file.
- Your frontend and community features can use the new `keyCommunityData` array for grouping, filtering, or analytics.

## Example keyCommunityData

```json
"keyCommunityData": [
  {
    "id": "kc_1",
    "movieId": "1",
    "movieName": "Sholay",
    "productionHouse": "Sippy Films",
    "keyPeople": ["Amitabh Bachchan", "Dharmendra", ...],
    "actor": "Amitabh Bachchan",
    "actress": "Hema Malini",
    "director": "Ramesh Sippy"
  }
]
```

## Cleaned Up

- All unused files and folders related to old enrichment or mock data have been removed.
- Only `projects.json` and the enrichment script remain.

---

For more details on the data model, see `src/types/Project.ts`. 

## Enrichment Script Usage

### Environment Variables
- `OMDB_API_KEY`: Your OMDb API key
- `YOUTUBE_API_KEY`: Your YouTube Data API v3 key
- `MOCK_MODE`: Set to `true` to use mock/fallback data (default: false)

### CLI Options
- `--mock` or `-m`: Enable mock mode (overrides env)
- `--batchSize` or `-b`: Batch size for API requests (default: 10)
- `--throttleMs` or `-t`: Throttle (ms) between batches (default: 1000)

### Poster Validation
- The script validates poster URLs (HEAD request). Projects with missing, placeholder, or broken posters are marked as `"disabled": true`.

### Logging
- The script logs how many projects were enriched with real data vs fallback data, and how many were disabled.

## Enrichment Script Optimization

- The enrichment script is optimized to only call the OMDb and YouTube APIs for projects that are missing data or have fallback/default values (e.g., missing poster, description, director, genre, rating, or trailer).
- If a project already has a valid poster, description, director, genre, rating, or trailer, the script will skip the API call for that field and retain the existing value.
- This approach saves API quota, speeds up enrichment, and avoids unnecessary requests.

## Project Management Script
- Use `addOrReplaceProjects.js` with `--titlesFile` to read titles from a file (format: `<type>|<category>|<title>` per line).
- Type/category are inferred from the input or defaulted.

## API Server
- GET `/api/projects?enabledOnly=true&title=search` to filter projects.
- POST `/api/projects` to add a project (JSON body, must include `title` and `type`).
- PUT `/api/projects/:id` to update a project.
- Handles malformed `projects.json` gracefully.

## Frontend
- Disabled projects are filtered out or visually marked.
- Error and loading states are handled.

## Project Type Fields
- See `src/types/Project.ts` for all fields, including:
  - `disabled`: boolean
  - `keyCommunityData`: array
  - `targetAmountHuman`, `raisedAmountHuman`, etc.

## Environment/Config Validation
- The enrichment script warns if API keys are missing or placeholders.
- See logs for summary and troubleshooting. 