import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types/Review";

interface ReviewTableProps {
    reviews: Review[];
    onEdit: (review: Review) => void;
    onDelete: (id: string) => void;
}

const ReviewTable: React.FC<ReviewTableProps> = ({ reviews, onEdit, onDelete }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reviews.map((review) => (
                    <TableRow key={review._id}>
                        <TableCell>{review.name}</TableCell>
                        <TableCell>{review.rating}</TableCell>
                        <TableCell>{review.comment}</TableCell>
                        <TableCell>{review.user}</TableCell>
                        <TableCell>{review.product}</TableCell>
                        <TableCell>
                            <Button variant="outline" size="sm" onClick={() => onEdit(review)}>
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="ml-2"
                                onClick={() => onDelete(review._id)}
                            >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ReviewTable;