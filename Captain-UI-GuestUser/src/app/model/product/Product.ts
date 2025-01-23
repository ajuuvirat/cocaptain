import { Veg } from './Veg';
import { Catagory } from './Catagory';
import { SubCatagory } from './SubCatagory';
import { ServedDuring } from './ServedDuring';
import { ProductServeMap } from './ProductServeMap';
import { Restaurant } from '../restaurant';
import { Gst } from './Gst';
import { Cuisine } from './Cuisine';
import { Dependency } from './Dependency';
import { OrderDetail } from '../order-detail';

export class Product {
    id?: string;
    buttonLabel?: string;
    productId?:string;
    productName?:string;
    productDesc?:string;
    image?:string; 
    video?:string; 
    pieceCount?:string; 
    quantity?:number;
    nextAvailable?:boolean; 
    productComments?:string;  
    addOn?:string; 
    availability?:boolean; 
    calories?:string; 
    productPrice?:number; 
    preparationTime?:string; 
    packingCharge?:string;   
    cGst?:string; 
    sGst?:string;  
    iGst?:string; 
    finalPrice?:string; 
    vegId?:Veg; 
    categoryId?:Catagory; 
    subCategoryId?:SubCatagory; 
    servedDuringId?:ServedDuring[] = new Array(); 
    cuisineId?:Cuisine; 
    dependencyId?:Dependency[] = new Array(); 
    gstId:Gst; 
    restaurantId?:Restaurant; 
    productServeMapId? : ProductServeMap[] = new Array();  
    orderDetailList:OrderDetail[] = new Array();
    recommendation?:boolean;
    status_0?:number=0;
    status_1?:number=0;
    status_2?:number=0;
    status_3?:number=0;
  orderDetail: any;
  voiceText: string;
  voiceMessages?: string[];
  sharing?: boolean;
  subscriptionType?: number
  restaurantLogoImageName?: string;
  showButton?: boolean;
 
}