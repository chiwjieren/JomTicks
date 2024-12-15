# JomTicks 🎟️

A modern ticketing platform focused on fair ticket distribution and anti-scalping measures.

## ✨ Key Features

- Advanced anti-scalping protection system
- Fair queue-based ticket distribution
- Real-time ticket availability tracking
- Secure booking verification process
- User identity verification
- Price control mechanisms to prevent overcharging
- Responsive and mobile-friendly interface
- Interactive UI elements with hover effects
- Local data persistence using JSON server
- Transparent event ticket booking system

## 🎨 Design Elements

- Clean, modern interface design
- Intuitive booking flow
- Dynamic status indicators
- Space Grotesk font for clear typography
- Dark theme with elegant gradients
- Smooth transitions and hover effects
- User-friendly visual elements

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd <project-directory>
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Start JSON server:
```bash
npm run mock-api
# or
yarn mock-api
```
*remember to run the dev server and JSON server on different terminals
## 📁 Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── App.js         # Main application component
│   └── index.css      # Global styles
├── db.json           # Mock database for development
└── package.json      # Project dependencies and scripts
```

## 🛠 Configuration

The application uses a local JSON server for development. The database configuration can be found in `db.json`.

## 💻 Development

### Styling

The application uses a combination of:
- TailwindCSS for utility-first styling
- Custom CSS for animations
- CSS variables for theme consistency
- Modern UI effects
- Smooth transitions

## 📦 Dependencies

Key dependencies include:
- React
- TailwindCSS
- JSON Server (for development)
- Other dependencies can be found in `package.json`

## 🤝 Anti-Scalping Measures

Our platform implements several measures to ensure fair ticket distribution:
- Queue-based purchasing system
- User verification requirements
- Purchase limit per account
- Dynamic pricing protection
- Automated bot detection
- Secure ticket transfer system

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

happy coding!

