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
import type { Product as ProductType } from "@/types/Products";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/api/product";
import ProductForm from "@/components/product/ProductForm";
import { toast } from "sonner"


const Product: React.FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setIsFormDialogOpen(true);
    };

    const handleEditProduct = (product: ProductType) => {
        setSelectedProduct(product);
        setIsFormDialogOpen(true);
    };

    const handleDeleteProduct = (product: ProductType) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };
    const handleSaveProduct = async (formData: FormData) => {
        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct._id, formData);
            } else {
                await addProduct(formData);
            }
            fetchProducts();
            setIsFormDialogOpen(false);
            toast(`${selectedProduct ? "Product updated successfully." : "Product added successfully."}`);
        } catch (error) {
            console.error("Error saving product:", error);
            toast(`Failed to save product. ${error instanceof Error ? error.message : ''}`);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedProduct) {
            try {
                await deleteProduct(selectedProduct._id);
                fetchProducts();
                setIsDeleteDialogOpen(false);
                toast("Product deleted successfully.");
            } catch (error) {
                console.error("Error deleting product:", error);
                toast(`Failed to delete product. ${error instanceof Error ? error.message : ''}`);
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Product Management</h1>

            <Button onClick={handleAddProduct} className="mb-4">
                Add New Product
            </Button>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.slice().reverse().map((product) => (
                        <TableRow key={product._id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>
                                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                            </TableCell>
                            <TableCell>
                                <Button variant="outline" className="text-white" size="sm" onClick={() => handleEditProduct(product)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteProduct(product)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Product Form Dialog (Add/Edit) */}
            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                        <DialogDescription>
                            {selectedProduct ? "Make changes to the product details here." : "Fill in the details for the new product."}
                        </DialogDescription>
                    </DialogHeader>
                    <ProductForm
                        initialData={selectedProduct}
                        onSubmit={handleSaveProduct}
                        onCancel={() => setIsFormDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Product Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the product.
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

export default Product;