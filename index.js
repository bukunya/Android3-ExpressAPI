import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";

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
    const employeeId = parseInt(id);

    // Prevent deletion of employees with ID 1-7
    if (employeeId >= 1 && employeeId <= 7) {
      return res
        .status(403)
        .json({ message: "Deletion of employees with ID 1-7 is not allowed" });
    }

    await prisma.employee.delete({
      where: { id: employeeId },
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

app.get("/", (req, res) => {
  const apiDocs = {
    name: "Employee API",
    version: "1.0.0",
    description: "REST API for managing employees",
    endpoints: {
      "POST /api/employees": {
        description: "Create a new employee",
        body: {
          name: "string (required)",
          salary: "number (required)",
          age: "number (required)",
        },
      },
      "GET /api/employees": {
        description: "Get all employees",
        response: "Array of employee objects",
      },
      "GET /api/employees/:id": {
        description: "Get employee by ID",
        parameters: {
          id: "number (employee ID)",
        },
        response: "Employee object or 404 if not found",
      },
      "PATCH /api/employees/:id": {
        description: "Update employee by ID",
        parameters: {
          id: "number (employee ID)",
        },
        body: {
          name: "string (optional)",
          salary: "number (optional)",
          age: "number (optional)",
        },
        response: "Updated employee object",
      },
      "DELETE /api/employees/:id": {
        description: "Delete employee by ID (IDs 1-7 are protected)",
        parameters: {
          id: "number (employee ID)",
        },
        response: "Success message or 403 if ID 1-7",
      },
    },
  };

  res.setHeader("Content-Type", "application/json");
  res.status(200).json(apiDocs);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
