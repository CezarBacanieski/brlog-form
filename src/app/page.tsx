'use client';

import Image from 'next/image';
import { useState } from 'react';
import { LanguageCode, translations } from '../locales';

export default function Home() {
  const [language, setLanguage] = useState<LanguageCode>('pt');
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaChecked) {
      alert(t.captchaAlert);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: t.successMessage,
        });

        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        setCaptchaChecked(false);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || t.errorMessage,
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      setSubmitStatus({
        type: 'error',
        message: t.connectionError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numbers = value.replace(/\D/g, '');
      let formatted = numbers;

      if (numbers.length <= 2) {
        formatted = numbers;
      } else if (numbers.length <= 4) {
        formatted = `+${numbers.slice(0, 2)} ${numbers.slice(2)}`;
      } else if (numbers.length <= 6) {
        formatted = `+${numbers.slice(0, 2)} (${numbers.slice(
          2,
          4
        )}) ${numbers.slice(4)}`;
      } else if (numbers.length <= 10) {
        formatted = `+${numbers.slice(0, 2)} (${numbers.slice(
          2,
          4
        )}) ${numbers.slice(4, 8)}-${numbers.slice(8)}`;
      } else {
        formatted = `+${numbers.slice(0, 2)} (${numbers.slice(
          2,
          4
        )}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`;
      }
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div
      className='min-h-screen bg-cover bg-center bg-no-repeat'
      style={{
        backgroundImage: 'url(/images/background.png)',
      }}
    >
      <div className='min-h-screen bg-black/40'>
        <div className='container mx-auto px-4 py-6 sm:py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 max-w-7xl mx-auto'>
            {/* Lado Esquerdo */}
            <div className='flex flex-col space-y-6 sm:space-y-8'>
              {/* Logo */}
              <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex items-center justify-center'>
                <Image
                  src='/logo-brc.png'
                  alt='BRCLOG Logo'
                  width={280}
                  height={120}
                  priority
                  className='max-w-full h-auto object-contain'
                />
              </div>

              {/* Vídeo do YouTube */}
              <div className='bg-white rounded-2xl shadow-lg p-4 sm:p-6'>
                <div className='aspect-video rounded-lg overflow-hidden bg-gray-900'>
                  <iframe
                    width='100%'
                    height='100%'
                    src='https://www.youtube.com/embed/O1oERqD6k68'
                    title='YouTube video player'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    className='w-full h-full'
                  ></iframe>
                </div>
              </div>

              {/* Botão WhatsApp */}
              <a
                href='https://wa.me/5511968500353'
                target='_blank'
                rel='noopener noreferrer'
                className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 group text-base sm:text-lg'
              >
                <svg
                  className='w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
                </svg>
                <span>{t.whatsappButton}</span>
              </a>
            </div>

            {/* Formulário */}
            <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col'>
              {/* BOTÃO DE IDIOMA  */}
              <div className='flex justify-end mb-6 -mt-2 -mr-2'>
                <div className='flex gap-1.5 bg-gray-100 rounded-full p-1.5'>
                  <button
                    onClick={() => setLanguage('pt')}
                    className={`px-3.5 py-1.5 rounded-full font-medium text-sm transition-all duration-200 ${
                      language === 'pt'
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🇧🇷 PT
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3.5 py-1.5 rounded-full font-medium text-sm transition-all duration-200 ${
                      language === 'en'
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🇺🇸 EN
                  </button>
                </div>
              </div>

              <div className='mb-6 sm:mb-8'>
                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3'>
                  {t.contactTitle}
                </h1>
                <p className='text-gray-600 text-base sm:text-lg'>
                  {t.contactSubtitle}
                </p>
              </div>

              {/* Mensagem de Status */}
              {submitStatus.type && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    submitStatus.type === 'success'
                      ? 'bg-green-50 border-2 border-green-200 text-green-800'
                      : 'bg-red-50 border-2 border-red-200 text-red-800'
                  }`}
                >
                  <p className='font-semibold flex items-center gap-2'>
                    {submitStatus.type === 'success' ? '✓' : '✕'}{' '}
                    {submitStatus.message}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-5 sm:space-y-6'>
                {/* Inputs */}
                {['name', 'email', 'phone'].map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      {field === 'name'
                        ? t.fullName
                        : field === 'email'
                        ? t.email
                        : t.phone}
                    </label>
                    <input
                      type={
                        field === 'email'
                          ? 'email'
                          : field === 'phone'
                          ? 'tel'
                          : 'text'
                      }
                      id={field}
                      name={field}
                      required
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900 text-base disabled:bg-gray-100 disabled:cursor-not-allowed'
                      placeholder={
                        field === 'name'
                          ? t.namePlaceholder
                          : field === 'email'
                          ? t.emailPlaceholder
                          : t.phonePlaceholder
                      }
                    />
                  </div>
                ))}

                {/* Mensagem */}
                <div>
                  <label
                    htmlFor='message'
                    className='block text-sm font-semibold text-gray-700 mb-2'
                  >
                    {t.message}
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    required
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    rows={4}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none text-gray-900 text-base disabled:bg-gray-100 disabled:cursor-not-allowed'
                    placeholder={t.messageQuestion}
                  />
                </div>

                {/* Captcha + botão */}
                <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4'>
                  <div className='flex items-center justify-start space-x-3 bg-gray-50 p-3 sm:p-4 rounded-lg border-2 border-gray-200 flex-shrink-0'>
                    <input
                      type='checkbox'
                      id='captcha'
                      checked={captchaChecked}
                      onChange={(e) => setCaptchaChecked(e.target.checked)}
                      disabled={isSubmitting}
                      className='w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed'
                    />
                    <label
                      htmlFor='captcha'
                      className='text-sm text-gray-700 cursor-pointer select-none'
                    >
                      {t.notRobot}
                    </label>
                  </div>

                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full sm:flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] text-base sm:text-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none'
                  >
                    {isSubmitting ? t.sending : t.sendButton}
                  </button>
                </div>
              </form>

              <div className='mt-6 sm:mt-8 pt-6 sm:pt-8 border-t-2 border-gray-100'>
                <div className='text-center space-y-2'>
                  <p className='text-base sm:text-lg font-semibold text-gray-800'>
                    {language === 'pt'
                      ? t.completeOperator
                      : "One of the country's most complete logistics operators"}
                  </p>
                  <p className='text-sm sm:text-base text-gray-600 italic'>
                    {language === 'pt'
                      ? "One of the country's most complete logistics operator"
                      : 'Um dos operadores logísticos mais completos do país'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
