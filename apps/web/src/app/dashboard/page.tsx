import type { Metadata } from 'next'
import { Container } from '@/components/elements/container'
import { Heading } from '@/components/elements/heading'
import { Text } from '@/components/elements/text'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your reading statistics and manage your FlashRead Pro subscription.',
}

export default function DashboardPage() {
  return (
    <section className="py-16">
      <Container className="flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <div>
            <Heading>Dashboard</Heading>
            <Text className="mt-2">
              <p>Track your reading progress and statistics.</p>
            </Text>
          </div>
        </div>

        {/* TODO: Implement dashboard in Phase 2 */}
        {/* - Overview stats cards */}
        {/* - Reading velocity chart */}
        {/* - Reading history table */}
        {/* - Goals & streaks */}

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-olive-200 bg-white p-6 dark:border-olive-800 dark:bg-olive-900">
            <p className="text-sm font-medium text-olive-600 dark:text-olive-400">Words Today</p>
            <p className="mt-2 text-3xl font-bold text-olive-950 dark:text-white">12,450</p>
          </div>
          <div className="rounded-xl border border-olive-200 bg-white p-6 dark:border-olive-800 dark:bg-olive-900">
            <p className="text-sm font-medium text-olive-600 dark:text-olive-400">Avg Speed</p>
            <p className="mt-2 text-3xl font-bold text-olive-950 dark:text-white">485 WPM</p>
          </div>
          <div className="rounded-xl border border-olive-200 bg-white p-6 dark:border-olive-800 dark:bg-olive-900">
            <p className="text-sm font-medium text-olive-600 dark:text-olive-400">This Week</p>
            <p className="mt-2 text-3xl font-bold text-olive-950 dark:text-white">3h 24m</p>
          </div>
          <div className="rounded-xl border border-olive-200 bg-white p-6 dark:border-olive-800 dark:bg-olive-900">
            <p className="text-sm font-medium text-olive-600 dark:text-olive-400">Streak</p>
            <p className="mt-2 text-3xl font-bold text-olive-950 dark:text-white">7 days</p>
          </div>
        </div>

        {/* Recent Sessions Placeholder */}
        <div className="rounded-xl border border-olive-200 bg-white p-6 dark:border-olive-800 dark:bg-olive-900">
          <h2 className="text-lg font-semibold text-olive-950 dark:text-white">Recent Sessions</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-olive-200 text-left dark:border-olive-700">
                  <th className="pb-3 font-medium text-olive-600 dark:text-olive-400">Article</th>
                  <th className="pb-3 font-medium text-olive-600 dark:text-olive-400">WPM</th>
                  <th className="pb-3 font-medium text-olive-600 dark:text-olive-400">Words</th>
                  <th className="pb-3 font-medium text-olive-600 dark:text-olive-400">Date</th>
                </tr>
              </thead>
              <tbody className="text-olive-950 dark:text-white">
                <tr className="border-b border-olive-100 dark:border-olive-800">
                  <td className="py-3">The Future of AI...</td>
                  <td className="py-3">520</td>
                  <td className="py-3">2,340</td>
                  <td className="py-3 text-olive-600 dark:text-olive-400">Today</td>
                </tr>
                <tr className="border-b border-olive-100 dark:border-olive-800">
                  <td className="py-3">Understanding TypeScript</td>
                  <td className="py-3">445</td>
                  <td className="py-3">1,890</td>
                  <td className="py-3 text-olive-600 dark:text-olive-400">Yesterday</td>
                </tr>
                <tr>
                  <td className="py-3">React Server Components</td>
                  <td className="py-3">510</td>
                  <td className="py-3">3,200</td>
                  <td className="py-3 text-olive-600 dark:text-olive-400">2 days ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  )
}
