import { ZodType, z } from "zod";

export class AuthValidation {
  static readonly RequestSignin: ZodType = z.object({  
    email: z.string({ message: 'Email' }),
    // .email({message:JSON.stringify({
    //   error:"Email",
    //   errorMessage:"Maaf, format email salah"
    // })}).min(1, { message: 'Email' }),
    password: z.string({ message: 'Password' })
    // .min(8, { message: 'Password must be at least 8 characters long!' })
    // .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter!' })
    // .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter!' })
    // .regex(/[0-9]/, { message: 'Password must contain at least one number!' })
    // .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character!' })
    // .refine(val => !/^\s+$/.test(val), { message: 'Input cannot be only spaces!' }),
  })
}