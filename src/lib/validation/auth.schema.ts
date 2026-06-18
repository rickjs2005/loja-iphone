import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta"),
});

/** Pedido de recuperação de senha (só o e-mail). */
export const recoverSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
});

/** Definição da nova senha: mínimo 8 caracteres e confirmação igual. */
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "A nova senha precisa de pelo menos 8 caracteres"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
  });
