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
import type { Product } from "@/types/Products";

interface ProductFormProps {
    initialData?: Product | null;
    onSubmit: (data: Product) => void;
    onCancel: () => void;
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Product name is required." }),
    decription: z.string().min(1, { message: "Product description is required." }),
    image: z.string().url({ message: "Invalid image URL." }),
    // Add more fields as necessary based on your Product type
});

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            decription: "",
            image: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values as Product); // Cast to Product, assuming formSchema covers all required fields
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter product name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="decription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter product description" {...field} />
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
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter image URL" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Add more form fields for other product properties like category, variants, etc. */}
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {initialData ? "Save Changes" : "Add Product"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProductForm;