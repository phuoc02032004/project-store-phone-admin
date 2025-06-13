import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Product as ProductType } from "@/types/Products";

interface ProductTableProps {
    products: ProductType[];
    currentPage: number;
    itemsPerPage: number;
    handleEditProduct: (product: ProductType) => void;
    handleDeleteProduct: (product: ProductType) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    currentPage,
    itemsPerPage,
    handleEditProduct,
    handleDeleteProduct,
}) => {
    return (
        <div className="overflow-x-auto sm:w-full w-[350px] rounded-lg shadow-2xl max-w-full mx-auto">
            <Table className="bg-white sm:p-10 backdrop-blur-3xl shadow-2xl rounded-lg
            ">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                        <TableRow key={product._id}>
                            <TableCell className="py-2 px-2 sm:py-3 sm:px-4">{product.name}</TableCell>
                            <TableCell className="py-2 px-2 sm:py-3 sm:px-4">{product.description}</TableCell>
                            <TableCell className="py-2 px-2 sm:py-3 sm:px-4">
                                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                            </TableCell>
                            <TableCell className="py-2 px-2 sm:py-3 sm:px-4">
                                <Button variant="outline" className="text-white bg-[linear-gradient(to_right,#264D59,#041B2D)] !border-0 text-xs py-1 px-2" size="sm" onClick={() => handleEditProduct(product)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" className="ml-2 bg-[linear-gradient(to_right,#041B2D,#264D59)] !border-0 text-xs py-1 px-2" onClick={() => handleDeleteProduct(product)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ProductTable;