import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(255, 'Le nom doit contenir moins de 255 caractères'),
  email: z
    .string()
    .email('Adresse email invalide')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
