// Navigation script to ensure consistent navigation across all pages
document.addEventListener('DOMContentLoaded', function() {
  // Create the navigation HTML
  const navHTML = `
    <div class="logo">
      <a href="index.html">TravelPlan</a>
    </div>
    <div class="header-actions">
      <a href="dashboard.html">
        <i class="fas fa-th-large"></i>
        Dashboard
      </a>
      <a href="destination.html">
        <i class="fas fa-map-marker-alt"></i>
        Destinations
      </a>
      <a href="itinerary.html">
        <i class="fas fa-route"></i>
        Itinerary
      </a>
      <a href="weather.html">
        <i class="fas fa-cloud-sun"></i>
        Weather
      </a>
      <a href="currency.html">
        <i class="fas fa-money-bill-wave"></i>
        Currency
      </a>
      <a href="wallet.html">
        <i class="fas fa-wallet"></i>
        Expenses
      </a>
      <a href="language.html">
        <i class="fas fa-language"></i>
        Language
      </a>
      <a href="culture.html">
        <i class="fas fa-globe-americas"></i>
        Culture
      </a>
      <a href="transport.html">
        <i class="fas fa-bus"></i>
        Transport
      </a>
      <a href="chatbot.html">
        <i class="fas fa-comment-dots"></i>
        Assistant
      </a>
    </div>
  `;
  
  // Insert the navigation into the header
  const header = document.querySelector('.main-header');
  if (header) {
    header.innerHTML = navHTML;
  }
});