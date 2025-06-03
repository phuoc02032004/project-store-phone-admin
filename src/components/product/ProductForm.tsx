import React, { useEffect, useState } from "react";
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
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/types/Products";
import type { Category } from "@/types/Category";
import { getCategories } from "@/api/category";
import { toast } from "sonner"

interface ProductFormProps {
    initialData?: Product | null;
    onSubmit: (data: FormData) => void;
    onCancel: () => void;
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Product name is required." }),
    description: z.string().min(1, { message: "Product description is required." }),
    category: z.string().min(1, { message: "Category is required." }),
    variants: z.string().min(1, { message: "Variants are required and must be valid JSON." }),
        image: z.any().refine((file) => file instanceof File || file === null, { message: "Image is required." }).optional(),
    isNewArrival: z.boolean(),
    isBestSeller: z.boolean(),
});

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            category: initialData?.category?._id || "",
            variants: initialData?.variants ? JSON.stringify(initialData.variants, null, 2) : "",
            image: null,
            isNewArrival: initialData?.isNewArrival ?? false,
            isBestSeller: initialData?.isBestSeller ?? false,
        },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast("Failed to load categories.")
            }
        };
        fetchCategories();
    }, [toast]);

    useEffect(() => {
        if (initialData) {
            form.reset({
                ...initialData,
                category: initialData.category?._id || "",
                variants: JSON.stringify(initialData.variants, null, 2),
                image: undefined, 
            });
            console.log("Initial category value:", initialData.image);
 
        }
    }, [initialData, form]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("category", values.category);
        formData.append("variants", values.variants);
        if (values.image) {
            formData.append("image", values.image);
        }
        formData.append("isNewArrival", String(values.isNewArrival));
        formData.append("isBestSeller", String(values.isBestSeller));

        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        onSubmit(formData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter product name" className="bg-white border-gray-300" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white text-white border-gray-300">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.filter(cat => cat.parent !== null).map((category) => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.name} 
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter product description"
                                        className="bg-white border-gray-300 min-h-[80px] max-h-[250px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="variants"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Variants (JSON Array)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='[{"color":"string","capacity":"string","price":10,"stock":0,"image":"string"}]'
                                        className="bg-white border-gray-300 min-h-[100px] font-mono text-sm w-full max-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Product Image</FormLabel>
                            <FormControl>
                                <>
                                    {initialData?.image && (
                                        <img src={initialData.image} alt="Current Product Image" className="w-32 h-32 object-cover mb-2 rounded-md border" />
                                    )}
                                    <Input
                                        {...fieldProps}
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => onChange(event.target.files && event.target.files[0])}
                                        className="bg-white border-gray-300"
                                    />
                                </>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="isNewArrival"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-white">
                                <FormControl>
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        className="h-6 w-6 border-gray-300 bg-white text-primary focus:ring-2 focus:ring-primary rounded-2xl"
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-gray-700">New Arrival</FormLabel>
                                    <FormDescription className="text-gray-500 text-sm">
                                        Mark this product as a new arrival.
                                    </FormDescription>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isBestSeller"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-white">
                                <FormControl>
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-gray-700">Best Seller</FormLabel>
                                    <FormDescription className="text-gray-500 text-sm">
                                        Mark this product as a best seller.
                                    </FormDescription>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button type="button" className="text-white" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
                        {initialData ? "Save Changes" : "Add Product"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProductForm;