import axios from "axios";
import moment from "moment";
import { Helpers } from "./helpers";
import 'moment-timezone';

export class Utils extends Helpers{
  static calculateSpeedoAngle(percent:number) : number {
    return ((percent * (360 / 100)) + 180) * Math.PI / 180
  }
  
  static decodePayload = async (value:any) =>{
    const key = 'qowiezxv'
    const dec = atob(atob(value).split(key)[0])
    return dec  
  }

  static getGreeting () : string {
    const hour = Number(moment().tz("Asia/Jakarta").format('HH'));
    let greeting = ""
    if (hour >= 5 && hour < 12) {greeting = 'Semangat Pagi!';}
    else if (hour >= 12 && hour < 15) greeting = 'Selamat Siang';
    else if (hour >= 15 && hour < 17) greeting = 'Selamat Sore';
    else if (hour >= 17) greeting = 'Selamat Malam';
    if (hour < 5) {greeting = 'Waktunya Istirahat';}
    return greeting;
  }
  static trimDecimal = (num:number) : string => {
    if(num === Math.floor(num)){
      return `${num}`
    }
    return num.toFixed(2)
  }
  static getClaimLabel = (claim:number) : {label:string, background:string, border:string} => {
    let label = ''
    let background = ''
    let border = ''

    if (claim >= 0 && claim <= 100/3) {
      label = 'Perhatian';
      background = '0xFFEF5350';
      border = '0xFFEF9A9A';
    }
    else if (claim > 100/3 && claim <= 100/3*2) {
      label = 'Cukup';
      background = '0xFFFFA726';
      border = '0xFFFFCC80';
    }
    else if (claim > 100/3*2) {
      label = 'Baik';
      background = '0xFF66BB6A';
      border = '0xFFA5D6A7';
    }

    return {
      label,
      background,
      border,
    }
  }


  static intersectionArray = <T>(data1: Array<T>, data2: Array<T>): Array<T> => {
    return data1.filter(item => data2.includes(item));
  }

  static countStar = (steps : number): number => {
    if (steps < 1) { return 0 }
    else if (steps < 2000) { return 1 }
    else if (steps < 4000) { return 2 }
    else if (steps < 6000) { return 3 }
    else if (steps < 8000) { return 4 }

    return 5
  }


  static paging = ({page,pageSize}:{page:number, pageSize:number}) : {limit:number, offset:number} => ({
    limit:pageSize,
    offset:(page - 1) * pageSize
  })

  static isJSON(str:string) : boolean{
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
  }

  static isValidPhoneNumber = (phoneNumber:string) : boolean => {
    return /^08\d{8,13}$/.test(phoneNumber)
  }

  static findLineByLeastSquares = (data:any, key:string) => {
    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_xx = 0;
    let count = 0;

    let x = 0;
    let y = 0;

    let values_x, values_y

    values_x = data.map((e:any, i:any) => i)
    values_y = data.map((it:any) => +it[key])

    if (values_x.length === 0) {
        return [[], []];
    }

    for (let v = 0; v < values_x.length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x * x;
        sum_xy += x * y;
        count++;
    }

    let m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
    let b = (sum_y / count) - (m * sum_x) / count;

    let result_values_x = [];
    let result_values_y = [];

    for (let v = 0; v < values_x.length; v++) {
        x = values_x[v];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }

    return data.map((it:any, i:any) => {
        it[`${key}Trend`] = result_values_y[i]
        return it
    })
}


}