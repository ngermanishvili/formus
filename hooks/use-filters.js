// hooks/useFilters.js
import { useState, useMemo, useCallback } from 'react';

export const useFilters = (apartments) => {
    // ფილტრების სთეითები
    const [searchTerm, setSearchTerm] = useState("");
    const [filterFloor, setFilterFloor] = useState("all");
    const [sortConfig, setSortConfig] = useState({
        key: "floor",
        direction: "asc"
    });

    // უნიკალური სართულების სია
    const availableFloors = useMemo(() => {
        if (!apartments?.length) return [];
        return [...new Set(apartments.map(apt => apt.floor.toString()))]
            .sort((a, b) => Number(a) - Number(b));
    }, [apartments]);

    // სორტირების ჰენდლერი
    const handleSort = useCallback((key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc"
        }));
    }, []);

    // გაფილტრული და დასორტირებული ბინების სია
    const filteredApartments = useMemo(() => {
        if (!apartments) return [];

        return [...apartments]
            .filter((apt) => {
                // ძიების ფილტრი
                const matchesSearch =
                    apt.apartment_number.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                    apt.floor.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                    apt.total_area.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (apt.status && apt.status.toLowerCase().includes(searchTerm.toLowerCase()));

                // სართულის ფილტრი
                const matchesFloor = filterFloor === "all" || apt.floor.toString() === filterFloor;

                return matchesSearch && matchesFloor;
            })
            .sort((a, b) => {
                // სორტირება
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (typeof aValue === 'string') {
                    if (sortConfig.direction === 'asc') {
                        return aValue.localeCompare(bValue);
                    }
                    return bValue.localeCompare(aValue);
                }

                if (sortConfig.direction === 'asc') {
                    return aValue > bValue ? 1 : -1;
                }
                return aValue < bValue ? 1 : -1;
            });
    }, [apartments, searchTerm, filterFloor, sortConfig]);

    // სტატისტიკა
    const stats = useMemo(() => {
        if (!filteredApartments.length) return null;

        return {
            total: filteredApartments.length,
            byStatus: filteredApartments.reduce((acc, apt) => {
                acc[apt.status] = (acc[apt.status] || 0) + 1;
                return acc;
            }, {}),
            averageArea: Math.round(
                filteredApartments.reduce((sum, apt) => sum + Number(apt.total_area), 0) /
                filteredApartments.length
            )
        };
    }, [filteredApartments]);

    // ფილტრების გასუფთავება
    const clearFilters = useCallback(() => {
        setSearchTerm("");
        setFilterFloor("all");
        setSortConfig({ key: "floor", direction: "asc" });
    }, []);

    return {
        // ფილტრის მდგომარეობები
        searchTerm,
        filterFloor,
        sortConfig,

        // setter ფუნქციები
        setSearchTerm,
        setFilterFloor,
        handleSort,
        clearFilters,

        // გაფილტრული მონაცემები და მეტა ინფორმაცია
        filteredApartments,
        availableFloors,
        stats,

        // დამხმარე ფუნქციები
        isFiltered: searchTerm !== "" || filterFloor !== "all"
    };
};