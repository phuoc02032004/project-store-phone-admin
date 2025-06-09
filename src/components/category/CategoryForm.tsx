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
import type { Category } from "@/types/Category";
import { getCategories } from "@/api/category";
import { toast } from "sonner";

interface CategoryFormProps {
    initialData?: Category | null;
    onSubmit: (data: z.infer<typeof formSchema>) => void; 
    onCancel: () => void;
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Category name is required." }),
    description: z.string().optional(),
    parentId: z.string().optional(), 
    image: z.instanceof(File).optional(),
});

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            parentId: initialData?.parent ? initialData.parent._id : "",
            image: undefined, 
        },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                const filteredCategories = initialData ? data.filter(cat => cat._id !== initialData._id) : data;
                setCategories(filteredCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast("Failed to load categories.");
            }
        };
        fetchCategories();
    }, [initialData]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
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
                    name="parentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parent Category (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-[linear-gradient(to_right,#264D59,#041B2D)] !border-none text-white">
                                        <SelectValue placeholder="Select a parent category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.filter(cat => cat.parent === null).map((category) => (
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
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                            <FormLabel>Category image</FormLabel> 
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => onChange(e.target.files ? e.target.files[0] : undefined)}
                                    {...fieldProps}
                                />
                            </FormControl>                          
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2">
                    <Button type="button" className="!bg-transparent" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" className="text-white bg-[linear-gradient(to_right,#264D59,#041B2D)]">
                        {initialData ? "Save Changes" : "Add Category"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CategoryForm;