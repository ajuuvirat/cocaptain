import { User } from './user';
import { OrderDetail } from './order-detail';
import { Restaurant } from './restaurant';

export class Order {
  orderId?: string;
  userId?: User;
  status: string;
  totalAmount: string;
  tableId: string;
  restaurantId: Restaurant;
  orderDetailId: OrderDetail[] = new Array();
  map: any;
  takeaway: boolean;
}