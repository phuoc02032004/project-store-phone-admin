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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User as UserType } from "@/types/User";
import { getUsers, updateUser, deleteUser } from "@/api/user";

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
    };

    const handleDelete = (user: UserType) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        if (selectedUser) {
            try {
                await updateUser(selectedUser._id, selectedUser);
                fetchUsers();
                setIsEditDialogOpen(false);
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
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedUser) {
            setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>

            <Table>
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
                                <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDelete(user)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Make changes to the user's profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={selectedUser.username}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={selectedUser.email}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">
                                    Role
                                </Label>
                                <Input
                                    id="role"
                                    name="role"
                                    value={selectedUser.role}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="submit" onClick={handleSaveEdit}>
                            Save changes
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
}

export default User;