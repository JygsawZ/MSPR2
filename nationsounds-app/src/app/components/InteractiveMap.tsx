"use client";
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression, Icon } from "leaflet";
import { Map as LeafletMap } from "leaflet";

import sceneIconData from "../../../public/assets/icons/scene.png";
import toilettesIconData from "../../../public/assets/icons/toilettes.png";
import restaurantIconData from "../../../public/assets/icons/restaurant.png";
import campingIconData from "../../../public/assets/icons/camping.png";

const sceneIconUrl = sceneIconData.src;
const toilettesIconUrl = toilettesIconData.src;
const restaurantIconUrl = restaurantIconData.src;
const campingIconUrl = campingIconData.src;

// Définition du type pour un Point d'Intérêt
interface PointOfInterest {
  id: number;
  name: string;
  position: LatLngExpression; // Type natif de Leaflet pour les coordonnées
  icon: Icon;
}

// Configuration des icônes personnalisées
const createIcon = (iconUrl: string): Icon =>
  new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

const sceneIcon = createIcon(sceneIconUrl);
const toilettesIcon = createIcon(toilettesIconUrl);
const restaurantIcon = createIcon(restaurantIconUrl);
const campingIcon = createIcon(campingIconUrl);

// Liste des points d'intérêt
const pointsOfInterest: PointOfInterest[] = [
  { id: 1, name: "Scène: Chaos", position: [48.8592, 2.3845], icon: sceneIcon },
  {
    id: 2,
    name: "Scène: Carnage",
    position: [48.8593, 2.385],
    icon: sceneIcon,
  },
  {
    id: 3,
    name: "Toilettes",
    position: [48.8597, 2.3851],
    icon: toilettesIcon,
  },
  {
    id: 4,
    name: "Restaurant",
    position: [48.8596, 2.3845],
    icon: restaurantIcon,
  },
  { id: 5, name: "Camping", position: [48.8601, 2.385], icon: campingIcon },
];

const InteractiveMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(
    null
  );
  const mapRef = useRef<L.Map | null>(null);

  const handleSetMap = (newMap: LeafletMap) => {
    mapRef.current = newMap;
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current?.removeLayer(layer);
        }
      });

      if (!mapRef.current.hasEventListeners("locationfound")) {
        mapRef.current.on("locationfound", (e: L.LocationEvent) => {
          L.marker(e.latlng)
            .addTo(mapRef.current as LeafletMap)
            .bindPopup("Vous êtes ici")
            .openPopup();

          mapRef.current?.setView(e.latlng, 13);
        });
      }
    }
  }, []);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          if (mapRef.current) {
            mapRef.current.locate({ setView: true, maxZoom: 16 });
          }
        },
        (error: GeolocationPositionError) => {
          console.error(error);
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  return (
    <React.Fragment>
      <div>
        <span className="relative flex justify-center bg-black p-4">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-75"></div>
          <span className="relative z-10 bg-black px-6 text-white md:text-2xl lg:text-4xl">
            Plan du festival
          </span>
        </span>
      </div>
      <div className="flex h-96 flex-col rounded-b p-2 lg:px-52">
        <MapContainer
          key="unique-map-key"
          center={[48.859607002831574, 2.3845481224854352]}
          zoom={17}
          style={{ height: "100%", width: "100%", borderRadius: "10px" }}
          whenReady={() => handleSetMap(mapRef.current as LeafletMap)} // Typage explicite pour map
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Affichage des points d'intérêt avec les icônes personnalisées */}
          {pointsOfInterest.map((poi) => (
            <Marker key={poi.id} position={poi.position} icon={poi.icon}>
              <Popup>{poi.name}</Popup>
            </Marker>
          ))}

          {userLocation && (
            <Marker position={userLocation}>
              <Popup>Vous êtes ici</Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Bouton Localiser */}
        <div className="flex justify-center p-4">
          <button className="btn" onClick={handleGeolocation}>
            Me Localiser
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default InteractiveMap;
