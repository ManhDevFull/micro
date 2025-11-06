export type ResponData<T = unknown> = {
  data: T;
  message: string;
  status: number;
};
export interface ICategory {
  id: number;
  namecategory: string;
  idparent: number | null;
  product: number;
}
export type ChatMessage = {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
};

export type ThreadResponse = {
  contactId: number;
  contactName: string;
  avatarInitials: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
};

export type CategoryTree = {
  id: number;
  namecategory: string;
  product: number;
  idparent?: number | null;
  children?: CategoryTree[];
};
export type IUser = {
  id: number;
  avatarImg?: string;
  name: string;
  tel: string;
  email: string;
  orders?: number;
  role: number;
};
export type IAddress = {
  accountid: number;
  codeward: number;
  createdate: string;
  description: string;
  detail: string;
  id: number;
  namerecipient: string;
  tel: string;
  title: string;
  updatedate: string;
};
export type IProductAdmin = {
  brand: string;
  category_id: number;
  category_name: string;
  createdate: string;
  description: string;
  imageurls: string[];
  max_price: number;
  min_price: number;
  name: string;
  product_id: number;
  updatedate: string;
  variant_count: number;
  variants: IVariant[];
};
export type IVariant = {
  createdate: string;
  inputprice: number;
  isdeleted: boolean;
  price: number;
  product_id: number;
  stock: number;
  sold?: number;
  updatedate: string;
  valuevariant: unknown;
  variant_id: number;
};

export type IOrderAdmin = {
  id: number;
  accountId: number;
  variantId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  productName: string;
  productImage: string;
  variantAttributes: Record<string, string>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  statusOrder: string;
  statusPay: string;
  typePay: string;
  orderDate: string;
  receiveDate?: string | null;
};

export type IOrderSummary = {
  total: number;
  pending: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  paid: number;
  unpaid: number;
  revenue: number;
};

export type IReviewAdmin = {
  id: number;
  orderId: number;
  rating: number;
  content: string;
  imageUrls: string[];
  createDate: string;
  updateDate?: string | null;
  isUpdated: boolean;
  customerName: string;
  customerEmail: string;
  productName: string;
  productImage: string;
  variantAttributes: Record<string, string>;
};

export type IReviewSummary = {
  total: number;
  updated: number;
  averageRating: number;
};
