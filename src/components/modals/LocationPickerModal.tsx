"use client";

import { useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import Button from "@/components/common/Button";
import { LocationPickerField } from "@/components/ui/location-picker-field";
import { useTranslation } from "react-i18next";

const DEFAULT_CENTER = { lat: 51.1657, lng: 10.4515 };
const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "420px",
  minHeight: "420px",
};

export type PickedLocation = {
  display: string;
  lat: number;
  lng: number;
  city?: string;
};

type LocationPickerModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (location: PickedLocation) => void;
  initialValue?: PickedLocation | null;
};

async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ display: string; city?: string }> {
  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const formatted =
          results[0].formatted_address ??
          `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        const components = (results[0] as any).address_components as
          | { long_name: string; short_name: string; types: string[] }[]
          | undefined;
        const cityComponent = components?.find(
          (c) =>
            c.types.includes("locality") ||
            c.types.includes("postal_town") ||
            c.types.includes("administrative_area_level_1")
        );
        const city = cityComponent?.long_name;
        resolve({ display: formatted, city });
      } else {
        resolve({ display: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
      }
    });
  });
}

export function LocationPickerModal({
  open,
  onClose,
  onSave,
  initialValue,
}: LocationPickerModalProps) {
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [display, setDisplay] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("wishlist");
  useEffect(() => {
    if (
      open &&
      initialValue?.display &&
      initialValue.lat != null &&
      initialValue.lng != null
    ) {
      setSelected({ lat: initialValue.lat, lng: initialValue.lng });
      setDisplay(initialValue.display);
      setCity(initialValue.city ?? "");
    } else if (!open) {
      setSelected(null);
      setDisplay("");
      setCity("");
    }
  }, [
    open,
    initialValue?.display,
    initialValue?.lat,
    initialValue?.lng,
    initialValue?.city,
  ]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat == null || lng == null) return;
    setSelected({ lat, lng });
    setLoading(true);
    try {
      const { display: addr, city } = await reverseGeocode(lat, lng);
      setDisplay(addr);
      setCity(city ?? "");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (selected && display) {
      onSave({ display, lat: selected.lat, lng: selected.lng, city });
    }
    setSelected(null);
    setDisplay("");
    setCity("");
    onClose();
  }, [selected, display, city, onSave, onClose]);

  const handleCancel = useCallback(() => {
    setSelected(null);
    setDisplay("");
    onClose();
  }, [onClose]);

  const canSave = selected != null && display.length > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[800px] w-[95%] gap-5 max-h-[90vh] p-6 rounded-[32px] overflow-hidden flex flex-col bg-[linear-gradient(180deg,#FAFAFC_0%,#F5F5F5_80.54%)]"
      >
        <div className="text-center border-b border-[#ECECED] pb-6 relative shrink-0">
          <h3 className="text-xl font-medium text-black">
            {t("selectLocation")}
          </h3>
        </div>

        <div className="px-6 space-y-4 flex-1 overflow-y-auto min-h-0">
          {apiKey && (
            <LocationPickerField
              apiKey={apiKey}
              value={display}
              onSelect={(loc) => {
                setSelected({ lat: loc.lat, lng: loc.lng });
                setDisplay(loc.display);
                setCity(loc.city ?? "");
              }}
              placeholder={t("searchLocationOrClickOnMapBelow")}
            />
          )}
          {!apiKey && (
            <div className="h-[320px] flex items-center justify-center bg-gray-100 rounded-xl text-center text-sm text-gray-600">
              {t("googleMapsApiKeyIsMissing")}
            </div>
          )}
          {apiKey && loadError && (
            <div className="h-[320px] flex items-center justify-center bg-gray-100 rounded-xl text-center text-sm text-red-600">
              {t("errorLoadingMap")}
            </div>
          )}
          {apiKey && !isLoaded && (
            <div className="h-[320px] flex items-center justify-center bg-gray-100 rounded-xl">
              {t("loadingMap")}
            </div>
          )}
          {apiKey && isLoaded && (
            <div className="rounded-xl overflow-hidden border border-[#E5E7EB]">
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={selected ?? DEFAULT_CENTER}
                zoom={selected ? 12 : 4}
                onClick={handleMapClick}
                options={{
                  mapTypeControl: true,
                  fullscreenControl: true,
                  disableDefaultUI: true,
                }}
              >
                {selected && (
                  <Marker
                    position={{ lat: selected.lat, lng: selected.lng }}
                    animation={google.maps.Animation.DROP}
                  />
                )}
              </GoogleMap>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 flex-row gap-2 border-t border-[#E5E7EB]">
          <Button
            type="button"
            onClick={handleCancel}
            className="bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-50"
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!canSave || loading}
          >
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
