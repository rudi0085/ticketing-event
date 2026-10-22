export type OrderStatus =
	| 'PENDING_PAYMENT'
	| 'AWAITING_VERIFICATION'
	| 'VERIFIED'
	| 'REJECTED'
	| 'EXPIRED';

export type TicketStatus = 'ACTIVE' | 'CHECKED_IN' | 'VOID';

export interface EventDetail {
	id: string;
	title: string;
	slug: string;
	description: string;
	venueName: string;
	eventDate: string; // ISO date string
	bannerUrl?: string;
	tiers: TicketTierDetail[];
}

export interface TicketTierDetail {
	id: string;
	eventId: string;
	name: string;
	description: string | null;
	price: number;
	quota: number;
	soldCount: number;
	isActive: boolean;
	availableQuota: number;
}

export interface OrderItemDetail {
	id: string;
	orderId: string;
	tierId: string;
	tierName?: string;
	quantity: number;
	unitPrice: number;
	subtotal: number;
}

export interface OrderDetail {
	id: string;
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	totalAmount: number;
	status: OrderStatus;
	paymentProofUrl?: string | null;
	rejectionReason?: string | null;
	expiresAt?: string | null;
	verifiedAt?: string | null;
	createdAt: string;
	items: OrderItemDetail[];
	tickets?: TicketDetail[];
}

export interface TicketDetail {
	id: string;
	orderId: string;
	tierId: string;
	tierName: string;
	ticketCode: string;
	qrHash: string;
	status: TicketStatus;
	checkedInAt?: string | null;
	createdAt: string;
	customerName?: string;
	customerEmail?: string;
	eventTitle?: string;
	venueName?: string;
	eventDate?: string;
}

export interface BankInfo {
	bankName: string;
	accountNumber: string;
	accountName: string;
}

