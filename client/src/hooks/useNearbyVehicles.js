import { useState, useCallback } from "react";
import {vehicleService} from "../services/vehicle.service";

export default function useNearbyVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getNearbyVehicles = useCallback(async (lat, lon, vehicleType) => {
        setLoading(true);
        setError(null);

        try {
            const response = await vehicleService.getNearByVehicles({
                lat,
                lon,
                vehicleType,
            });

            if (response.success) {
                setVehicles(response.vehicles);
            } else {
                setVehicles([]);
            }

            return response;
        } catch (err) {
            setError(err);
            setVehicles([]);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        vehicles,
        loading,
        error,
        getNearbyVehicles,
    };
}