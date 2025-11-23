import Converter from '@/components/auth/Converter'
import HomeLayout from '@/Layout/HomeLayout'
import React from 'react'

const Home = () => {
  return (
    <HomeLayout>
      <Converter />
    </HomeLayout>
  )
}

export default Home


// import Converter from '@/components/auth/Converter'
// import HomeLayout from '@/Layout/HomeLayout'
// import React from 'react'
// import Head from 'next/head'

// const Home = () => {
//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourbankstatementconverter.com'
//   const siteName = 'Your Bank Statement Converter'
//   const title = 'Your Bank Statement Converter - Convert PDF Bank Statements to Excel/CSV'
//   const description = 'Convert your PDF bank statements into organized spreadsheets instantly. Free conversion available. Support for text-based PDF files up to 10MB. Secure, fast, and easy to use.'
//   const keywords = 'bank statement converter, PDF to Excel, PDF to CSV, bank statement converter tool, convert bank statement PDF, bank statement extractor, financial statement converter, PDF converter, statement converter, bank statement parser'

//   // Structured Data (JSON-LD) for rich snippets
//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "WebApplication",
//     "name": siteName,
//     "description": description,
//     "url": siteUrl,
//     "applicationCategory": "FinanceApplication",
//     "operatingSystem": "Web",
//     "offers": {
//       "@type": "Offer",
//       "price": "0",
//       "priceCurrency": "USD"
//     },
//     "featureList": [
//       "Convert PDF bank statements to Excel/CSV",
//       "Extract transaction data automatically",
//       "Support for text-based PDF files",
//       "Secure file processing",
//       "Free conversion available"
//     ],
//     "aggregateRating": {
//       "@type": "AggregateRating",
//       "ratingValue": "4.8",
//       "ratingCount": "150"
//     }
//   }

//   const organizationStructuredData = {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     "name": siteName,
//     "url": siteUrl,
//     "logo": `${siteUrl}/logo.png`,
//     "description": description,
//     "sameAs": [
//       // Add your social media links here if available
//     ]
//   }

//   return (
//     <>
//       <Head>
//         {/* Primary Meta Tags */}
//         <title>{title}</title>
//         <meta name="title" content={title} />
//         <meta name="description" content={description} />
//         <meta name="keywords" content={keywords} />
//         <meta name="author" content={siteName} />
//         <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
//         <meta name="language" content="English" />
//         <meta name="revisit-after" content="7 days" />
//         <meta name="theme-color" content="#2563eb" />
        
//         {/* Canonical URL */}
//         <link rel="canonical" href={siteUrl} />

//         {/* Open Graph / Facebook */}
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content={siteUrl} />
//         <meta property="og:title" content={title} />
//         <meta property="og:description" content={description} />
//         <meta property="og:image" content={`${siteUrl}/logo.png`} />
//         <meta property="og:image:width" content="1200" />
//         <meta property="og:image:height" content="630" />
//         <meta property="og:image:alt" content={`${siteName} - Convert PDF Bank Statements to Excel`} />
//         <meta property="og:site_name" content={siteName} />
//         <meta property="og:locale" content="en_US" />

//         {/* Twitter */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:url" content={siteUrl} />
//         <meta name="twitter:title" content={title} />
//         <meta name="twitter:description" content={description} />
//         <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
//         <meta name="twitter:image:alt" content={`${siteName} - Convert PDF Bank Statements to Excel`} />
//         <meta name="twitter:creator" content="@yourbankstatementconverter" />
//         <meta name="twitter:site" content="@yourbankstatementconverter" />

//         {/* Additional Meta Tags */}
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
//         <meta name="format-detection" content="telephone=no" />
        
//         {/* Mobile Web App Capable */}
//         <meta name="mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
//         <meta name="apple-mobile-web-app-title" content={siteName} />

//         {/* Favicon */}
//         <link rel="icon" type="image/png" href="/logo.png" />
//         <link rel="apple-touch-icon" href="/logo.png" />

//         {/* Structured Data - JSON-LD */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
//         />
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
//         />

//         {/* Additional SEO - FAQ Schema (if applicable) */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "FAQPage",
//               "mainEntity": [
//                 {
//                   "@type": "Question",
//                   "name": "What types of PDF bank statements can I convert?",
//                   "acceptedAnswer": {
//                     "@type": "Answer",
//                     "text": "We support text-based PDF bank statements up to 10MB. Scanned/image PDFs and password-protected PDFs are not currently supported."
//                   }
//                 },
//                 {
//                   "@type": "Question",
//                   "name": "Is the bank statement converter free to use?",
//                   "acceptedAnswer": {
//                     "@type": "Answer",
//                     "text": "Yes, we offer a free conversion for new users. Sign up for unlimited conversions with advanced features."
//                   }
//                 },
//                 {
//                   "@type": "Question",
//                   "name": "How secure is my bank statement data?",
//                   "acceptedAnswer": {
//                     "@type": "Answer",
//                     "text": "Your files are processed securely and never permanently stored. We use industry-standard encryption and security measures to protect your data."
//                   }
//                 },
//                 {
//                   "@type": "Question",
//                   "name": "What format will my converted bank statement be in?",
//                   "acceptedAnswer": {
//                     "@type": "Answer",
//                     "text": "Your bank statement will be converted into a CSV (Comma-Separated Values) file that can be opened in Excel, Google Sheets, or any spreadsheet application."
//                   }
//                 }
//               ]
//             })
//           }}
//         />
//       </Head>
//       <HomeLayout>
//         <Converter />
//       </HomeLayout>
//     </>
//   )
// }

// export default Home