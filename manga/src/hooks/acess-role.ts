import { Access } from "payload";

export const isSuperAdmin: Access = ({ req: { user } }) =>
  user?.role === "superadmin";

export const isAdminOrSuperAdmin: Access = ({ req: { user } }) =>
  user?.role === "admin" || user?.role === "superadmin";

export const isTranslator: Access = ({ req: { user } }) =>
  user?.role === "translator";
