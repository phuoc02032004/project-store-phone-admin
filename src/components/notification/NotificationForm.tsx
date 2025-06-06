import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Notify } from "@/types/Notify";

interface NotificationFormProps {
    initialData?: Notify | null;
    onSubmit: (data: Notify) => void;
    onCancel: () => void;
}

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required." }),
    body: z.string().min(1, { message: "Body is required." }),
    imageUrl: z.string().url({ message: "Invalid image URL." }).optional().or(z.literal("")),
    recipient: z.string().optional().or(z.literal("")),
    fcmToken: z.string().optional().or(z.literal("")),
    read: z.boolean(),
});

const NotificationForm: React.FC<NotificationFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title ?? "",
            body: initialData?.body ?? "",
            imageUrl: initialData?.imageUrl ?? "",
            recipient: initialData?.recipient ?? "",
            fcmToken: initialData?.fcmToken ?? "",
            read: initialData?.read ?? false,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values as Notify);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter notification title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Body</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter notification body" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter image URL" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Recipient (Optional - User ID)</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter recipient user ID" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="fcmToken"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>FCM Token (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter FCM Token" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2 col-span-4">
                    <Button type="button" className="!bg-transparent" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" className="text-white bg-[linear-gradient(to_right,#264D59,#041B2D)]">
                        {initialData ? "Save Changes" : "Send Notification"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default NotificationForm;