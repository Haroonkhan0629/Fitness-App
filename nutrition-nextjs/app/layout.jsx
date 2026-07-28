import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Providers from './providers';
import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'Fit2Go',
  description: 'Fitness and nutrition tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
