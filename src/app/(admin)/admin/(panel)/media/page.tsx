import { PageHeader } from '@/components/admin/page-header';
import { MediaLibrary } from '@/components/admin/media/media-library';

export const metadata = { title: 'Media' };

export default function MediaPage() {
  return (
    <>
      <PageHeader
        title='Media library'
        description='Photos used across apartments, pages and blog posts. Large images are resized automatically before upload.'
      />
      <MediaLibrary mode='manage' />
    </>
  );
}
