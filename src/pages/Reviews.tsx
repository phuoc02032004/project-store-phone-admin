import React, { useState, useEffect } from "react";
import {
    getReviews,
    createReview,
    updateReview,
    deleteReview,
} from "@/api/review";
import type { Review } from "@/types/Review";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import ReviewTable from "@/components/review/ReviewTable";
import ReviewForm from "@/components/review/ReviewForm";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner"


const Reviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [currentReview, setCurrentReview] = useState<Review | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await getReviews();
            setReviews(data);
        } catch (err) {
            setError("Failed to fetch reviews.");
            toast("Failed to fetch reviews.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddReview = () => {
        setCurrentReview(null);
        setIsFormOpen(true);
    };

    const handleEditReview = (review: Review) => {
        setCurrentReview(review);
        setIsFormOpen(true);
    };

    const handleDeleteReview = async (id: string) => {
        try {
            await deleteReview(id);
            toast("Review deleted successfully.");
            fetchReviews();
        } catch (err) {
            toast(`Failed to delete review. ${err instanceof Error ? err.message : ''}`);
        }
    };

    const handleSubmitForm = async (review: Review) => {
        try {
            if (currentReview) {
                await updateReview(currentReview._id!, review);
                toast("Review updated successfully.");
            } else {
                await createReview(review);
                toast("Review created successfully.");
            }
            setIsFormOpen(false);
            fetchReviews();
        } catch (err) {
            toast(`Failed to ${currentReview ? "update" : "create"} review. ${err instanceof Error ? err.message : ''}`);
        }
    };

    const handleCancelForm = () => {
        setIsFormOpen(false);
        setCurrentReview(null);
    };

    if (loading) {
        return <div className="p-4">Loading reviews...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Review Management</h1>
                <Button onClick={handleAddReview}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Review
                </Button>
            </div>
            <ReviewTable
                reviews={reviews}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
            />

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="[&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
                    <DialogHeader>
                        <DialogTitle>{currentReview ? "Edit Review" : "Add Review"}</DialogTitle>
                        <DialogDescription>
                            {currentReview
                                ? "Edit the details of the review."
                                : "Add a new review to the system."}
                        </DialogDescription>
                    </DialogHeader>
                    <ReviewForm
                        initialData={currentReview}
                        onSubmit={handleSubmitForm}
                        onCancel={handleCancelForm}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Reviews;
