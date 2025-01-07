import { Product } from './product/Product';
import { Order } from './order';
import { OrderDetail } from './order-detail';

export class OrderDetailModel {
    orderDetailId?:string;
    productId?:Product;
    orderId:Order;
    quantity:number;
    status?:string;
    orderDetailVo:OrderDetail[] = new Array();
    isSharing?: boolean;
    orderDetailList: OrderDetail[]
}
