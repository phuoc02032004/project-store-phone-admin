import React, { useEffect, useState } from "react";
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
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/api/product";
import ProductForm from "@/components/product/ProductForm";
import ProductTable from "@/components/product/ProductTable";
import ProductPagination from "@/components/product/ProductPagination";
import { toast } from "sonner";

const Product: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isNewProducts, setIsNewProducts] = useState<ProductType[]>([]);
  const [isBestSeller, setIsBestSeller] = useState<ProductType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPageAllProducts, setCurrentPageAllProducts] = useState(1);
  const [currentPageNewProducts, setCurrentPageNewProducts] = useState(1);
  const [currentPageBestSeller, setCurrentPageBestSeller] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.slice().reverse().slice());
      const newArrivals = await getProducts({ isNewArrival: true });
      const bestSellers = await getProducts({ isBestSeller: true });
      console.log("new", newArrivals);
      setIsNewProducts(newArrivals.slice().reverse().slice());
      setIsBestSeller(bestSellers.slice().reverse().slice());
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
      toast(
        `${
          selectedProduct
            ? "Product updated successfully."
            : "Product added successfully."
        }`
      );
    } catch (error) {
      console.error("Error saving product:", error);
      toast(
        `Failed to save product. ${error instanceof Error ? error.message : ""}`
      );
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
        toast(
          `Failed to delete product. ${
            error instanceof Error ? error.message : ""
          }`
        );
      }
    }
  };

  const totalPagesAllProducts = Math.ceil(products.length / itemsPerPage);
  const totalPagesNewProducts = Math.ceil(isNewProducts.length / itemsPerPage);
  const totalPagesBestSeller = Math.ceil(isBestSeller.length / itemsPerPage);

  return (
    <div className="p-2 sm:p-4">
      <div
        className="text-xl sm:text-2xl text-center font-bold text-white mb-4 p-2 bg-white/20
            bg-gradient-to-tr from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)]
            backdrop-blur-[10px]
            rounded-[20px]
            border border-[rgba(255,255,255,0.18)]
            shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
      >
        Product Management
      </div>

      <Button
        onClick={handleAddProduct}
        className="mb-4 bg-[linear-gradient(to_right,#264D59,#041B2D)] !border-0"
      >
        Add New Product
      </Button>

      <div className="text-lg sm:text-xl font-semibold text-white mb-2 mt-6">
        All Products
      </div>
      <ProductTable
        products={products}
        currentPage={currentPageAllProducts}
        itemsPerPage={itemsPerPage}
        handleEditProduct={handleEditProduct}
        handleDeleteProduct={handleDeleteProduct}
      />
      <ProductPagination
        currentPage={currentPageAllProducts}
        totalPages={totalPagesAllProducts}
        setCurrentPage={setCurrentPageAllProducts}
      />

      <div className="text-lg sm:text-xl font-semibold text-white mb-2 mt-6">
        New Arrivals
      </div>
      <ProductTable
        products={isNewProducts}
        currentPage={currentPageNewProducts}
        itemsPerPage={itemsPerPage}
        handleEditProduct={handleEditProduct}
        handleDeleteProduct={handleDeleteProduct}
      />
      <ProductPagination
        currentPage={currentPageNewProducts}
        totalPages={totalPagesNewProducts}
        setCurrentPage={setCurrentPageNewProducts}
      />

      <div className="text-lg sm:text-xl font-semibold text-white mb-2 mt-6">
        Best Sellers
      </div>
      <ProductTable
        products={isBestSeller}
        currentPage={currentPageBestSeller}
        itemsPerPage={itemsPerPage}
        handleEditProduct={handleEditProduct}
        handleDeleteProduct={handleDeleteProduct}
      />
      <ProductPagination
        currentPage={currentPageBestSeller}
        totalPages={totalPagesBestSeller}
        setCurrentPage={setCurrentPageBestSeller}
      />

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="[&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct
                ? "Make changes to the product details here."
                : "Fill in the details for the new product."}
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
        <DialogContent className="[&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              product.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-white bg-[linear-gradient(to_right,#264D59,#041B2D)]"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
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
