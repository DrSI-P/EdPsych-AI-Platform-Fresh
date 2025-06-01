import { Metadata } from 'next';
import ClientWrapper from '@/components/restorative-justice/client-wrapper';

export const metadata: Metadata = {
  title: 'Guided Restorative Conversation Frameworks | EdPsych Connect',
  description: 'Evidence-based frameworks for conducting restorative conversations based on restorative justice principles.',
};

export default function GuidedRestorativeConversationFrameworksPage() {
  return <ClientWrapper />;
}
