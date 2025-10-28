const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const authRoutes = require("./routes/auth");
const destinationRoutes = require("./routes/destinations");
const weatherRoutes = require("./routes/weather");
const currencyRoutes = require("./routes/currency");
const walletRoutes = require("./routes/wallet");
const cultureRoutes = require("./routes/culture");
const transportRoutes = require("./routes/transport");
const itineraryRoutes = require("./routes/itinerary");
const languageRoutes = require("./routes/language");
const chatbotRoutes = require("./routes/chatbot");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/currency", currencyRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/culture", cultureRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/language", languageRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
