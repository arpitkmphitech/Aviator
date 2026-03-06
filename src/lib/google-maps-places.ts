const SCRIPT_ID = "google-maps-places-script";

let loadPromise: Promise<void> | null = null;

export function loadGoogleMapsPlaces(apiKey: string): Promise<void> {
  if (typeof window === "undefined")
    return Promise.reject(new Error("Window undefined"));
  if (window.google?.maps?.places) return Promise.resolve();
  if (loadPromise) return loadPromise;

  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    loadPromise = new Promise((resolve) => {
      if (window.google?.maps?.places) {
        resolve();
        return;
      }
      const check = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
    return loadPromise;
  }

  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key is not configured"));
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Google Maps script"));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          PlacesServiceStatus: { OK: string };
          AutocompleteService: new () => {
            getPlacePredictions: (
              request: {
                input: string;
                componentRestrictions?: { country: string[] };
              },
              callback: (
                results: PlacePredictionGoogle[] | null,
                status: string
              ) => void
            ) => void;
          };
          PlacesService: new (div: HTMLDivElement) => {
            getDetails: (
              request: { placeId: string; fields: string[] },
              callback: (place: unknown, status: string) => void
            ) => void;
          };
        };
      };
    };
  }
}

export interface PlacePredictionGoogle {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}
