import type { Metadata } from 'next';
import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Frosthaven Tiles',
  description: 'Manage your Frosthaven Scenario Tiles',
  keywords: ['Frosthaven', 'Frosthaven Scenario', 'Frosthaven Tiles', 'Frosthaven Map'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <SpeedInsights />
        <main role='main'>
          {children}
        </main>
      </body>
    </html>
  );
}
