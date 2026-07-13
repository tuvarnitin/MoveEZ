import { useState, useCallback } from "react";
import axios from "axios";

const useRoute = () => {
    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadRoute = useCallback(async (start, end) => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
            );

            if (data?.routes?.length) {
                
                const route = data.routes[0];
                const routes = route.geometry.coordinates.map(([lng, lat]) => [
                    lat,
                    lng,
                ]);
                
                const distance = Number((route.distance / 1000).toFixed(2));
                const duration = Number((route.distance / 60).toFixed(2));

                setDistance(distance);
                setDuration(duration);

                return {
                    routes,
                    distance,
                    duration
                };
            }

            setDistance(0);

            return {
                routes: [],
                distance: 0,
            };
        } catch (err) {
            setError(err);
            setDistance(0);

            return {
                routes: [],
                distance: 0,
            };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loadRoute,
        distance,
        loading,
        error,
    };
};

export default useRoute;