(() => {
	const mapElement = document.getElementById("location-map");
	const fallbackElement = document.getElementById("location-map-fallback");
	const warningElement = document.getElementById("location-map-warning");

	if (!(mapElement instanceof HTMLElement)) return;
	if (!(fallbackElement instanceof HTMLIFrameElement)) return;

	const accentColor = "#FF6A00";
	const googleMapsApiKey =
		typeof globalThis.FEC_NAGOYA_GOOGLE_MAPS_API_KEY === "string"
			? globalThis.FEC_NAGOYA_GOOGLE_MAPS_API_KEY.trim()
			: "";
	const routeConfig = {
		origin: {
			query: "名古屋駅, 愛知県名古屋市",
			title: "名古屋駅",
			label: "START",
		},
		destination: {
			query: "ウインクあいち, 愛知県名古屋市中村区名駅4丁目4-38",
			title: "ウインクあいち",
			label: "GOAL",
		},
	};
	const mapScriptId = "fec-nagoya-google-maps";
	const mapStyles = [{ stylers: [{ saturation: -100 }] }];

	const setMapVisibility = (isCustomMapReady) => {
		mapElement.hidden = !isCustomMapReady;
		mapElement.setAttribute("aria-hidden", String(!isCustomMapReady));
		fallbackElement.hidden = isCustomMapReady;
		if (warningElement instanceof HTMLElement) {
			warningElement.hidden = !isCustomMapReady;
		}
	};

	const loadGoogleMaps = () =>
		new Promise((resolve, reject) => {
			if (globalThis.google?.maps?.importLibrary) {
				resolve(globalThis.google.maps);
				return;
			}

			const existingScript = document.getElementById(mapScriptId);
			if (existingScript instanceof HTMLScriptElement) {
				existingScript.addEventListener(
					"load",
					() => resolve(globalThis.google.maps),
					{ once: true },
				);
				existingScript.addEventListener("error", reject, { once: true });
				return;
			}

			const callbackName = "__fecNagoyaGoogleMapsReady";
			const script = document.createElement("script");
			script.id = mapScriptId;
			script.async = true;
			script.defer = true;
			script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
				googleMapsApiKey,
			)}&v=weekly&loading=async&language=ja&region=JP&auth_referrer_policy=origin&callback=${callbackName}`;

			globalThis[callbackName] = () => {
				delete globalThis[callbackName];
				resolve(globalThis.google.maps);
			};

			script.addEventListener(
				"error",
				() => {
					delete globalThis[callbackName];
					reject(new Error("google-maps-load-error"));
				},
				{ once: true },
			);

			document.head.append(script);
		});

	const createMarkerIcon = (label) => {
		const isLong = label.length > 1;
		const labelOffset = 8;
		const width = isLong ? 72 : 36;
		const height = isLong ? 54 : 36;
		const viewW = isLong ? 40 : 24;
		const viewH = isLong ? 24 + labelOffset : 24;
		const cx = viewW / 2;
		const svg = isLong
			? `
			<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${viewW} ${viewH}" fill="none">
				<rect x="${cx - 12}" y="0" width="24" height="10" rx="5" fill="${accentColor}" stroke="#FAFAFA" stroke-width="1" />
				<text x="${cx}" y="7.2" text-anchor="middle" font-size="6" font-family="Arial, sans-serif" font-weight="700" fill="#FAFAFA">${label}</text>
				<path d="M${cx} ${22 + labelOffset}s7-7.75 7-13c0-3.87-3.13-7-7-7S${cx - 7} ${5.13 + labelOffset} ${cx - 7} ${9 + labelOffset}c0 5.25 7 13 7 13Z" fill="${accentColor}" stroke="#FAFAFA" stroke-width="1.5" />
				<circle cx="${cx}" cy="${9 + labelOffset}" r="3" fill="#FAFAFA" />
			</svg>
		`
			: `
			<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${viewW} ${viewH}" fill="none">
				<path d="M12 22s7-7.75 7-13c0-3.87-3.13-7-7-7S5 5.13 5 9c0 5.25 7 13 7 13Z" fill="${accentColor}" stroke="#FAFAFA" stroke-width="1.5" />
				<circle cx="12" cy="9" r="4.5" fill="#FAFAFA" />
				<text x="12" y="11.2" text-anchor="middle" font-size="6.5" font-family="Arial, sans-serif" font-weight="700" fill="${accentColor}">${label}</text>
			</svg>
		`;

		return {
			url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
			scaledSize: new globalThis.google.maps.Size(width, height),
			anchor: new globalThis.google.maps.Point(width / 2, height),
		};
	};

	const toLatLngLiteral = (point) => ({
		lat: typeof point.lat === "function" ? point.lat() : point.lat,
		lng: typeof point.lng === "function" ? point.lng() : point.lng,
	});

	const createRouteMap = async () => {
		if (!googleMapsApiKey) return;

		const googleMaps = await loadGoogleMaps();
		const { Route } = await googleMaps.importLibrary("routes");
		const {
			Map: GoogleMap,
			Polyline,
			LatLngBounds,
			Marker,
		} = globalThis.google.maps;

		const map = new GoogleMap(mapElement, {
			center: { lat: 35.170915, lng: 136.881537 },
			zoom: 16,
			styles: mapStyles,
			mapTypeControl: false,
			streetViewControl: false,
			fullscreenControl: true,
			gestureHandling: "cooperative",
			clickableIcons: false,
		});
		const { routes } = await Route.computeRoutes({
			origin: routeConfig.origin.query,
			destination: routeConfig.destination.query,
			travelMode: "WALKING",
			fields: ["path", "legs"],
		});
		const [route] = routes ?? [];
		const [leg] = route?.legs ?? [];
		const path = route?.path ?? [];

		if (!leg || path.length === 0) return;

		const polyline = new Polyline({
			map,
			path,
			strokeColor: accentColor,
			strokeOpacity: 1,
			strokeWeight: 5,
		});
		const bounds = new LatLngBounds();
		polyline.getPath().forEach((latLng) => {
			bounds.extend({ lat: latLng.lat(), lng: latLng.lng() });
		});

		map.fitBounds(bounds, 48);

		new Marker({
			map,
			position: toLatLngLiteral(leg.startLocation),
			title: routeConfig.origin.title,
			icon: createMarkerIcon(routeConfig.origin.label),
			zIndex: 2,
		});
		new Marker({
			map,
			position: toLatLngLiteral(leg.endLocation),
			title: routeConfig.destination.title,
			icon: createMarkerIcon(routeConfig.destination.label),
			zIndex: 2,
		});

		setMapVisibility(true);
	};

	void createRouteMap().catch(() => {
		setMapVisibility(false);
	});
})();
