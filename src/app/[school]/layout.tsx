import { notFound } from 'next/navigation'
import { getSchool } from '@/lib/supabase/queries'
import SchoolNav from '@/components/layout/SchoolNav'

export default async function SchoolLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ school: string }>
}) {
  const { school: slug } = await params
  const school = await getSchool(slug)

  if (!school || !school.is_active) {
    notFound()
  }

  return (
    <div data-school={school.slug}>
      <SchoolNav school={school} />
      {children}
    </div>
  )
}
