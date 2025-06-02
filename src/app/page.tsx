import { redirect } from 'next/navigation';

// Server-side redirect to educator dashboard
export default function Home() {
  // This will redirect at the server level, not client-side
  redirect('/innovations/educator-dashboard');
}
