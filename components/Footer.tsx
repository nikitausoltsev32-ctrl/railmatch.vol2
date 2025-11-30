export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Компания',
      links: [
        { label: 'О нас', href: '#' },
        { label: 'Блог', href: '#' },
        { label: 'Карьера', href: '#' },
      ],
    },
    {
      title: 'Решения',
      links: [
        { label: 'Для руководителей', href: '#' },
        { label: 'Для менеджеров', href: '#' },
        { label: 'Для специалистов', href: '#' },
      ],
    },
    {
      title: 'Ресурсы',
      links: [
        { label: 'Документация', href: '#' },
        { label: 'API', href: '#' },
        { label: 'Поддержка', href: '#' },
      ],
    },
    {
      title: 'Правовая информация',
      links: [
        { label: 'Политика конфиденциальности', href: '#' },
        { label: 'Условия использования', href: '#' },
        { label: 'Контакты', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              B2B
            </div>
            <p className="text-sm text-slate-400">
              Промышленная платформа для современного бизнеса
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">
            © {currentYear} B2B Platform. Все права защищены.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
              Twitter
            </a>
            <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
