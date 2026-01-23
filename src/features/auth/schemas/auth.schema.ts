import { z } from "zod";

/**
 * Schéma de validation pour l'email
 */
export const emailSchema = z
  .string()
  .min(1, "L'email est requis")
  .email("L'email n'est pas valide");

/**
 * Schéma de validation pour le mot de passe
 * Règles de sécurité :
 * - Minimum 8 caractères
 * - Au moins une majuscule
 * - Au moins une minuscule
 * - Au moins un chiffre
 * - Au moins un caractère spécial
 */
export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
  .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
  .regex(
    /[^A-Za-z0-9]/,
    "Le mot de passe doit contenir au moins un caractère spécial"
  );

/**
 * Schéma de validation pour le code de vérification email
 * Code à 6 chiffres
 */
export const verificationCodeSchema = z
  .string()
  .length(6, "Le code doit contenir 6 chiffres")
  .regex(/^\d{6}$/, "Le code doit contenir uniquement des chiffres");

/**
 * Schéma de validation pour l'inscription
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "La confirmation est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Schéma de validation pour la vérification email
 */
export const verifyEmailSchema = z.object({
  email: emailSchema,
  code: verificationCodeSchema,
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

/**
 * Schéma de validation pour la connexion
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schéma de validation pour la demande de réinitialisation de mot de passe
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Schéma de validation pour la réinitialisation de mot de passe
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Le token est requis"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "La confirmation est requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
