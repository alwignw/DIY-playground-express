import { WhereOptions } from 'sequelize'
import AccountModel, { AccountAttributes } from '../src/model/account-model'
import {Repository} from '../src/model/repository'
import ProfileModel from '../src/model/profile-model'

export class UtilsTest{
  static async getAccount(param:WhereOptions<AccountAttributes>){
    return await AccountModel.findOne({
      where:{...param}
    })
  }
  static async createAccount(){
    await AccountModel.create({
      id:'08a9e8db-a10c-49e5-bdb6-b66efebab220',
      email:"unittest@unittest.unittest",
      username:"unittest",
      password:"$2a$12$ZCnACm1IdoAtECnc27SOVOTosPlv5MhWgmSKAfsGbNkX4KP/tO.8i",//unittest
      status:true,
      is_logged_in:false,
    })
  }
  static async deleteAccount(){
    await AccountModel.destroy({
      where:{
        email:"unittest@unittest.unittest"
      }
    })
  }

  static async createProfile(id_role:string = 'c77bb6c9-d639-4c03-933b-629a40d77b66'){
    await ProfileModel.create({
      id:'08a9e8db-a10c-49e5-bdb6-b66efebab220',
      email:"unittest@unittest.unittest",
      id_role,
    })
  }
  static async deleteProfile(){
    await ProfileModel.destroy({
      where:{
        email:"unittest@unittest.unittest"
      }
    })
  }

  static async createCompany(){
    await Repository.CompanyModel.create({
      id:"UNITTEST",
      name:"Unit Test"
    })
  }



  static async createDataUser(){
    await this.createAccount()
    await this.createProfile()
  }
  static async deleteDataUser(){
    await this.deleteAccount()
    await this.deleteProfile()
  }
}