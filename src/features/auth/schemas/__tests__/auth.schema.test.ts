import { describe, it, expect } from "vitest";
import {
  emailSchema,
  passwordSchema,
  verificationCodeSchema,
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../auth.schema";

describe("emailSchema", () => {
  it("devrait accepter un email valide", () => {
    expect(emailSchema.safeParse("user@example.com").success).toBe(true);
  });

  it("devrait rejeter un email invalide", () => {
    const result = emailSchema.safeParse("invalid-email");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("L'email n'est pas valide");
    }
  });

  it("devrait rejeter une chaîne vide", () => {
    const result = emailSchema.safeParse("");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("L'email est requis");
    }
  });
});

describe("passwordSchema", () => {
  it("devrait accepter un mot de passe valide", () => {
    expect(passwordSchema.safeParse("StrongPass123!").success).toBe(true);
  });

  it("devrait rejeter un mot de passe trop court", () => {
    const result = passwordSchema.safeParse("Short1!");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("8 caractères");
    }
  });

  it("devrait rejeter un mot de passe sans majuscule", () => {
    const result = passwordSchema.safeParse("strongpass123!");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("majuscule"))).toBe(true);
    }
  });

  it("devrait rejeter un mot de passe sans minuscule", () => {
    const result = passwordSchema.safeParse("STRONGPASS123!");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("minuscule"))).toBe(true);
    }
  });

  it("devrait rejeter un mot de passe sans chiffre", () => {
    const result = passwordSchema.safeParse("StrongPass!");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("chiffre"))).toBe(true);
    }
  });

  it("devrait rejeter un mot de passe sans caractère spécial", () => {
    const result = passwordSchema.safeParse("StrongPass123");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("caractère spécial"))).toBe(true);
    }
  });
});

describe("verificationCodeSchema", () => {
  it("devrait accepter un code valide à 6 chiffres", () => {
    expect(verificationCodeSchema.safeParse("123456").success).toBe(true);
  });

  it("devrait rejeter un code avec moins de 6 chiffres", () => {
    const result = verificationCodeSchema.safeParse("12345");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("6 chiffres");
    }
  });

  it("devrait rejeter un code avec plus de 6 chiffres", () => {
    const result = verificationCodeSchema.safeParse("1234567");
    expect(result.success).toBe(false);
  });

  it("devrait rejeter un code contenant des lettres", () => {
    const result = verificationCodeSchema.safeParse("12345a");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("chiffres");
    }
  });
});

describe("registerSchema", () => {
  it("devrait accepter des données valides", () => {
    const data = {
      email: "user@example.com",
      password: "StrongPass123!",
      confirmPassword: "StrongPass123!",
    };
    expect(registerSchema.safeParse(data).success).toBe(true);
  });

  it("devrait rejeter si les mots de passe ne correspondent pas", () => {
    const data = {
      email: "user@example.com",
      password: "StrongPass123!",
      confirmPassword: "DifferentPass123!",
    };
    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmPasswordError = result.error.issues.find(
        (e) => e.path[0] === "confirmPassword"
      );
      expect(confirmPasswordError?.message).toBe(
        "Les mots de passe ne correspondent pas"
      );
    }
  });

  it("devrait rejeter un email invalide", () => {
    const data = {
      email: "invalid-email",
      password: "StrongPass123!",
      confirmPassword: "StrongPass123!",
    };
    expect(registerSchema.safeParse(data).success).toBe(false);
  });

  it("devrait rejeter un mot de passe invalide", () => {
    const data = {
      email: "user@example.com",
      password: "weak",
      confirmPassword: "weak",
    };
    expect(registerSchema.safeParse(data).success).toBe(false);
  });
});

describe("verifyEmailSchema", () => {
  it("devrait accepter des données valides", () => {
    const data = {
      email: "user@example.com",
      code: "123456",
    };
    expect(verifyEmailSchema.safeParse(data).success).toBe(true);
  });

  it("devrait rejeter un email invalide", () => {
    const data = {
      email: "invalid-email",
      code: "123456",
    };
    expect(verifyEmailSchema.safeParse(data).success).toBe(false);
  });

  it("devrait rejeter un code invalide", () => {
    const data = {
      email: "user@example.com",
      code: "12345",
    };
    expect(verifyEmailSchema.safeParse(data).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("devrait accepter des données valides", () => {
    const data = {
      email: "user@example.com",
      password: "anypassword",
    };
    expect(loginSchema.safeParse(data).success).toBe(true);
  });

  it("devrait rejeter un email invalide", () => {
    const data = {
      email: "invalid-email",
      password: "anypassword",
    };
    expect(loginSchema.safeParse(data).success).toBe(false);
  });

  it("devrait rejeter un mot de passe vide", () => {
    const data = {
      email: "user@example.com",
      password: "",
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Le mot de passe est requis");
    }
  });
});

describe("forgotPasswordSchema", () => {
  it("devrait accepter un email valide", () => {
    const data = {
      email: "user@example.com",
    };
    expect(forgotPasswordSchema.safeParse(data).success).toBe(true);
  });

  it("devrait rejeter un email invalide", () => {
    const data = {
      email: "invalid-email",
    };
    expect(forgotPasswordSchema.safeParse(data).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("devrait accepter des données valides", () => {
    const data = {
      token: "reset-token-123",
      newPassword: "NewStrongPass123!",
      confirmPassword: "NewStrongPass123!",
    };
    expect(resetPasswordSchema.safeParse(data).success).toBe(true);
  });

  it("devrait rejeter si les mots de passe ne correspondent pas", () => {
    const data = {
      token: "reset-token-123",
      newPassword: "NewStrongPass123!",
      confirmPassword: "DifferentPass123!",
    };
    const result = resetPasswordSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmPasswordError = result.error.issues.find(
        (e) => e.path[0] === "confirmPassword"
      );
      expect(confirmPasswordError?.message).toBe(
        "Les mots de passe ne correspondent pas"
      );
    }
  });

  it("devrait rejeter un token vide", () => {
    const data = {
      token: "",
      newPassword: "NewStrongPass123!",
      confirmPassword: "NewStrongPass123!",
    };
    const result = resetPasswordSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Le token est requis");
    }
  });

  it("devrait rejeter un mot de passe invalide", () => {
    const data = {
      token: "reset-token-123",
      newPassword: "weak",
      confirmPassword: "weak",
    };
    expect(resetPasswordSchema.safeParse(data).success).toBe(false);
  });
});
