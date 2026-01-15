import z from "zod";
import sanitizeHtml from "sanitize-html";

export const loginSchema = z.object({
  email:z.string().email(),
  password: z.string()
})

export type LoginFormValue = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự "),
  username: z
    .string()
    .min(3, "Tên phải tối thiểu 3 ký tự")
    .max(50, "Tên quá dài vui lòng đặt tại tên")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} }).trim()
    ),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;