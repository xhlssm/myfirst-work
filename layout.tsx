
import './globals.css';
import ClientRoot from './ClientRoot';

export const metadata = {
  title: '绳网终端',
  description: 'A cyberpunk terminal simulator.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientRoot>{children}</ClientRoot>;
}

