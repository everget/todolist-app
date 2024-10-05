import { TranslationService } from '@/services/translation-service';
import { Locale } from '@/types';

const LOCALE_MAPPING: Record<Locale, string> = {
	en: 'en-GB',
	'pt-br': 'pt-BR',
	es: 'es-ES',
	ua: 'uk-UA',
	ru: 'ru-RU',
};

export function formatDateShort(date: Date, locale: Locale = 'en'): string {
	const mappedLocale = LOCALE_MAPPING[locale];
	const dateFormatter = new Intl.DateTimeFormat(mappedLocale, {
		month: '2-digit',
		day: '2-digit',
		year: '2-digit',
	});
	return dateFormatter.format(date);
}

export function formatDate(date: Date, locale: Locale = 'en'): string {
    const mappedLocale = LOCALE_MAPPING[locale];
    const dayFormatter = new Intl.DateTimeFormat(mappedLocale, { weekday: 'long' });
    const dateFormatter = new Intl.DateTimeFormat(mappedLocale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timeFormatter = new Intl.DateTimeFormat(mappedLocale, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: locale === 'en',
    });

    const day = dayFormatter.format(date);
    const formattedDate = dateFormatter.format(date);
    let formattedTime = timeFormatter.format(date);

    // Handle midnight and noon for English locale
    if (locale === 'en') {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      if (hours === 0 && minutes === 0) {
        formattedTime = '12:00 am';
      } else if (hours === 12 && minutes === 0) {
        formattedTime = '12:00 pm';
      }
    }

    return `${day}, ${formattedDate} ${TranslationService.t('tasks.at')} ${formattedTime}`;
  }