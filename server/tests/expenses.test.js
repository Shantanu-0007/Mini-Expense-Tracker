const request = require("supertest");
const app = require("../index");
const { writeJSON } = require("../utils/storage");

beforeEach(() => {
  writeJSON("expenses.json", []);
});

describe("POST /api/expenses", () => {
  it("creates a valid expense", async () => {
    const res = await request(app).post("/api/expenses").send({
      amount: 250,
      category: "Food",
      date: "2024-06-01",
      note: "Lunch",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(250);
    expect(res.body.category).toBe("Food");
    expect(res.body.id).toBeDefined();
  });

  it("rejects negative amount", async () => {
    const res = await request(app).post("/api/expenses").send({
      amount: -100,
      category: "Food",
      date: "2024-06-01",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain("Amount must be a positive number.");
  });

  it("rejects missing category", async () => {
    const res = await request(app).post("/api/expenses").send({
      amount: 100,
      date: "2024-06-01",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain("Category is required.");
  });

  it("rejects future date", async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const res = await request(app).post("/api/expenses").send({
      amount: 100,
      category: "Food",
      date: futureDate.toISOString().split("T")[0],
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain("Date cannot be in the future.");
  });
});

describe("GET /api/expenses", () => {
  it("returns empty array initially", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("filters by category", async () => {
    await request(app).post("/api/expenses").send({ amount: 100, category: "Food", date: "2024-06-01" });
    await request(app).post("/api/expenses").send({ amount: 200, category: "Transport", date: "2024-06-01" });

    const res = await request(app).get("/api/expenses?category=Food");
    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe("Food");
  });
});

describe("DELETE /api/expenses/:id", () => {
  it("deletes an existing expense", async () => {
    const created = await request(app).post("/api/expenses").send({
      amount: 100,
      category: "Bills",
      date: "2024-06-01",
    });
    const res = await request(app).delete(`/api/expenses/${created.body.id}`);
    expect(res.statusCode).toBe(200);
  });

  it("returns 404 for non-existent expense", async () => {
    const res = await request(app).delete("/api/expenses/non-existent-id");
    expect(res.statusCode).toBe(404);
  });
});