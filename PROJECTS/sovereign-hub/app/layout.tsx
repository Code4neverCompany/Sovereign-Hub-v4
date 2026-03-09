// PROJECTS/sovereign-hub/app/layout.tsx
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>SOVEREIGN HUB v13.0</title>
      </head>
      <body className="bg-[#020105] antialiased">
        {children}
      </body>
    </html>
  );
}
