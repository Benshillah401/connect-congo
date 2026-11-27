const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the website
app.use(express.static(path.join(__dirname, "public")));

// Connect Congo packages
const packages = [
  {
    id: "free",
    name: "Free Trial",
    data: "Test Package",
    price: 0,
    currency: "XAF",
    duration: "30 minutes",
    type: "trial"
  },
  {
    id: "package1",
    name: "Package 1",
    data: "Internet Package",
    price: 10,
    currency: "XAF",
    duration: "To be configured",
    type: "paid"
  },
  {
    id: "package2",
    name: "Package 2",
    data: "Internet Package",
    price: 15,
    currency: "XAF",
    duration: "To be configured",
    type: "paid"
  },
  {
    id: "package3",
    name: "Package 3",
    data: "Internet Package",
    price: 30,
    currency: "XAF",
    duration: "To be configured",
    type: "paid"
  },
  {
    id: "package4",
    name: "Package 4",
    data: "Internet Package",
    price: 35,
    currency: "XAF",
    duration: "To be configured",
    type: "paid"
  },
  {
    id: "package5",
    name: "Package 5",
    data: "Internet Package",
    price: 40,
    currency: "XAF",
    duration: "To be configured",
    type: "paid"
  },
  {
    id: "package6",
    name: "Package 6",
    data: "Internet Package",
    price: 45,
    currency: "XAF",
    duration: "To be configured",
    type: "paid"
  }
];

// Temporary order storage.
// Use a database before accepting real customer orders.
const orders = [];

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "Connect Congo",
    country: "Congo-Brazzaville",
    currency: "XAF"
  });
});

// Get all packages
app.get("/api/packages", (req, res) => {
  res.json({
    success: true,
    currency: "XAF",
    packages
  });
});

// Submit an order or trial request
app.post("/api/orders", (req, res) => {
  const { phone, packageId } = req.body;

  if (!phone || !packageId) {
    return res.status(400).json({
      success: false,
      message: "Phone number and package are required."
    });
  }

  // Accept Congo numbers with or without +242
  const normalizedPhone = String(phone).replace(/[\s+()-]/g, "");

  if (!/^242\d{9}$/.test(normalizedPhone)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Congo-Brazzaville phone number."
    });
  }

  const selectedPackage = packages.find(
    item => item.id === packageId
  );

  if (!selectedPackage) {
    return res.status(404).json({
      success: false,
      message: "Package not found."
    });
  }

  const order = {
    id: "CC-" + Date.now(),
    phone: "+" + normalizedPhone,
    package: selectedPackage.name,
    packageId: selectedPackage.id,
    amount: selectedPackage.price,
    currency: "XAF",
    type: selectedPackage.type,
    status: selectedPackage.type === "trial"
      ? "trial_pending_activation"
      : "awaiting_payment",
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  return res.status(201).json({
    success: true,
    message: selectedPackage.type === "trial"
      ? "Free trial request received. Activation is pending."
      : "Order received. Payment is not yet connected.",
    order
  });
});

// Check order status
app.get("/api/orders/:id", (req, res) => {
  const order = orders.find(
    item => item.id === req.params.id
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found."
    });
  }

  res.json({
    success: true,
    order
  });
});

// Website homepage
app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("Connect Congo server running on port " + PORT);
});
