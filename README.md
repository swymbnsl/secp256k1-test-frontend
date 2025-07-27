# MetaMask Signature Generator

A modern React application that allows users to sign messages with MetaMask and extract signature components for cross-chain verification. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Signature Components

The application extracts and displays the following signature components:

- **Message** - The original message that was signed
- **Full Signature** - Complete hexadecimal signature string
- **Signature R** - First 32 bytes of the signature as an array
- **Signature S** - Next 32 bytes of the signature as an array
- **Recovery ID** - Derived from the v value (v - 27)

## Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Modern web browser with ES6+ support

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How to Use

### Step 1: Connect MetaMask

- Click the "Connect MetaMask" button
- Approve the connection in your MetaMask extension
- Your wallet address will be displayed with a green "Connected" badge

### Step 2: Enter Message

- Type any message you want to sign in the input field
- The message can be any text you choose

### Step 3: Sign Message

- Click the "Sign Message" button
- Approve the signature request in MetaMask
- The app will display all signature components in organized sections

### Step 4: Copy Components

- Click the "Copy" button next to any component to copy it to clipboard
- The button will show "Copied!" for 2 seconds as confirmation
- Use these components in your blockchain applications

## Technical Stack

### Frontend Framework

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### UI Components

- **shadcn/ui** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Blockchain Integration

- **ethers.js** - Ethereum interaction and signature processing
- **MetaMask** - Wallet connection and signing

### Development Tools

- **ESLint** - Code linting and quality
- **TypeScript** - Static type checking

## Project Structure

```
src/
├── components/
│   └── ui/           # shadcn/ui components
├── lib/
│   └── utils.ts      # Utility functions
├── App.tsx           # Main application component
├── App.css           # Tailwind and theme styles
└── main.tsx          # Application entry point
```

## Signature Processing

The application processes MetaMask signatures to extract the components needed for cross-chain verification:

1. **Receives signature** from MetaMask in hexadecimal format
2. **Converts to bytes** using ethers.js utilities
3. **Extracts components**:
   - `r`: First 32 bytes (signature R component)
   - `s`: Next 32 bytes (signature S component)
   - `v`: Last byte (recovery bit)
   - `recovery_id`: Calculated as `v - 27`

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add <component-name>
```

### TypeScript Configuration

The project uses strict TypeScript configuration with:

- Path aliases (`@/` for `src/`)
- Strict type checking
- Modern ES2022 target
- React JSX support

## Styling

The application uses a modern dark theme with:

- **Background**: Gradient from gray-900 to gray-800
- **Cards**: Dark gray (gray-800) with subtle borders
- **Text**: White and gray-300 for optimal contrast
- **Accents**: Blue, purple, and orange indicators
- **Interactive elements**: Hover states and smooth transitions

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### MetaMask Issues

- Ensure MetaMask is installed and unlocked
- Try refreshing the page if connection fails
- Check browser console for detailed error messages
- Make sure you're on a supported network

### Copy Issues

- Ensure clipboard permissions are granted
- Try manually selecting and copying if automatic copy fails
- Check browser console for clipboard errors

### Build Issues

- Clear `node_modules` and reinstall dependencies
- Ensure Node.js version is 16 or higher
- Check TypeScript configuration

## Security Notes

- This is a demonstration application
- Signatures are processed client-side only
- No private keys are stored or transmitted
- Always verify signatures on the target blockchain
- Use in a secure environment for production applications
