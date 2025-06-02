import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { Category as CategoryType } from "@/types/Category";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/api/category";
import CategoryForm from "@/components/category/CategoryForm";

const Category: React.FC = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleAddCategory = () => {
        setSelectedCategory(null);
        setIsFormDialogOpen(true);
    };

    const handleEditCategory = (category: CategoryType) => {
        setSelectedCategory(category);
        setIsFormDialogOpen(true);
    };

    const handleDeleteCategory = (category: CategoryType) => {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
    };

    const handleSaveCategory = async (categoryData: CategoryType) => {
        try {
            if (selectedCategory) {
                await updateCategory(selectedCategory._id, categoryData);
            } else {
                await addCategory(categoryData);
            }
            fetchCategories();
            setIsFormDialogOpen(false);
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedCategory) {
            try {
                await deleteCategory(selectedCategory._id);
                fetchCategories();
                setIsDeleteDialogOpen(false);
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Category Management</h1>

            <Button onClick={handleAddCategory} className="mb-4">
                Add New Category
            </Button>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category._id}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{category.slug}</TableCell>
                            <TableCell>{category.description}</TableCell>
                            <TableCell>
                                {category.image && <img src={category.image} alt={category.name} className="w-16 h-16 object-cover" />}
                            </TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteCategory(category)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Category Form Dialog (Add/Edit) */}
            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                        <DialogDescription>
                            {selectedCategory ? "Make changes to the category details here." : "Fill in the details for the new category."}
                        </DialogDescription>
                    </DialogHeader>
                    <CategoryForm
                        initialData={selectedCategory}
                        onSubmit={handleSaveCategory}
                        onCancel={() => setIsFormDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Category Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the category.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Category;