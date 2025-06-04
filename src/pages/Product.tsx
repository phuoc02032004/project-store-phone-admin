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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { Product as ProductType } from "@/types/Products";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/api/product";
import ProductForm from "@/components/product/ProductForm";
import { toast } from "sonner"


const Product: React.FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

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
        toast("Ready to add a new product!");
    };

    const handleEditProduct = (product: ProductType) => {
        setSelectedProduct(product);
        setIsFormDialogOpen(true);
    };

    const handleDeleteProduct = (product: ProductType) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
        toast.error("Are you sure you want to delete this product?");
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

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const pageRange = 2; // Number of pages to show around the current page

    const renderPaginationItems = () => {
        const items = [];
        const startPage = Math.max(1, currentPage - pageRange);
        const endPage = Math.min(totalPages, currentPage + pageRange);

        if (startPage > 1) {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink href="#" onClick={() => setCurrentPage(1)} className="text-white">1</PaginationLink>
                </PaginationItem>
            );
            if (startPage > 2) {
                items.push(<PaginationEllipsis key="ellipsis-start" className="text-black" />);
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <PaginationItem key={page}>
                    <PaginationLink href="#" isActive={page === currentPage} onClick={() => setCurrentPage(page)} className="text-black">
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<PaginationEllipsis key="ellipsis-end" className="text-black" />);
            }
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink href="#" onClick={() => setCurrentPage(totalPages)} className="text-black">{totalPages}</PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl text-center font-bold text-white mb-4 p-2 bg-white/20 backdrop-blur-3xl shadow-2xl rounded-lg">Product Management</h1>

            <Button onClick={handleAddProduct} className="mb-4 bg-[linear-gradient(to_right,#264D59,#041B2D)]">
                Add New Product
            </Button>

            <Table className="bg-white p-10 backdrop-blur-3xl shadow-2xl rounded-lg">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).reverse().map((product) => (
                        <TableRow key={product._id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>
                                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                            </TableCell>
                            <TableCell>
                                <Button variant="outline" className="text-white bg-[linear-gradient(to_right,#264D59,#041B2D)]" size="sm" onClick={() => handleEditProduct(product)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" className="ml-2 bg-[linear-gradient(to_right,#041B2D,#264D59)]" onClick={() => handleDeleteProduct(product)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination className="mt-4  bg-transparent">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="" />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                        <PaginationNext href="#" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

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

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the product.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="text-white bg-[linear-gradient(to_right,#264D59,#041B2D)]" onClick={() => setIsDeleteDialogOpen(false)}>
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