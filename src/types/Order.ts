export interface Order {
    _id: string,
    user?: string,
    items: Items[],
    shippingAddress: shippingAddress[],
    paymentMethod: string,
    paymentStatus?: string,
    orderStatus?: string,
    totalAmount: number,
    notes: string,
    createdAt: string,
    updatedAt: string,
    shippingFee?: number,
    isFreeShipping?: boolean,
    appliedCoupon?: string | null,
    discountAmount?: number,
    finalAmount?: number,
}

export interface shippingAddress {
    street: string,
    city: string,
    state: string,
    phone: string

}

export interface Items{
    product: string,
    quantity: number,
    price: number,
    _id: string
}