import { api } from "./api";
import { useAuthStore } from "./store";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("sg_session");
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("sg_session", sid);
  }
  return sid;
}

export type InteractionType = "view" | "search" | "add_to_cart" | "quote_request" | "order" | "download_catalogue";

export function track(interaction: InteractionType, productId?: string, categoryId?: string) {
  try {
    const user = useAuthStore.getState().user;
    api.post("/api/recommendations/track", {
      product_id: productId || null,
      category_id: categoryId || null,
      interaction,
      session_id: getSessionId(),
      user_id: user?.id || null,
    }).catch(() => {}); // fire and forget, never block UI
  } catch {}
}
