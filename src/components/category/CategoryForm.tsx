import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/Category";

interface CategoryFormProps {
    initialData?: Category | null;
    onSubmit: (data: Category) => void;
    onCancel: () => void;
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Category name is required." }),
    slug: z.string().min(1, { message: "Category slug is required." }),
    description: z.string().optional(),
    image: z.string().url({ message: "Invalid image URL." }).optional(),
    // For parent and ancestors, we might need more complex handling (e.g., a select dropdown for parent categories)
    // For simplicity, we'll omit them from the form for now or treat them as optional strings.
    // parent: z.string().optional(),
    // ancestors: z.array(z.string()).optional(),
});

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            slug: "",
            description: "",
            image: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values as Category); // Cast to Category, assuming formSchema covers all required fields
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter category name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter category slug" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter category description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter image URL" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {initialData ? "Save Changes" : "Add Category"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CategoryForm;