/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Öffentlicher Lead-Funnel (FA-FUNNEL): schöne URLs auf die statischen
  // Dateien in public/funnel mappen (Next kennt kein Directory-Index).
  async rewrites() {
    return {
      // beforeFiles: läuft VOR dem Routen-/Dateisystem-Match — nötig, weil "/"
      // im Portal eine echte Route ist. Auf der Ads-Domain partner.varmova.de
      // zeigt die Startseite direkt die B2B-Landingpage; alle anderen Domains
      // bleiben unberührt.
      beforeFiles: [
        {
          source: '/',
          destination: '/partner/index.html',
          has: [{ type: 'host', value: 'partner.varmova.de' }],
        },
      ],
      afterFiles: [
        { source: '/funnel', destination: '/funnel/index.html' },
        { source: '/funnel/bestaetigt', destination: '/funnel/bestaetigt.html' },
        { source: '/partner-werden', destination: '/partner/index.html' },
      ],
    };
  },
};

export default nextConfig;
