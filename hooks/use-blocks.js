// hooks/useBlocks.js
import { useState, useEffect, useCallback } from 'react';

export const useBlocks = () => {
    const [blocks, setBlocks] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ბლოკების წამოღება
    const fetchBlocks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/buildings');
            const data = await response.json();

            if (data.status === "success") {
                setBlocks(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch blocks');
            }
        } catch (error) {
            setError(error.message);
            console.error('Error fetching blocks:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // ბლოკის დამატება
    const addBlock = async (blockData) => {
        try {
            setLoading(true);
            const response = await fetch('/api/buildings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blockData),
            });

            const data = await response.json();

            if (data.status === "success") {
                setBlocks(prevBlocks => [...prevBlocks, data.data]);
                return { success: true, data: data.data };
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error adding block:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // ბლოკის განახლება
    const updateBlock = async (blockId, updateData) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/buildings/${blockId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (data.status === "success") {
                setBlocks(prevBlocks =>
                    prevBlocks.map(block =>
                        block.block_id === blockId ? { ...block, ...updateData } : block
                    )
                );
                return { success: true, data: data.data };
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error updating block:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // ბლოკის წაშლა
    const deleteBlock = async (blockId) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/buildings/${blockId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.status === "success") {
                setBlocks(prevBlocks =>
                    prevBlocks.filter(block => block.block_id !== blockId)
                );
                if (selectedBlock === blockId) {
                    setSelectedBlock(null);
                }
                return { success: true };
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error deleting block:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // ბლოკის არჩევა
    const selectBlock = useCallback((blockId) => {
        setSelectedBlock(blockId);
    }, []);

    // პირველი fetch კომპონენტის მაუნთზე
    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);

    return {
        blocks,
        selectedBlock,
        loading,
        error,
        setSelectedBlock: selectBlock,
        addBlock,
        updateBlock,
        deleteBlock,
        refreshBlocks: fetchBlocks
    };
}; 