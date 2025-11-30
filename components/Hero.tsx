'use client';

import { ArrowRight, Zap } from 'lucide-react';

export default function Hero() {
  const roles = [
    {
      title: 'Руководитель',
      description: 'Управляйте своей компанией с интеллектуальной платформой',
      icon: Zap,
      color: 'from-blue-600 to-primary-600',
      href: '#',
    },
    {
      title: 'Менеджер',
      description: 'Автоматизируйте процессы и увеличивайте эффективность',
      icon: Zap,
      color: 'from-cyan-600 to-blue-600',
      href: '#',
    },
    {
      title: 'Специалист',
      description: 'Получайте инструменты для решения сложных задач',
      icon: Zap,
      color: 'from-teal-600 to-cyan-600',
      href: '#',
    },
  ];

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30">
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
              Премиум B2B решение
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Современная платформа для промышленного взаимодействия
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Интегрированное решение для управления бизнес-процессами с оптимизацией продуктивности и
            безопасностью на уровне предприятия
          </p>

          {/* CTA Button */}
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors">
            Начать работу
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-500 transition-all duration-300"
              >
                {/* Gradient accent */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${role.color} rounded-2xl opacity-0 group-hover:opacity-10 transition duration-300 -z-10`}
                />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center mb-4`}
                >
                  <Icon size={24} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {role.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">{role.description}</p>

                {/* CTA */}
                <a
                  href={role.href}
                  className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:gap-3 transition-all"
                >
                  Выбрать
                  <ArrowRight size={18} />
                </a>
              </div>
            );
          })}
        </div>

        {/* Features highlight */}
        <div className="mt-20 pt-20 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Быстрота', value: '99.9%' },
              { label: 'Надежность', value: '100%' },
              { label: 'Удобство', value: 'A+' },
              { label: 'Поддержка', value: '24/7' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
