export type CouponType =
    'PERCENTAGE_DISCOUNT' |  // Percentage discount on total order or product
    'FIXED_AMOUNT_DISCOUNT' |  // Fixed amount discount on total order or product
    'FREE_SHIPPING' | // Free shipping
    'BUY_X_GET_Y' | // Buy X Get Y (can be product or service)
    'PRODUCT_GIFT'; // Specific product gift with purchase

export interface Coupon {
    _id: string;
    name: string;
    code: string;
    description: string;
    type: CouponType;
    value: number;
    startDate: Date | string;
    endDate: Date | string;
    isActive: boolean;
    usageLimit: number | null;
    timesUsed: number;
    usageLimitPerUser: number;
    minOrderValue: number;
    maxDiscountValue: number;
    applicableProducts: string[];
    applicableCategories: string[],
    excludedProducts: string[],
    buyQuantity: number;
    getQuantity: number;
    giftProductId:string[],
    createdBy: string[],
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}