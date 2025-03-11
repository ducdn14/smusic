import AppHeader from '@/components/header/app.header';
import AppFooter from "@/components/footer/app.footer";
import Script from 'next/script';
import BannerSlider from '@/components/main/banner.slider';

const test = {
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "SMusic",
  "image": {
    "@type": "ImageObject",
    "url": "https://github.com/ducdn14/image-hosting/blob/main/karersee-lake.jpg",
    "width": 1080,
    "height": 1080
  },
  "telephone": "19001919",
  "url": "http:localhost:3000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "52 Ut Tich, Ward 4, Tan Binh District, Ho Chi Minh City",
    "addressLocality": "Ho Chi Minh",
    "postalCode": "700000",
    "addressRegion": "Ho Chi Minh",
    "addressCountry": "VN"
  },
  "priceRange": "1000 - 1000000000",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "21:00"
    }
  ],
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "10.79664498748942",
    "longitude": "106.65856519879867"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <BannerSlider />
      {children}
      <div style={{ marginBottom: '100px' }}></div>
      <AppFooter />
      <Script
        type='applicationld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(test) }}
        strategy='lazyOnload'
      />
    </>
  );
}
