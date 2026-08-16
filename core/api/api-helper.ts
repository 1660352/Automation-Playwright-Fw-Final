import { APIRequestContext, request } from "@playwright/test";

const BASE_API = "https://testing.platformforge.dev/api";

export class ApiHelper {
  private token: string = "";
  private context!: APIRequestContext;

  async init(): Promise<void> {
    this.context = await request.newContext();
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; user: any }> {
    const resp = await this.context.post(`${BASE_API}/auth/login`, {
      data: { username, password },
    });
    if (!resp.ok()) {
      const text = await resp.text();
      throw new Error(
        `Login failed (${resp.status()}): ${text.substring(0, 200)}`,
      );
    }
    const body = await resp.json();
    this.token = body.token;
    return body;
  }

  private headers() {
    return { Authorization: `Bearer ${this.token}` };
  }

  // ── Products ──────────────────────────────────────────
  async getProducts(): Promise<any[]> {
    const resp = await this.context.get(`${BASE_API}/products`, {
      headers: this.headers(),
    });
    return resp.json();
  }

  // ── Cart ──────────────────────────────────────────────
  async getCart(): Promise<any[]> {
    const resp = await this.context.get(`${BASE_API}/cart`, {
      headers: this.headers(),
    });
    return resp.json();
  }

  async clearCart(): Promise<void> {
    await this.context.put(`${BASE_API}/cart`, {
      headers: this.headers(),
      data: { items: [] },
    });
  }

  // ── Orders ────────────────────────────────────────────
  async createOrder(order: {
    items: any[];
    recipientName: string;
    recipientPhone: string;
    address: string;
    paymentMethod: string;
    totalPrice: number;
  }): Promise<any> {
    const resp = await this.context.post(`${BASE_API}/orders`, {
      headers: this.headers(),
      data: order,
    });
    return resp.json();
  }

  async deleteAllOrders(): Promise<void> {
    await this.context.delete(`${BASE_API}/orders`, {
      headers: this.headers(),
    });
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.context.delete(`${BASE_API}/orders/${orderId}`, {
      headers: this.headers(),
    });
  }

  // ── Profile ───────────────────────────────────────────
  async getProfile(): Promise<any> {
    const resp = await this.context.get(`${BASE_API}/profile`, {
      headers: this.headers(),
    });
    return resp.json();
  }

  async updateProfile(name: string): Promise<any> {
    const resp = await this.context.patch(`${BASE_API}/profile`, {
      headers: this.headers(),
      multipart: { name },
    });
    return resp.json();
  }

  async dispose(): Promise<void> {
    await this.context.dispose();
  }
}
