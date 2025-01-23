import { Restaurant } from './restaurant';
import { Role } from './role';
import { EmployeeRoleMap } from './employeeRoleMap';

export class Employee {
    id?: string;
    userId?:string;
    firstName?:string;
    lastName?:string;
    password?:string;
    restaurantId?:Restaurant;
    roleEmpId?:EmployeeRoleMap[] = new Array();
    
    /*roles:[{
        id: string , name: string,  selected: boolean
   }]*/

    

    

 
}