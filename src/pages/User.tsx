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
import type { User as UserType } from "@/types/User";
import { getUsers, promoteUserToAdmin, deleteUser } from "@/api/user";
import { toast } from "sonner";

const User: React.FC = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users.");
        }
    };

    const handleEdit = (user: UserType) => {
        setSelectedUser(user);
        setIsEditDialogOpen(true);
        toast("Ready to promote user to admin!");
    };

    const handleDelete = (user: UserType) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
        toast.error("Are you sure you want to delete this user?");
    };

    const handleSaveEdit = async () => {
        if (selectedUser) {
            try {
                await promoteUserToAdmin(selectedUser._id);
                fetchUsers();
                setIsEditDialogOpen(false);
                toast.success("User promoted to admin successfully!");
            } catch (error) {
                console.error("Error updating user:", error);
                toast.error("Failed to promote user.");
            }
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedUser) {
            try {
                await deleteUser(selectedUser._id);
                fetchUsers();
                setIsDeleteDialogOpen(false);
                toast.success("User deleted successfully!");
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user.");
            }
        }
    };

    return (
        <div className="p-2 sm:p-4">
            <div className="text-xl sm:text-2xl text-center font-bold text-white mb-4 p-2 bg-white/20 backdrop-blur-3xl shadow-2xl rounded-lg">User Management</div>

            <div className="overflow-x-auto sm:w-full w-[350px] rounded-lg shadow-2xl max-w-full mx-auto">
                <Table className="bg-white/90 p-2 sm:p-10 backdrop-blur-3xl">
                    <TableHeader>
                        <TableRow className="border-b border-gray-300/50">
                            <TableHead className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Username</TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Email</TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Role</TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id} className="border-b border-gray-200/50 hover:bg-gray-50/10">
                                <TableCell className="py-2 px-2 sm:py-3 sm:px-4 whitespace-nowrap">{user.username}</TableCell>
                                <TableCell className="py-2 px-2 sm:py-3 sm:px-4 whitespace-nowrap">{user.email}</TableCell>
                                <TableCell className="py-2 px-2 sm:py-3 sm:px-4 whitespace-nowrap">{user.role}</TableCell>
                                <TableCell className="py-2 px-2 sm:py-3 sm:px-4">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto text-white border-none bg-[linear-gradient(to_right,#758EB7,#041B2D)] !border-0 hover:opacity-90 transition-opacity text-xs py-1 px-2"
                                            size="sm"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="w-full sm:w-auto bg-[linear-gradient(to_right,#264D59,#041B2D)] !border-0 hover:opacity-90 transition-opacity text-xs py-1 px-2"
                                            onClick={() => handleDelete(user)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px] [&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
                    <DialogHeader>
                        <DialogTitle>Promote User to Admin</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to promote this user to admin?
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="grid gap-4 py-4">
                            <p>Promoting user: <strong className="font-semibold">{selectedUser.username}</strong></p>
                        </div>
                    )}
                    <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:space-x-2">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto !bg-transparent text-slate-700 border-slate-300 hover:bg-slate-100"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-[linear-gradient(to_right,#758EB7,#041B2D)] text-white hover:opacity-90"
                            onClick={handleSaveEdit}
                        >
                            Confirm Promote
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] [&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            account and remove their data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:space-x-2">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto !bg-transparent text-slate-700 border-slate-300 hover:bg-slate-100"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default User;