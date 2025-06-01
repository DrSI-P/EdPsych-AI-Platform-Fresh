import { Metadata } from 'next';
import ClientPage from '@/components/restorative-justice/conversation-frameworks-client';

export const metadata: Metadata = {
  title: 'Guided Restorative Conversation Frameworks | EdPsych Connect',
  description: 'Evidence-based frameworks for facilitating restorative conversations and conferences in educational settings.',
};

export default function RestorativeConversationFrameworksPage() {
  return <ClientPage />;
}
