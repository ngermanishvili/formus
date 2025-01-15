// hooks/useApartments.js
export const useApartments = (selectedBlock) => {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchApartments = async () => {
        if (!selectedBlock) return;

        try {
            setLoading(true);
            const response = await fetch(`/api/buildings/${selectedBlock}/apartments`);
            const data = await response.json();

            if (data.status === "success") {
                setApartments(data.data);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApartments();
    }, [selectedBlock]);

    const addApartment = async (newApartment) => {
        try {
            const response = await fetch("/api/apartments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...newApartment,
                    block_id: selectedBlock,
                }),
            });

            if (response.ok) {
                setNotification({
                    type: "success",
                    message: "ბინა წარმატებით დაემატა",
                });
                setIsAddDialogOpen(false);

                // ხელახლა წამოვიღოთ ბინების სია
                const updatedResponse = await fetch(
                    `/api/buildings/${selectedBlock}/apartments`
                );
                const updatedData = await updatedResponse.json();
                if (updatedData.status === "success") {
                    setApartments(updatedData.data);
                }

                // გავასუფთაოთ ფორმა
                setNewApartment({
                    apartment_number: "",
                    floor: "",
                    total_area: "",
                    studio_area: "",
                    bedroom_area: "",
                    bedroom2_area: "",
                    bathroom_area: "",
                    bathroom2_area: "",
                    living_room_area: "",
                    balcony_area: "",
                    balcony2_area: "",
                });
            }
        } catch (error) {
            setNotification({
                type: "error",
                message: "შეცდომა ბინის დამატებისას",
            });
        }
    };

    const updateApartment = async (id, data) => {
        try {
            const response = await fetch(`/api/apartments/${apartmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const updatedApartments = apartments.map((apt) =>
                    apt.apartment_id === apartmentId ? { ...apt, ...updatedData } : apt
                );
                setApartments(updatedApartments);
                setEditingApartment(null);
                setNotification({
                    type: "success",
                    message: "ბინის მონაცემები წარმატებით განახლდა",
                });
                setTimeout(() => setNotification(null), 3000);
            }
        } catch (error) {
            setNotification({
                type: "error",
                message: "შეცდომა მონაცემების განახლებისას",
            });
        }
    };

    const deleteApartment = async (id) => {
        // წაშლის ლოგიკა
    };

    return {
        apartments,
        loading,
        error,
        addApartment,
        updateApartment,
        deleteApartment
    };
};



