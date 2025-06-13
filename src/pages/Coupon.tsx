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
import type { Coupon as CouponType } from "@/types/Coupon";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/api/coupon";
import CouponForm from "@/components/coupon/CouponForm";
import { toast } from "sonner";

const Coupon: React.FC = () => {
    const [coupons, setCoupons] = useState<CouponType[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<CouponType | null>(null);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const data = await getCoupons();
            setCoupons(data);
        } catch (error) {
            console.error("Error fetching coupons:", error);
        }
    };

    const handleAddCoupon = () => {
        setSelectedCoupon(null);
        setIsFormDialogOpen(true);
        toast("Ready to add a new coupon!");
    };

    const handleEditCoupon = (coupon: CouponType) => {
        setSelectedCoupon(coupon);
        setIsFormDialogOpen(true);
        toast("Ready to edit the coupon!");
    };

    const handleDeleteCoupon = (coupon: CouponType) => {
        setSelectedCoupon(coupon);
        setIsDeleteDialogOpen(true);
        toast("Ready to delete the coupon!");
    };

    const handleSaveCoupon = async (couponData: Partial<CouponType>) => {
        try {
            if (selectedCoupon) {
                await updateCoupon(selectedCoupon._id, couponData);
                toast.success("Coupon updated successfully!");
            } else {
                await createCoupon(couponData as CouponType);
            }
            fetchCoupons();
            setIsFormDialogOpen(false);
        } catch (error) {
            console.error("Error saving coupon:", error);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedCoupon) {
            try {
                await deleteCoupon(selectedCoupon._id);
                fetchCoupons();
                setIsDeleteDialogOpen(false);
                toast.success("Coupon deleted successfully!");
            } catch (error) {
                console.error("Error deleting coupon:", error);
            }
        }
    };

    return (
        <div className={`p-4 ${isFormDialogOpen || isDeleteDialogOpen ? 'filter blur-sm' : ''}`}>
            <div className="text-xl sm:text-2xl text-center font-bold text-white mb-4 p-2 bg-white/20 rounded-lg
            bg-gradient-to-tr from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)]
            backdrop-blur-[10px]
            border border-[rgba(255,255,255,0.18)]
            shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">Coupon Management</div>

            <Button onClick={handleAddCoupon} className="mb-4 bg-[linear-gradient(to_right,#264D59,#041B2D)] text-white">
                Add New Coupon
            </Button>

            <div className="overflow-x-auto sm:w-full w-[350px] rounded-lg shadow-2xl max-w-full mx-auto">
                <Table className="bg-white p-10 backdrop-blur-3xl shadow-2xl rounded-lg">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coupons.slice().reverse().map((coupon) => (
                            <TableRow key={coupon._id}>
                                <TableCell>{coupon.name}</TableCell>
                                <TableCell>{coupon.code}</TableCell>
                                <TableCell>{coupon.type}</TableCell>
                                <TableCell>{coupon.value}</TableCell>
                                <TableCell>{new Date(coupon.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(coupon.endDate).toLocaleDateString()}</TableCell>
                                <TableCell>{coupon.isActive ? "Yes" : "No"}</TableCell>
                                <TableCell>
                                    <Button variant="outline" className="text-white bg-[linear-gradient(to_right,#264D59,#041B2D)] !border-0" size="sm" onClick={() => handleEditCoupon(coupon)}>
                                        Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" className="ml-2 bg-[linear-gradient(to_right,#041B2D,#264D59)] !border-0" onClick={() => handleDeleteCoupon(coupon)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            

            {/* Coupon Form Dialog (Add/Edit) */}
            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogContent className="[&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
                    <DialogHeader>
                        <DialogTitle>{selectedCoupon ? "Edit Coupon" : "Add New Coupon"}</DialogTitle>
                        <DialogDescription>
                            {selectedCoupon ? "Make changes to the coupon details here." : "Fill in the details for the new coupon."}
                        </DialogDescription>
                    </DialogHeader>
                    <CouponForm
                        initialData={selectedCoupon}
                        onSubmit={handleSaveCoupon}
                        onCancel={() => setIsFormDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Coupon Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="[&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the coupon.
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

export default Coupon;