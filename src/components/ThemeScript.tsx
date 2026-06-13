export function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('theme');
        if (stored === 'night' || stored === 'day') {
          document.documentElement.setAttribute('data-theme', stored);
          return;
        }
        // Respect system preference when no stored value
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'night' : 'day');
      } catch (e) {
        // localStorage unavailable (private browsing, etc.)
        document.documentElement.setAttribute('data-theme', 'night');
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
