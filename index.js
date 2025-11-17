import "dotenv/config";
import express from "express";
import { PrismaClient } from "./generated/client.ts";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * [CREATE] POST /api/employees
 */
app.post("/api/employees", async (req, res) => {
  try {
    const { name, salary, age } = req.body;

    if (!name || !salary || !age) {
      return res
        .status(400)
        .json({ message: "Name, salary, and age are required." });
    }

    const newEmployee = await prisma.employee.create({
      data: {
        name: name,
        salary: parseInt(salary),
        age: parseInt(age),
      },
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating employee", error: error.message });
  }
});

/**
 * [READ] GET /api/employees
 */
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employees", error: error.message });
  }
});

/**
 * [READ] GET /api/employees/:id
 */
app.get("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employee", error: error.message });
  }
});

/**
 * [UPDATE] PATCH /api/employees/:id
 */
app.patch("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, salary, age } = req.body;

    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        name,
        salary: salary ? parseInt(salary) : undefined,
        age: age ? parseInt(age) : undefined,
      },
    });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Employee not found" });
    }
    res
      .status(500)
      .json({ message: "Error updating employee", error: error.message });
  }
});

/**
 * [DELETE] DELETE /api/employees/:id
 */
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.employee.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Employee deleted successfully." });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Employee not found" });
    }
    res
      .status(500)
      .json({ message: "Error deleting employee", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
