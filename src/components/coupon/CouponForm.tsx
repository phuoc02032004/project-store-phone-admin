import React, { useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Coupon } from "@/types/Coupon";
import { Textarea } from "@/components/ui/textarea"


interface CouponFormProps {
    initialData?: Coupon | null;
    onSubmit: (data: Partial<Coupon>) => void;
    onCancel: () => void;
}

const couponTypes = [
    "PERCENTAGE_DISCOUNT",
    "FIXED_AMOUNT_DISCOUNT",
    "FREE_SHIPPING",
    "BUY_X_GET_Y",
    "PRODUCT_GIFT",
] as const;

const formSchema = z.object({
    name: z.string().min(1, { message: "Coupon name is required." }),
    code: z.string().min(1, { message: "Coupon code is required." }),
    description: z.string().optional(),
    type: z.enum(couponTypes, { message: "Coupon type is required." }),
    value: z.number().min(0, { message: "Value must be a positive number." }),
    startDate: z.string().min(1, { message: "Start date is required." }),
    endDate: z.string().min(1, { message: "End date is required." }),
    isActive: z.boolean().default(true),
    usageLimit: z.number().nullable().optional(),
    usageLimitPerUser: z.number().min(0).default(1),
    minOrderValue: z.number().min(0).default(0),
    maxDiscountValue: z.number().nullable().optional(),
    applicableProducts: z.array(z.string()).default([]),
    applicableCategories: z.array(z.string()).default([]),
    excludedProducts: z.array(z.string()).default([]),
    buyQuantity: z.number().min(0).default(0),
    getQuantity: z.number().min(0).default(0),
    giftProductId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CouponForm: React.FC<CouponFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [step, setStep] = useState(0);
    const totalSteps = 3; 

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: initialData ? {
            ...initialData,
            giftProductId: Array.isArray(initialData.giftProductId) ? initialData.giftProductId[0] : initialData.giftProductId,
            startDate: initialData.startDate instanceof Date ? initialData.startDate.toISOString().slice(0, 16) : initialData.startDate.toString().slice(0, 16),
            endDate: initialData.endDate instanceof Date ? initialData.endDate.toISOString().slice(0, 16) : initialData.endDate.toString().slice(0, 16),
        } : {
            name: "",
            code: "",
            description: "",
            type: "PERCENTAGE_DISCOUNT",
            value: 0,
            startDate: "",
            endDate: "",
            isActive: true,
            usageLimit: 0,
            usageLimitPerUser: 0,
            minOrderValue: 0,
            maxDiscountValue: 0,
            applicableProducts: [""],
            applicableCategories: [""],
            excludedProducts: [""],
            buyQuantity: 0,
            getQuantity: 0,
            giftProductId: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                ...initialData,
                giftProductId: Array.isArray(initialData.giftProductId) ? initialData.giftProductId[0] : initialData.giftProductId,
                startDate: initialData.startDate instanceof Date ? initialData.startDate.toISOString().slice(0, 16) : initialData.startDate.toString().slice(0, 16),
                endDate: initialData.endDate instanceof Date ? initialData.endDate.toISOString().slice(0, 16) : initialData.endDate.toString().slice(0, 16),
            });
        }
    }, [initialData, form]);

    const handleNext = async () => {
        let fieldsToValidate: (keyof FormValues)[] = [];
        if (step === 0) {
            fieldsToValidate = ['name', 'code', 'type', 'value', 'description'];
        }

        const isValid = await form.trigger(fieldsToValidate);

        if (isValid) {
            setStep((prevStep) => {
                const nextStep = Math.min(prevStep + 1, totalSteps - 1);
                return nextStep;
            });
        }
    };

    const handlePrevious = () => {
        setStep((prevStep) => Math.max(prevStep - 1, 0));
    };

const handleSubmit = (data: FormValues) => {
        const submitData = {
            ...data,
            giftProductId: data.giftProductId || '',
            startDate: new Date(data.startDate).toISOString(),
            endDate: new Date(data.endDate).toISOString(),
        };
        onSubmit(submitData);

        if (!initialData) {
            form.reset({
                name: "",
                code: "",
                description: "",
                type: "PERCENTAGE_DISCOUNT", 
                value: 0,
                startDate: "",
                endDate: "",
                isActive: true,
                usageLimit: null,
                usageLimitPerUser: 1,
                minOrderValue: 0,
                maxDiscountValue: null,
                applicableProducts: [],
                applicableCategories: [],
                excludedProducts: [],
                buyQuantity: 0,
                getQuantity: 0,
                giftProductId: "",
            });
             setStep(0); 
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-5">
                    {/* Step 1 */}
                    {step === 0 && (
                        <>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Coupon Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter coupon name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Coupon Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter coupon code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Coupon Type</FormLabel>
                                        <Select 
                                            defaultValue={field.value} 
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="!bg-transparent border-2 !border-gray-300">
                                                    <SelectValue placeholder="Select coupon type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {couponTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Value</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Enter value" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-6">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter description or date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    {/* Step 2 */}
                    {step === 1 && (
                        <>
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />

                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" placeholder="nn/mm/yyyy" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="usageLimit"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Usage Limit</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter usage"
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="usageLimitPerUser"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Usage Limit Per User</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="1" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="minOrderValue"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Minimum Order Value</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maxDiscountValue"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Maximum Discount Value</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    {/* Step 3 */}
                    {step === 2 && (
                        <>
                            <FormField
                                control={form.control}
                                name="buyQuantity"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Buy Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="getQuantity"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Get Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="giftProductId"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Gift Product ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter gift p..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Status</FormLabel>
                                        <Select 
                                            defaultValue={field.value ? 'true' : 'false'} 
                                            onValueChange={(value) => field.onChange(value === 'true')}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="text-white">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true">Active</SelectItem>
                                                <SelectItem value="false">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="applicableProducts"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Applicable Products (IDs)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., id1, id2"
                                                {...field}
                                                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                                onChange={e => field.onChange(e.target.value.split(',').map(id => id.trim()).filter(id => id !== ''))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="applicableCategories"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Applicable Categories (IDs)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., id1, id2"
                                                {...field}
                                                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                                onChange={e => field.onChange(e.target.value.split(',').map(id => id.trim()).filter(id => id !== ''))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="excludedProducts"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Excluded Products (IDs)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., id1, id2"
                                                {...field}
                                                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                                onChange={e => field.onChange(e.target.value.split(',').map(id => id.trim()).filter(id => id !== ''))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </div>

                <div className="flex justify-end space-x-2 pt-6">
                    {step > 0 && (
                        <Button type="button" className="text-white" variant="outline" onClick={handlePrevious}>
                            Previous
                        </Button>
                    )}
                    {step < totalSteps - 1 && (
                        <Button type="button" onClick={handleNext}>
                            Next
                        </Button>
                    )}
                    {step === totalSteps - 1 && (
                        <Button type="submit">
                            {initialData ? "Save Changes" : "Add Coupon"}
                        </Button>
                    )}
                     <Button type="button" className="text-white" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CouponForm;