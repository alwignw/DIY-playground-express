import moment from "moment";

interface ParamRandomString{numberOnly?:boolean, capitalize?:boolean}
export class Helpers{
  static generateRandomString(length:number, options: ParamRandomString
     = {capitalize:false, numberOnly:false}) : string {
    let number = '0123456789'
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    if(options.numberOnly){
      characters = number
    }

    let result = '';

    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    if(options.capitalize){
      result = result.toUpperCase();
    }
    return result;
  }



  static useLocaleString = (val : number): string => {
    return val.toLocaleString('en-US', {maximumFractionDigits: 2})
  }

  static parseInitialName = (name:string) : string => name.split(" ").map((it:any) => it[0].toUpperCase()).join("")

  static getTimeToDrink = (diffTime:moment.DurationInputArg1) => {
    let duration = moment.duration(diffTime)
    if(duration.hours() > 0){
      return `${duration.hours()} Jam ${duration.minutes()} Menit`
    }
    else if(duration.minutes() > 0){
      return `${duration.minutes()} Menit`
    }
    else if(duration.seconds() > 0){
      return `Kurang dari 1 menit`
    }
    return 'Waktunya Minum'
  }

}