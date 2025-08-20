export interface Selections {
    variant1: any;
    variant2: any;
    variant3: any;
    quantity: number;
}

export interface StoreInfo {
    event: {
        id: number;
        event_ref: string;
        event_name: string;
        start_date: string;
        end_date: string;
        participant_fee: number;
        qr_code: string | null;
        created: string;
        store: {
            id: number;
            store_name: string;
            logo: string | null;
            opening_time: string | null;
            website: string;
            instagram: string;
            twitter: string;
            facebook: string;
            currency: string;
            phone1?: string;
        };
    };
    has_settlement_account: boolean;
    products: Product[];
}

export interface Product {
    id: number;
    product_name: string;
    product_type: string;
    description: string;
    price: number;
    total_stock: number;
    has_variant: boolean;
    display: boolean;
    discount: string;
    discount_type: string;
    has_discount: boolean;
    slug: string;
    store: string;
    temp_id: string;
    category: string | null;
    rating: string;
    review_count: number;
    rate_tracking: string;
    strict_stock_count: boolean;
    created: string;
    last_sale: string | null;
    owner: string | null;
    options1: string;
    options2: string;
    options3: string;
    variants: string;
    combinations: string | null;
    images: { id: number; type: string; image: string; name: string | null; store: string; product: number }[];
    sku: Sku[];
    events: any[];
    display_event_data: {
        [eventId: string]: {
            display_product: boolean;
        };
    };
}

export interface Sku {
    id: number;
    sku: string;
    option1: string;
    option2: string;
    option3: string;
    has_discount: boolean;
    sku_discount: string;
    sku_discount_type: string;
    price: number;
    qty: number;
    event_data: null | {
        [eventId: string]: {
            qty: number;
            price: number;
        };
    };
}

export interface CartItem extends Product {
    selected_variant1: string;
    selected_variant2: string;
    selected_variant3: string;
    selected_quantity: number;
    variant_price: number;
    variant_total_stock: number;
    itemTotal: number;
    selected_sku: number;
}

export interface ShippingDetails {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    instagram_handle: string;
}
