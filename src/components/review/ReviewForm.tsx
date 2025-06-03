import React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Review } from "@/types/Review";

interface ReviewFormProps {
    initialData?: Review | null;
    onSubmit: (data: Review) => void;
    onCancel: () => void;
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Review name is required." }),
    rating: z.number().min(1).max(5, { message: "Rating must be between 1 and 5." }),
    comment: z.string().optional(),
    user: z.string().min(1, { message: "User ID is required." }),
    product: z.string().min(1, { message: "Product ID is required." }),
});

type FormValues = z.infer<typeof formSchema>;

const ReviewForm: React.FC<ReviewFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        defaultValues: initialData || {
            name: "",
            rating: 1,
            comment: "",
            user: "",
            product: "",
        },
    });

    const handleSubmit = (data: FormValues) => {
        onSubmit(data as Review);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Review Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Review name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <Select onValueChange={value => field.onChange(Number(value))} value={String(field.value)}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a rating" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comment</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Review comment" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="user"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>User ID</FormLabel>
                            <FormControl>
                                <Input placeholder="User ID" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product ID</FormLabel>
                            <FormControl>
                                <Input placeholder="Product ID" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    );
};

export default ReviewForm;