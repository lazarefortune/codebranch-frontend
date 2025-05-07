import { z } from "zod"

const passwordRules = z
    .string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères")
    .regex(/[A-Z]/, "Il faut au moins une majuscule")
    .regex(/[0-9]/, "Il faut au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Il faut au moins un caractère spécial");

export const registerSchema = z.object({
    username: z.string().min(2, "Le nom est trop court"),
    email: z.string().email("Email invalide"),
    password: passwordRules,
})

export type RegisterValues = z.infer<typeof registerSchema>;
