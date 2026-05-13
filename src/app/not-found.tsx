import Link from 'next/link';
import { Container } from '@/components/Container';

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-600">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
      >
        Back to home
      </Link>
    </Container>
  );
}
