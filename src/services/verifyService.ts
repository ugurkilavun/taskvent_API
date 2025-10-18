// Utils
import { statusCodeErrors } from "../utils/statusCodeErrors";
import { verifyURLToken, hashURLToken } from "../utils/urlTokens";
// Repositories
import { updateVerify } from "../repositories/verifyRepository";
import { findVerify } from "../repositories/verifyRepository";

const verifyService = async (vToken: string): Promise<object> => {

  if (!vToken) throw new statusCodeErrors("Token required.", 400);

  const hash_URLToken = hashURLToken(vToken);

  const verifyFin = await findVerify(hash_URLToken);
  if (!verifyFin) throw new statusCodeErrors("Invalid token.", 400);

  if (verifyFin.used) throw new statusCodeErrors("The token has already been used.", 400);
  if (verifyFin.expiresAt < new Date()) throw new statusCodeErrors("The token has expired.", 400);

  const verToken_: boolean = verifyURLToken(hash_URLToken, verifyFin.token);
  if (!verToken_) throw new statusCodeErrors("Invalid or expired token.", 400);

  const updateVerify_: unknown = updateVerify(verifyFin.id, hash_URLToken);
  if (!updateVerify_) throw new statusCodeErrors("Token error.", 400);

  return { message: "Email verified." };

};

export default verifyService;