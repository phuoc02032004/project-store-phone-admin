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
import { toast } from "sonner"

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
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl text-center font-bold text-white mb-4 p-2 bg-white/20 backdrop-blur-3xl shadow-2xl rounded-lg">User Management</h1>

            <Table className="bg-white/90 p-10 backdrop-blur-3xl shadow-2xl rounded-lg">
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <Button variant="outline" className="text-white border-none bg-[linear-gradient(to_right,#758EB7,#041B2D)]" size="sm" onClick={() => handleEdit(user)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" className="ml-2 bg-[linear-gradient(to_right,#264D59,#041B2D)]" onClick={() => handleDelete(user)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Edit User Dialog (Promote to Admin) */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Promote User to Admin</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to promote this user to admin?
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="grid gap-4 py-4">
                            <p>Promoting user: <strong>{selectedUser.username}</strong></p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" className="text-white" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" onClick={handleSaveEdit}>
                            Confirm Promote
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            account and remove their data from our servers.
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
}

export default User;