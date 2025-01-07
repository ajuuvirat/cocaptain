import { Product } from './product/Product';
import { Order } from './order';

export class OrderDetail {
    orderDetailId?:string;
    productId?:Product;
    orderId:Order;
    quantity:number;
    status?:string;
    oneByTwo?: boolean;
}