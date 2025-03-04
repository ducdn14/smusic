import ThemeRegistry from '@/components/theme-registry/theme.registry';
import NextAuthWrapper from '@/lib/next.auth.wrapper';
import NProgressWrapper from '@/lib/nprogress';
import { TrackContextProvider } from '@/lib/track.wrapper';
import { ToastProvider } from '@/utils/toast';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: "SMusic",
  description: "SMusic description"
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NProgressWrapper>
            <NextAuthWrapper>
              <ToastProvider>
                <TrackContextProvider>
                  {children}
                </TrackContextProvider>
              </ToastProvider>
            </NextAuthWrapper>
          </NProgressWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}