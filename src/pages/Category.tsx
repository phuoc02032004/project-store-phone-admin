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
} from "@/components/ui/dialog";
import type { Category as CategoryType } from "@/types/Category";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/api/category";
import CategoryForm from "@/components/category/CategoryForm";
import { toast } from "sonner"

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
        toast("Ready to add a new category!");
    };

    const handleEditCategory = (category: CategoryType) => {
        setSelectedCategory(category);
        setIsFormDialogOpen(true);
        toast("Ready to edit the category!");
    };

    const handleDeleteCategory = (category: CategoryType) => {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
        toast.error("Are you sure you want to delete this category?");
    };

    const handleSaveCategory = async (categoryData: { name: string; description?: string | undefined; parentId?: string | undefined; image?: File | undefined; }) => {
        const { image, ...rest } = categoryData;
        try {
            if (selectedCategory) {
                await updateCategory(selectedCategory._id, rest);
                toast.success("Category updated successfully!");
            } else {
                if (image) {
                    const formData = new FormData();
                    formData.append('name', rest.name);
                    if (rest.description) formData.append('description', rest.description);
                    if (rest.parentId) formData.append('parentId', rest.parentId);
                    formData.append('image', image);
                    await addCategory(formData as any); 
                } else {
                    await addCategory(rest as any); 
                }
                toast.success("Category added successfully!");
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
                toast.success("Category deleted successfully!");
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    const parentCategories = categories.filter(cat => cat.parent === null);
    const childCategories = categories.filter(cat => cat.parent !== null);

    return (
        <div className="p-4">
            <div className="text-xl sm:text-2xl text-center font-bold text-white mb-4 p-2 bg-white/20 backdrop-blur-3xl shadow-2xl rounded-lg">Category Management</div>

            <Button onClick={handleAddCategory} className="mb-4 bg-[linear-gradient(to_right,#264D59,#041B2D)] !border-0">
                Add New Category
            </Button>

            <h2 className="text-xl font-semibold mb-2 text-white">Parent Categories</h2>
            <div className="overflow-x-auto sm:w-full w-[350px] rounded-lg shadow-2xl max-w-full mx-auto">
                <Table className="bg-white p-10 backdrop-blur-3xl shadow-2xl rounded-lg">
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
                        {parentCategories.slice().reverse().map((category) => (
                            <TableRow key={category._id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.slug}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>
                                    {category.image && <img src={category.image} alt={category.name} className="w-16 h-16 object-cover" />}
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" className="text-white bg-[linear-gradient(to_right,#264D59,#041B2D)] !border-0" size="sm" onClick={() => handleEditCategory(category)}>
                                        Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" className="ml-2 bg-[linear-gradient(to_right,#041B2D,#264D59)] !border-0" onClick={() => handleDeleteCategory(category)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            

            <h2 className="text-xl font-semibold text-white mt-8 mb-2">Child Categories</h2>
            <div className="overflow-x-auto sm:w-full w-[350px] rounded-lg shadow-2xl max-w-full mx-auto"> 
                <Table className="bg-white p-10 backdrop-blur-3xl shadow-2xl rounded-lg">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Parent</TableHead> 
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {childCategories.slice().reverse().map((category) => (
                            <TableRow key={category._id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.slug}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>
                                    {category.image && <img src={category.image} alt={category.name} className="w-16 h-16 object-cover" />}
                                </TableCell>
                                <TableCell>{category.parent ? category.parent.name : 'N/A'}</TableCell> 
                                <TableCell>
                                    <Button variant="outline" className="text-white bg-[linear-gradient(to_right,#264D59,#041B2D)]" size="sm" onClick={() => handleEditCategory(category)}>
                                        Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" className="ml-2 bg-[linear-gradient(to_right,#041B2D,#264D59)]" onClick={() => handleDeleteCategory(category)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            


            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogContent className="[&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
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

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="[&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the category.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="text-white" onClick={() => setIsDeleteDialogOpen(false)}>
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