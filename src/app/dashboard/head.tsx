export default function Head() {
  return (
    <>
      <title>Dashboard - Recrea Padel Club</title>
      <meta name="description" content="Panel de control de Recrea Padel Club - Gestiona tus torneos, reservas y más" />
      
      {/* Open Graph / Social Media */}
      <meta property="og:title" content="Dashboard - Recrea Padel Club" />
      <meta property="og:description" content="Panel de control de Recrea Padel Club" />
      <meta property="og:type" content="website" />
      
      {/* Preload de recursos críticos */}
      <link
        rel="preload"
        href="/assets/recrealogo.jpeg"
        as="image"
        type="image/jpeg"
      />
      
      {/* Preconnect a servicios externos */}
      <link
        rel="preconnect"
        href="https://goipmracccjxjmhpizib.supabase.co"
      />
    </>
  )
} 