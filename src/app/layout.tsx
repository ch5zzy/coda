import './globals.css'

export const metadata = {
  title: 'Coda',
  description: 'Online coding environment.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
